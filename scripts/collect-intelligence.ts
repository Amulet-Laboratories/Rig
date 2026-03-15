#!/usr/bin/env tsx
/**
 * collect-intelligence.ts — Main 5-phase intelligence collection script.
 *
 * Usage:
 *   pnpm intelligence                    # run all phases
 *   pnpm intelligence:ecosystem          # phase 1 only
 *   pnpm intelligence:size               # phase 2 only
 *   pnpm intelligence:perf               # phase 3 only
 *   pnpm intelligence:fast               # skip perf + size
 *
 * CLI flags:
 *   --phase=ecosystem|size|perf|score|merge   Run a single phase
 *   --skip-perf       Skip Playwright performance/a11y phase
 *   --skip-size       Skip bundle size measurement phase
 *
 * Environment:
 *   GITHUB_TOKEN      GitHub PAT for higher API rate limits
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { collectEcosystem } from './lib/npm-api'
import { measureBundleSize } from './lib/bundle-analyzer'
import { computeAllScores, applyScores } from './lib/score-computer'
import type { IntelligenceManifest, LibraryRecord } from './lib/health-types'

// ─── Library Registry ────────────────────────────────────────────────────────

interface LibraryMeta {
  id: string
  name: string
  npm: string
  github: string
  framework: 'vue' | 'react' | 'agnostic'
  color: string
  skipBundle: boolean
}

const LIBRARIES: LibraryMeta[] = [
  {
    id: 'vuetify',
    name: 'Vuetify',
    npm: 'vuetify',
    github: 'vuetifyjs/vuetify',
    framework: 'vue',
    color: '#1867C0',
    skipBundle: false,
  },
  {
    id: 'primevue',
    name: 'PrimeVue',
    npm: 'primevue',
    github: 'primefaces/primevue',
    framework: 'vue',
    color: '#41B883',
    skipBundle: false,
  },
  {
    id: 'element-plus',
    name: 'Element Plus',
    npm: 'element-plus',
    github: 'element-plus/element-plus',
    framework: 'vue',
    color: '#409EFF',
    skipBundle: false,
  },
  {
    id: 'reka-ui',
    name: 'Reka UI',
    npm: 'reka-ui',
    github: 'unovue/reka-ui',
    framework: 'vue',
    color: '#6E56CF',
    skipBundle: false,
  },
  {
    id: 'naive-ui',
    name: 'Naive UI',
    npm: 'naive-ui',
    github: 'tusen-ai/naive-ui',
    framework: 'vue',
    color: '#36AD6A',
    skipBundle: false,
  },
  {
    id: 'mui',
    name: 'Material UI',
    npm: '@mui/material',
    github: 'mui/material-ui',
    framework: 'react',
    color: '#007FFF',
    skipBundle: false,
  },
  {
    id: 'ant-design',
    name: 'Ant Design',
    npm: 'antd',
    github: 'ant-design/ant-design',
    framework: 'react',
    color: '#1677FF',
    skipBundle: false,
  },
  {
    id: 'shadcn-ui',
    name: 'shadcn/ui',
    npm: '',
    github: 'shadcn-ui/ui',
    framework: 'react',
    color: '#000000',
    skipBundle: true,
  },
  {
    id: 'mantine',
    name: 'Mantine',
    npm: '@mantine/core',
    github: 'mantinedev/mantine',
    framework: 'react',
    color: '#339AF0',
    skipBundle: false,
  },
  {
    id: 'react-aria',
    name: 'React Aria',
    npm: 'react-aria',
    github: 'adobe/react-spectrum',
    framework: 'react',
    color: '#E1251B',
    skipBundle: false,
  },
]

// ─── Paths ───────────────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname!, '..')
const HEALTH_DIR = resolve(ROOT, '.health')
const MANIFEST_PATH = resolve(HEALTH_DIR, 'intelligence.json')
const MANUAL_PATH = resolve(HEALTH_DIR, 'intelligence-manual.json')
const HEALTH_MANIFEST_PATH = resolve(HEALTH_DIR, 'manifest.json')
const COMPARISON_PATH = resolve(HEALTH_DIR, 'comparison.json')

// ─── CLI Parsing ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const phase = args.find((a) => a.startsWith('--phase='))?.split('=')[1] ?? null
const skipPerf = args.includes('--skip-perf')
const skipSize = args.includes('--skip-size')

function shouldRun(p: string): boolean {
  if (phase) return phase === p
  if (p === 'perf' && skipPerf) return false
  if (p === 'size' && skipSize) return false
  return true
}

// ─── Manifest I/O ────────────────────────────────────────────────────────────

function loadManifest(): IntelligenceManifest {
  if (!existsSync(MANIFEST_PATH)) {
    return {
      generated: new Date().toISOString(),
      rig: {
        componentCount: 0,
        packageCount: 0,
        testCoverage: 0,
        bundleSize: { fullGzip: 0, fullMinified: 0, cssGzip: 0, jsGzip: 0 },
        a11yScore: 0,
      },
      libraries: [] as LibraryRecord[],
    } as unknown as IntelligenceManifest
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8')) as IntelligenceManifest
}

function saveManifest(manifest: IntelligenceManifest): void {
  if (!existsSync(HEALTH_DIR)) mkdirSync(HEALTH_DIR, { recursive: true })
  manifest.generated = new Date().toISOString()
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`\n✓ Manifest saved to ${MANIFEST_PATH}`)
}

// ─── Phase 1: Ecosystem ─────────────────────────────────────────────────────

async function phaseEcosystem(manifest: IntelligenceManifest): Promise<void> {
  console.log('\n── Phase 1: Ecosystem Data ──')

  const ecoData = await collectEcosystem(
    LIBRARIES.map((l) => ({ id: l.id, npm: l.npm, github: l.github })),
  )

  for (const lib of LIBRARIES) {
    if (!manifest.libraries[lib.id]) {
      manifest.libraries[lib.id] = createEmptyRecord(lib)
    }
    const record = manifest.libraries[lib.id]
    const eco = ecoData[lib.id]
    if (eco) {
      record.ecosystem = {
        githubStars: eco.githubStars,
        weeklyDownloads: eco.weeklyDownloads,
        monthlyDownloads: eco.monthlyDownloads,
        releaseCount: eco.releaseCount,
        daysSinceLastRelease: eco.daysSinceLastRelease,
        openIssues: eco.openIssues,
        contributorCount: eco.contributorCount,
        ageInDays: eco.ageInDays,
        license: eco.license,
      }
    }
  }
  console.log('  ✓ ecosystem data collected')
}

// ─── Phase 2: Bundle Size ───────────────────────────────────────────────────

async function phaseSize(manifest: IntelligenceManifest): Promise<void> {
  console.log('\n── Phase 2: Bundle Size ──')

  for (const lib of LIBRARIES) {
    if (lib.skipBundle) {
      console.log(`  [skip] ${lib.id} — no npm package`)
      if (manifest.libraries[lib.id]) {
        manifest.libraries[lib.id].size.collectionMethod = 'manual'
      }
      continue
    }

    const result = await measureBundleSize(lib.npm)
    if (result && manifest.libraries[lib.id]) {
      manifest.libraries[lib.id].size = {
        bundleSizeRaw: result.rawBytes,
        bundleSizeGzip: result.gzipBytes,
        bundleSizeTree: Math.round(result.rawBytes * 0.4), // estimate
        cssSize: 0,
        collectionMethod: 'automated',
      }
    }
  }
  console.log('  ✓ bundle sizes measured')
}

// ─── Phase 3: Performance ───────────────────────────────────────────────────

async function phasePerf(manifest: IntelligenceManifest): Promise<void> {
  console.log('\n── Phase 3: Performance & Accessibility ──')

  const BASE_URL = 'http://localhost:4400'

  // Check if demo server is reachable
  let serverReady = false
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(3000) })
    serverReady = res.ok
  } catch {
    // Not running
  }

  if (!serverReady) {
    console.log('  [skip] demo server not running on localhost:4400')
    console.log('         Start it with: cd demo && pnpm dev')
    return
  }

  // Key routes to measure
  const routes = [
    '/components',
  ]

  try {
    const { measureRoutes } = await import('./lib/perf-runner.js')
    const reports = await measureRoutes(BASE_URL, routes)

    if (reports.length === 0) {
      console.log('  [warn] no measurements collected — is Playwright installed?')
      return
    }

    // Aggregate perf results across routes
    const avgFirstPaint = Math.round(
      reports.reduce((sum, r) => sum + r.perf.firstPaintMs, 0) / reports.length,
    )
    const avgInteractive = Math.round(
      reports.reduce((sum, r) => sum + r.perf.interactiveMs, 0) / reports.length,
    )
    const avgA11yViolations = Math.round(
      reports.reduce((sum, r) => sum + r.a11y.violationCount, 0) / reports.length,
    )
    const avgA11yScore = Math.round(
      reports.reduce((sum, r) => sum + r.a11y.score, 0) / reports.length,
    )

    // Write results to .health/perf.json for other scripts to consume
    const perfResults = {
      generated: new Date().toISOString(),
      baseUrl: BASE_URL,
      routes: reports,
      averages: {
        firstPaintMs: avgFirstPaint,
        interactiveMs: avgInteractive,
        a11yViolations: avgA11yViolations,
        a11yScore: avgA11yScore,
      },
    }

    writeFileSync(
      resolve(HEALTH_DIR, 'perf.json'),
      JSON.stringify(perfResults, null, 2),
    )

    console.log(`  routes measured: ${reports.length}`)
    console.log(`  avg first paint: ${avgFirstPaint}ms`)
    console.log(`  avg TTI: ${avgInteractive}ms`)
    console.log(`  avg a11y score: ${avgA11yScore}`)
    console.log('  ✓ perf results saved to .health/perf.json')
  } catch (e) {
    console.warn('  [warn] perf measurement failed:', (e as Error).message)
    console.log('         Ensure Playwright is installed: npx playwright install chromium')
  }
}

// ─── Phase 4: Score Computation ─────────────────────────────────────────────

function phaseScore(manifest: IntelligenceManifest): void {
  console.log('\n── Phase 4: Score Computation ──')
  const scores = computeAllScores(manifest.libraries)
  applyScores(manifest.libraries, scores)
  console.log('  ✓ scores computed for', Object.keys(scores).length, 'libraries')
}

// ─── Phase 5: Merge Manual Data ─────────────────────────────────────────────

function phaseMerge(manifest: IntelligenceManifest): void {
  console.log('\n── Phase 5: Merge Manual Data ──')

  if (!existsSync(MANUAL_PATH)) {
    console.log('  [skip] no manual data file found')
    return
  }

  const manual = JSON.parse(readFileSync(MANUAL_PATH, 'utf-8')) as {
    libraries: Record<
      string,
      {
        theming?: Record<string, unknown>
        dx?: Record<string, unknown>
        accessibility?: Record<string, unknown>
        typescript?: Record<string, unknown>
        notes?: string
      }
    >
  }

  for (const [id, data] of Object.entries(manual.libraries)) {
    if (!manifest.libraries[id]) continue
    const record = manifest.libraries[id]

    if (data.theming) {
      Object.assign(record.theming, data.theming)
    }
    if (data.dx) {
      Object.assign(record.dx, data.dx)
    }
    if (data.accessibility) {
      Object.assign(record.accessibility, data.accessibility)
    }
    if (data.typescript) {
      Object.assign(record.typescript, data.typescript)
    }
  }

  console.log('  ✓ manual data merged for', Object.keys(manual.libraries).length, 'libraries')
}

// ─── Phase 0: Rig Self-Assessment ────────────────────────────────────────────

interface HealthManifest {
  summary: {
    totalComponents: number
    totalComposables: number
    totalTests: number
    overallCoverage: { statements: number }
    packages: { name: string; count: number }[]
  }
}

interface ComparisonEntry {
  rigComponent: string
  results: {
    lib: string
    mountMedianMs?: number
    a11yScore?: number
    reliable?: boolean
  }[]
}

interface ComparisonManifest {
  comparisons: ComparisonEntry[]
}

function phaseRig(manifest: IntelligenceManifest): void {
  console.log('\n── Phase 0: Rig Self-Assessment ──')

  // Read health manifest for component/test/coverage stats
  if (!existsSync(HEALTH_MANIFEST_PATH)) {
    console.log('  [skip] no health manifest found — run `pnpm health` first')
    return
  }

  const health = JSON.parse(readFileSync(HEALTH_MANIFEST_PATH, 'utf-8')) as HealthManifest

  const summary = health.summary
  const componentCount = summary.totalComponents + summary.totalComposables
  const packageCount = summary.packages.length
  const testCoverage = summary.overallCoverage.statements

  // Read comparison.json for a11y scores
  let a11yScore = 0
  if (existsSync(COMPARISON_PATH)) {
    const comparison = JSON.parse(readFileSync(COMPARISON_PATH, 'utf-8')) as ComparisonManifest

    const scores: number[] = []
    for (const comp of comparison.comparisons) {
      for (const r of comp.results) {
        if (r.lib === 'rig' && r.reliable && r.a11yScore != null) {
          scores.push(r.a11yScore)
        }
      }
    }
    if (scores.length > 0) {
      a11yScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }
  }

  // Measure bundle size from dist/
  const distJs = resolve(ROOT, 'dist/index.mjs')
  let fullMinified = 0
  let fullGzip = 0
  if (existsSync(distJs)) {
    const content = readFileSync(distJs)
    fullMinified = content.length
    fullGzip = gzipSync(content).byteLength
  }

  manifest.rig = {
    componentCount,
    packageCount,
    testCoverage,
    bundleSize: {
      fullGzip,
      fullMinified,
      cssGzip: 0, // CSS is in Hex, not in Rig's bundle
      jsGzip: fullGzip,
    },
    a11yScore,
  }

  console.log(`  components: ${componentCount}`)
  console.log(`  packages: ${packageCount}`)
  console.log(`  coverage: ${testCoverage.toFixed(1)}%`)
  console.log(`  a11y: ${a11yScore}`)
  console.log(`  bundle: ${(fullGzip / 1024).toFixed(1)}KB gzip`)
  console.log('  ✓ rig snapshot updated')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createEmptyRecord(lib: LibraryMeta): LibraryRecord {
  return {
    name: lib.name,
    npm: lib.npm,
    github: lib.github,
    framework: lib.framework,
    color: lib.color,
    ecosystem: {
      githubStars: 0,
      weeklyDownloads: 0,
      monthlyDownloads: 0,
      releaseCount: 0,
      daysSinceLastRelease: 999,
      openIssues: 0,
      contributorCount: 0,
      ageInDays: 0,
      license: 'unknown',
    },
    size: {
      bundleSizeRaw: 0,
      bundleSizeGzip: 0,
      bundleSizeTree: 0,
      cssSize: 0,
      collectionMethod: 'automated',
    },
    coverage: {
      lineCoverage: 0,
      branchCoverage: 0,
      functionCoverage: 0,
      testCount: 0,
      e2eCount: 0,
    },
    performance: {
      firstPaintMs: 0,
      interactiveMs: 0,
      lighthouseScore: 0,
      layoutShiftScore: 0,
    },
    accessibility: {
      wcagLevel: 'AA',
      axeViolations: 0,
      keyboardNavScore: 0,
      ariaPatternsCovered: 0,
    },
    typescript: {
      strictMode: false,
      hasIntelliSense: false,
      genericsUsed: false,
    },
    theming: {
      darkModeNative: false,
      rtlSupport: false,
      runtimeSwitching: false,
      tokenDepthScore: 0,
      customizabilityScore: 0,
    },
    dx: {
      documentationScore: 0,
      playgroundAvailable: false,
      figmaKitAvailable: false,
      cliTooling: false,
      aiToolingScore: 0,
      migrationPathScore: 0,
      errorMessageScore: 0,
    },
    rigComparison: {
      featureParity: [],
      missingInRig: [],
      rigAdvantages: [],
    },
    scores: {
      composite: 0,
      size: 0,
      performance: 0,
      accessibility: 0,
      coverage: 0,
      typescript: 0,
      theming: 0,
      dx: 0,
      ecosystem: 0,
    },
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════╗')
  console.log('║  Hexrig Intelligence Collection Pipeline ║')
  console.log('╚══════════════════════════════════════════╝')

  const manifest = loadManifest()

  if (shouldRun('rig')) phaseRig(manifest)
  if (shouldRun('ecosystem')) await phaseEcosystem(manifest)
  if (shouldRun('size')) await phaseSize(manifest)
  if (shouldRun('perf')) await phasePerf(manifest)
  if (shouldRun('merge')) phaseMerge(manifest)
  if (shouldRun('score')) phaseScore(manifest)

  saveManifest(manifest)

  // Summary
  const libCount = Object.keys(manifest.libraries).length
  console.log(`\n── Summary ──`)
  console.log(`  Libraries: ${libCount}`)
  console.log(`  Generated: ${manifest.generated}`)

  if (manifest.libraries) {
    const top3 = Object.entries(manifest.libraries)
      .sort(([, a], [, b]) => (b.scores?.composite ?? 0) - (a.scores?.composite ?? 0))
      .slice(0, 3)
    if (top3.length > 0 && top3[0][1].scores?.composite > 0) {
      console.log(`  Top 3:`)
      for (const [id, lib] of top3) {
        console.log(`    ${id}: ${lib.scores.composite.toFixed(1)}`)
      }
    }
  }
}

main().catch((e) => {
  console.error('Collection failed:', e)
  process.exit(1)
})
