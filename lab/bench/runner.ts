/**
 * Component Comparison Runner
 *
 * Mounts Rig components and competitors, measures:
 * - Mount time (median of N iterations)
 * - Unmount time
 * - DOM node count
 * - Accessibility violations (axe-core)
 *
 * Outputs .health/comparison.json
 */
import { createApp, h, type Component } from 'vue'
import axe from 'axe-core'
import { comparisons, type ComponentComparison, type CompetitorEntry, type RigEntry } from './component-map.js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const ITERATIONS = 50
const WARMUP = 5

interface MountResult {
  lib: string
  libName: string
  componentName: string
  mountTimeMs: number
  unmountTimeMs: number
  domNodeCount: number
  a11yViolations: number
  a11yPasses: number
  a11yScore: number
  error?: string
}

interface ComparisonResult {
  rigComponent: string
  rigPackage: string
  results: MountResult[]
}

function createContainer(): HTMLElement {
  const el = document.createElement('div')
  el.id = 'bench-container'
  document.body.appendChild(el)
  return el
}

function destroyContainer(el: HTMLElement) {
  el.remove()
}

function countNodes(el: HTMLElement): number {
  return el.querySelectorAll('*').length
}

async function measureMount(
  comp: Component,
  props: Record<string, unknown>,
  slotContent?: string,
): Promise<{ mountMs: number; unmountMs: number; nodeCount: number; container: HTMLElement }> {
  // Warmup
  for (let i = 0; i < WARMUP; i++) {
    const c = createContainer()
    const app = createApp({
      render: () => h(comp, props, slotContent ? { default: () => slotContent } : undefined),
    })
    app.mount(c)
    app.unmount()
    destroyContainer(c)
  }

  // Measure
  const mountTimes: number[] = []
  const unmountTimes: number[] = []
  let lastNodeCount = 0

  for (let i = 0; i < ITERATIONS; i++) {
    const c = createContainer()

    const app = createApp({
      render: () => h(comp, props, slotContent ? { default: () => slotContent } : undefined),
    })

    const t0 = performance.now()
    app.mount(c)
    const t1 = performance.now()
    mountTimes.push(t1 - t0)

    lastNodeCount = countNodes(c)

    const t2 = performance.now()
    app.unmount()
    const t3 = performance.now()
    unmountTimes.push(t3 - t2)

    destroyContainer(c)
  }

  // Median
  mountTimes.sort((a, b) => a - b)
  unmountTimes.sort((a, b) => a - b)
  const mid = Math.floor(ITERATIONS / 2)

  return {
    mountMs: Number(mountTimes[mid].toFixed(4)),
    unmountMs: Number(unmountTimes[mid].toFixed(4)),
    nodeCount: lastNodeCount,
    container: createContainer(),
  }
}

async function runA11y(comp: Component, props: Record<string, unknown>, slotContent?: string): Promise<{ violations: number; passes: number; score: number }> {
  const container = createContainer()
  try {
    const app = createApp({
      render: () => h(comp, props, slotContent ? { default: () => slotContent } : undefined),
    })
    app.mount(container)

    // Run axe-core on the mounted component
    const results = await axe.run(container, {
      rules: {
        // Disable rules that fire on test harness DOM
        region: { enabled: false },
        'page-has-heading-one': { enabled: false },
        'landmark-one-main': { enabled: false },
      },
    })

    const violations = results.violations.length
    const passes = results.passes.length
    const total = violations + passes
    const score = total > 0 ? Math.round((passes / total) * 100) : 100

    app.unmount()
    return { violations, passes, score }
  } catch {
    return { violations: 0, passes: 0, score: 0 }
  } finally {
    destroyContainer(container)
  }
}

async function measureEntry(
  lib: string,
  libName: string,
  componentName: string,
  loadFn: () => Promise<Component>,
  props: Record<string, unknown>,
  slotContent?: string,
): Promise<MountResult> {
  try {
    const comp = await loadFn()
    const { mountMs, unmountMs, nodeCount } = await measureMount(comp, props, slotContent)
    const a11y = await runA11y(comp, props, slotContent)

    return {
      lib,
      libName,
      componentName,
      mountTimeMs: mountMs,
      unmountTimeMs: unmountMs,
      domNodeCount: nodeCount,
      a11yViolations: a11y.violations,
      a11yPasses: a11y.passes,
      a11yScore: a11y.score,
    }
  } catch (e: unknown) {
    return {
      lib,
      libName,
      componentName,
      mountTimeMs: -1,
      unmountTimeMs: -1,
      domNodeCount: 0,
      a11yViolations: 0,
      a11yPasses: 0,
      a11yScore: 0,
      error: e instanceof Error ? e.message : String(e),
    }
  }
}

export async function runAllComparisons(): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = []

  for (const comparison of comparisons) {
    console.log(`  Benchmarking ${comparison.rig.name}...`)

    const compResult: ComparisonResult = {
      rigComponent: comparison.rig.name,
      rigPackage: comparison.rig.pkg,
      results: [],
    }

    // Measure Rig component
    const rigResult = await measureEntry(
      'rig',
      'Rig',
      comparison.rig.name,
      comparison.rig.load,
      comparison.rig.props,
      comparison.rig.slotContent,
    )
    compResult.results.push(rigResult)

    // Measure each competitor
    for (const competitor of comparison.competitors) {
      const result = await measureEntry(
        competitor.lib,
        competitor.libName,
        competitor.componentName,
        competitor.load,
        competitor.props,
        competitor.slotContent,
      )
      compResult.results.push(result)
    }

    results.push(compResult)
  }

  return results
}
