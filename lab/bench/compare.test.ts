/**
 * Component comparison benchmark suite.
 *
 * Run with: pnpm bench:compare
 *
 * This file runs as a Vitest test (not bench mode) because we need async
 * operations (axe-core) and JSON output. Uses performance.now() for timing.
 */
import { describe, it, expect } from 'vitest'
import { createApp, h, type Component } from 'vue'
import { comparisons } from './component-map'
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ITERATIONS = 30
const WARMUP = 3

interface MountResult {
  lib: string
  libName: string
  componentName: string
  mountMedianMs: number
  mountP95Ms: number
  unmountMedianMs: number
  domNodeCount: number
  a11yViolations: number
  a11yPasses: number
  a11yScore: number
  /** Whether this result represents a clean, meaningful render */
  reliable: boolean
  error?: string
  renderWarning?: string
}

interface ComparisonResult {
  rigComponent: string
  rigPackage: string
  results: MountResult[]
}

interface ComparisonOutput {
  timestamp: string
  iterations: number
  comparisons: ComparisonResult[]
  /** Summary stats across all results */
  stats: {
    totalResults: number
    reliableResults: number
    warningResults: number
    errorResults: number
  }
}

function countNodes(el: HTMLElement): number {
  return el.querySelectorAll('*').length
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, idx)]
}

/**
 * Create a Vue app with error suppression so rendering errors (common in jsdom
 * for competitor component libraries) don't throw — we still get partial DOM
 * and timing data.
 */
function createSilentApp(comp: Component, props: Record<string, unknown>, slotContent?: string) {
  const renderErrors: string[] = []
  const app = createApp({
    render: () => h(comp, props, slotContent ? { default: () => slotContent } : undefined),
  })
  app.config.errorHandler = (err: unknown) => {
    renderErrors.push(err instanceof Error ? err.message : String(err))
  }
  app.config.warnHandler = () => {} // suppress Vue warnings in bench
  return { app, renderErrors }
}

async function measureComponent(
  comp: Component,
  props: Record<string, unknown>,
  slotContent?: string,
): Promise<{ mountMedian: number; mountP95: number; unmountMedian: number; nodeCount: number; renderError?: string }> {
  const mountTimes: number[] = []
  const unmountTimes: number[] = []
  let nodeCount = 0
  let renderError: string | undefined

  // Warmup
  for (let i = 0; i < WARMUP; i++) {
    const c = document.createElement('div')
    document.body.appendChild(c)
    const { app, renderErrors } = createSilentApp(comp, props, slotContent)
    app.mount(c)
    if (i === 0 && renderErrors.length > 0) renderError = renderErrors[0]
    app.unmount()
    c.remove()
  }

  // If warmup produced render errors, the component can't mount in jsdom —
  // still measure the attempt to get comparable timing but flag it.
  // Measure
  for (let i = 0; i < ITERATIONS; i++) {
    const c = document.createElement('div')
    document.body.appendChild(c)

    const { app, renderErrors } = createSilentApp(comp, props, slotContent)

    const t0 = performance.now()
    app.mount(c)
    const t1 = performance.now()
    mountTimes.push(t1 - t0)

    if (i === 0 && renderErrors.length > 0 && !renderError) {
      renderError = renderErrors[0]
    }

    nodeCount = countNodes(c)

    const t2 = performance.now()
    app.unmount()
    const t3 = performance.now()
    unmountTimes.push(t3 - t2)

    c.remove()
  }

  mountTimes.sort((a, b) => a - b)
  unmountTimes.sort((a, b) => a - b)
  const mid = Math.floor(mountTimes.length / 2)

  return {
    mountMedian: Number(mountTimes[mid].toFixed(4)),
    mountP95: Number(percentile(mountTimes, 95).toFixed(4)),
    unmountMedian: Number(unmountTimes[mid].toFixed(4)),
    nodeCount,
    renderError,
  }
}

async function runA11y(
  comp: Component,
  props: Record<string, unknown>,
  slotContent?: string,
): Promise<{ violations: number; passes: number; score: number }> {
  try {
    const axe = await import('axe-core')
    const c = document.createElement('div')
    document.body.appendChild(c)
    const { app } = createSilentApp(comp, props, slotContent)
    app.mount(c)

    const results = await axe.default.run(c, {
      rules: {
        region: { enabled: false },
        'page-has-heading-one': { enabled: false },
        'landmark-one-main': { enabled: false },
      },
    })

    app.unmount()
    c.remove()

    const violations = results.violations.length
    const passes = results.passes.length
    const total = violations + passes
    const score = total > 0 ? Math.round((passes / total) * 100) : 100
    return { violations, passes, score }
  } catch {
    return { violations: -1, passes: -1, score: 0 }
  }
}

async function benchEntry(
  lib: string,
  libName: string,
  componentName: string,
  loadFn: () => Promise<Component>,
  props: Record<string, unknown>,
  slotContent?: string,
): Promise<MountResult> {
  try {
    const comp = await loadFn()
    const perf = await measureComponent(comp, props, slotContent)
    const a11y = await runA11y(comp, props, slotContent)

    return {
      lib,
      libName,
      componentName,
      mountMedianMs: perf.mountMedian,
      mountP95Ms: perf.mountP95,
      unmountMedianMs: perf.unmountMedian,
      domNodeCount: perf.nodeCount,
      a11yViolations: a11y.violations,
      a11yPasses: a11y.passes,
      a11yScore: a11y.score,
      reliable: !perf.renderError && perf.nodeCount > 0,
      ...(perf.renderError ? { renderWarning: perf.renderError } : {}),
    }
  } catch (e: unknown) {
    return {
      lib,
      libName,
      componentName,
      mountMedianMs: -1,
      mountP95Ms: -1,
      unmountMedianMs: -1,
      domNodeCount: 0,
      a11yViolations: -1,
      a11yPasses: -1,
      a11yScore: 0,
      reliable: false,
      error: e instanceof Error ? e.message : String(e),
    }
  }
}

describe('Component Comparison Benchmarks', () => {
  const allResults: ComparisonResult[] = []

  for (const comparison of comparisons) {
    describe(comparison.rig.name, () => {
      it(`should benchmark Rig ${comparison.rig.name} and ${comparison.competitors.length} competitors`, { timeout: 30000 }, async () => {
        const compResult: ComparisonResult = {
          rigComponent: comparison.rig.name,
          rigPackage: comparison.rig.pkg,
          results: [],
        }

        // Rig
        const rigResult = await benchEntry(
          'rig',
          'Rig',
          comparison.rig.name,
          comparison.rig.load,
          comparison.rig.props,
          comparison.rig.slotContent,
        )
        compResult.results.push(rigResult)
        // Non-fatal: some components need injection context or specific props
        // that aren't available in a bare jsdom env

        // Competitors
        for (const competitor of comparison.competitors) {
          const result = await benchEntry(
            competitor.lib,
            competitor.libName,
            competitor.componentName,
            competitor.load,
            competitor.props,
            competitor.slotContent,
          )
          compResult.results.push(result)
        }

        allResults.push(compResult)
      })
    })
  }

  // Write results after all benchmarks complete
  it('should write comparison results', () => {
    // Compute summary stats
    let totalResults = 0
    let reliableResults = 0
    let warningResults = 0
    let errorResults = 0
    for (const comp of allResults) {
      for (const r of comp.results) {
        totalResults++
        if (r.reliable) reliableResults++
        if (r.renderWarning) warningResults++
        if (r.error) errorResults++
      }
    }

    const output: ComparisonOutput = {
      timestamp: new Date().toISOString(),
      iterations: ITERATIONS,
      comparisons: allResults,
      stats: {
        totalResults,
        reliableResults,
        warningResults,
        errorResults,
      },
    }

    const healthDir = resolve(import.meta.dirname!, '../../.health')
    if (!existsSync(healthDir)) mkdirSync(healthDir, { recursive: true })

    writeFileSync(
      resolve(healthDir, 'comparison.json'),
      JSON.stringify(output, null, 2),
    )

    console.log(`\n  Written ${allResults.length} comparisons to .health/comparison.json`)
    expect(allResults.length).toBeGreaterThan(0)
  })
})
