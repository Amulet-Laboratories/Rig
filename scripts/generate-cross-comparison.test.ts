/**
 * generate-cross-comparison.test.ts
 *
 * Cross-library comparison benchmark — mounts both Rig components AND their
 * equivalents from competitor Vue libraries (Reka UI, Headless UI, Ant Design
 * Vue, Flowbite Vue) in jsdom. Measures mount/unmount timing, DOM nodes, and
 * axe-core accessibility scores for head-to-head comparison.
 *
 * Usage:
 *   pnpm cross-comparison   # run all cross-library benchmarks
 *   vitest run scripts/generate-cross-comparison.test.ts
 *
 * Results merge into .health/comparison.json alongside existing data.
 * Existing entries ARE overwritten to allow re-benchmarking.
 */

import { describe, it, expect, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import axe from 'axe-core'
import { COMPONENT_MAP, type ComponentMapEntry } from './competitor-map'

// ── Types ────────────────────────────────────────────────────────────────────

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
  stats?: {
    totalResults: number
    reliableResults: number
    warningResults: number
    errorResults: number
  }
}

// ── Configuration ────────────────────────────────────────────────────────────

const ITERATIONS = 30
const ROOT = resolve(import.meta.dirname!, '..')
const HEALTH_DIR = resolve(ROOT, '.health')
const COMPARISON_PATH = resolve(HEALTH_DIR, 'comparison.json')

// ── Helpers ──────────────────────────────────────────────────────────────────

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function p95(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.ceil(sorted.length * 0.95) - 1
  return sorted[Math.min(idx, sorted.length - 1)]
}

function round(n: number, decimals = 4): number {
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}

// ── Benchmark engine ─────────────────────────────────────────────────────────

async function benchmarkSingle(
  lib: string,
  libName: string,
  componentName: string,
  component: unknown,
  props?: Record<string, unknown>,
): Promise<MountResult> {
  const mountTimes: number[] = []
  const unmountTimes: number[] = []
  let domNodeCount = 0
  let reliable = true
  let renderWarning: string | undefined

  try {
    // Warm-up
    const warmup = mount(component, { props })
    warmup.unmount()

    // Timed iterations
    for (let i = 0; i < ITERATIONS; i++) {
      const t0 = performance.now()
      const w = mount(component, { props })
      const t1 = performance.now()

      if (i === 0) {
        domNodeCount = w.element.querySelectorAll('*').length + 1
      }

      w.unmount()
      const t2 = performance.now()

      mountTimes.push(t1 - t0)
      unmountTimes.push(t2 - t1)
    }

    // Check rendered content
    const check = mount(component, { props })
    if (check.element.innerHTML === '' || check.element.childElementCount === 0) {
      if (domNodeCount <= 1) {
        renderWarning = 'Component rendered with no visible content'
        reliable = false
      }
    }

    // Axe-core accessibility audit
    let a11yViolations = 0
    let a11yPasses = 0

    try {
      const container = check.element as Element
      if (!document.body.contains(container)) {
        document.body.appendChild(container)
      }

      const results = await axe.run(container, {
        rules: {
          'color-contrast': { enabled: false },
          'page-has-heading-one': { enabled: false },
          'landmark-one-main': { enabled: false },
          region: { enabled: false },
          bypass: { enabled: false },
          'document-title': { enabled: false },
          'html-has-lang': { enabled: false },
        },
        resultTypes: ['violations', 'passes'],
      })

      a11yViolations = results.violations.length
      a11yPasses = results.passes.length
    } catch (axeErr) {
      renderWarning = `axe-core: ${(axeErr as Error).message?.slice(0, 80)}`
    }

    check.unmount()

    const a11yScore =
      a11yPasses + a11yViolations > 0
        ? Math.round((a11yPasses / (a11yPasses + a11yViolations)) * 100)
        : 100

    return {
      lib,
      libName,
      componentName,
      mountMedianMs: round(median(mountTimes)),
      mountP95Ms: round(p95(mountTimes)),
      unmountMedianMs: round(median(unmountTimes)),
      domNodeCount,
      a11yViolations,
      a11yPasses,
      a11yScore,
      reliable,
      ...(renderWarning ? { renderWarning } : {}),
    }
  } catch (err) {
    return {
      lib,
      libName,
      componentName,
      mountMedianMs: 0,
      mountP95Ms: 0,
      unmountMedianMs: 0,
      domNodeCount: 0,
      a11yViolations: 0,
      a11yPasses: 0,
      a11yScore: 0,
      reliable: false,
      error: (err as Error).message?.slice(0, 200),
    }
  }
}

// ── Benchmark a full component entry (Rig + all competitors) ─────────────────

async function benchmarkComponentEntry(
  entry: ComponentMapEntry,
): Promise<ComparisonResult> {
  const results: MountResult[] = []

  // Benchmark Rig's version
  const rigResult = await benchmarkSingle(
    'rig',
    'Rig',
    entry.rigComponent,
    entry.rigComponentRef,
    entry.rigProps,
  )
  results.push(rigResult)

  // Benchmark each competitor
  for (const comp of entry.competitors) {
    const compResult = await benchmarkSingle(
      comp.lib,
      comp.libName,
      comp.componentName,
      comp.component,
      comp.props,
    )
    results.push(compResult)
  }

  return {
    rigComponent: entry.rigComponent,
    rigPackage: entry.rigPackage,
    results,
  }
}

// ── Main test suite ──────────────────────────────────────────────────────────

const allResults: ComparisonResult[] = []

describe('Cross-library comparison benchmarks', () => {
  for (const entry of COMPONENT_MAP) {
    const competitorCount = entry.competitors.length
    const label =
      competitorCount > 0
        ? `${entry.rigComponent} (rig + ${competitorCount} competitor${competitorCount > 1 ? 's' : ''})`
        : `${entry.rigComponent} (rig only)`

    it(label, async () => {
      console.log(`  Benchmarking ${entry.rigComponent}...`)
      const result = await benchmarkComponentEntry(entry)
      allResults.push(result)

      // Verify Rig result exists
      const rigResult = result.results.find((r) => r.lib === 'rig')
      expect(rigResult).toBeDefined()
      expect(rigResult!.mountMedianMs).toBeGreaterThanOrEqual(0)

      // Log summary
      for (const r of result.results) {
        const status = r.error ? 'ERROR' : r.reliable ? 'OK' : 'WARN'
        console.log(
          `    [${status}] ${r.libName} ${r.componentName}: ` +
            `mount=${r.mountMedianMs}ms, a11y=${r.a11yScore}, ` +
            `dom=${r.domNodeCount}, violations=${r.a11yViolations}`,
        )
      }
    })
  }

  afterAll(() => {
    if (allResults.length === 0) return

    // Load existing comparison data
    if (!existsSync(HEALTH_DIR)) mkdirSync(HEALTH_DIR, { recursive: true })

    let data: ComparisonOutput
    if (existsSync(COMPARISON_PATH)) {
      data = JSON.parse(readFileSync(COMPARISON_PATH, 'utf-8')) as ComparisonOutput
    } else {
      data = {
        timestamp: new Date().toISOString(),
        iterations: ITERATIONS,
        comparisons: [],
      }
    }

    // Merge: replace existing entries, add new ones
    for (const newResult of allResults) {
      const existingIdx = data.comparisons.findIndex(
        (c) => c.rigComponent === newResult.rigComponent,
      )
      if (existingIdx >= 0) {
        data.comparisons[existingIdx] = newResult
      } else {
        data.comparisons.push(newResult)
      }
    }

    // Update timestamp
    data.timestamp = new Date().toISOString()

    // Recompute stats
    let totalResults = 0
    let reliableResults = 0
    let warningResults = 0
    let errorResults = 0
    for (const comp of data.comparisons) {
      for (const r of comp.results) {
        totalResults++
        if (r.error) errorResults++
        else if (r.renderWarning) warningResults++
        else if (r.reliable) reliableResults++
        else warningResults++
      }
    }
    data.stats = { totalResults, reliableResults, warningResults, errorResults }

    writeFileSync(COMPARISON_PATH, `${JSON.stringify(data, null, 2)}\n`)

    // Summary
    const mapped = allResults.filter((r) => r.results.length > 1).length
    const rigOnly = allResults.filter((r) => r.results.length === 1).length
    console.log(`\n  === CROSS-COMPARISON COMPLETE ===`)
    console.log(`    Components benchmarked: ${allResults.length}`)
    console.log(`    With competitors: ${mapped}`)
    console.log(`    Rig-only: ${rigOnly}`)
    console.log(`    Total comparison.json entries: ${data.comparisons.length}`)
    console.log(`    Total results: ${data.stats.totalResults}`)
  })
})
