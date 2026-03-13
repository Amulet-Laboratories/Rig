#!/usr/bin/env node

/**
 * generate-health-data.mjs
 *
 * Collects ecosystem health metrics from Hex and Rig, writing a TypeScript
 * fixture that the Health and Performance showcases import at dev/build time.
 *
 * Run:  node demo/scripts/generate-health-data.mjs
 * Output: demo/src/showcases/fixtures/health-data.ts
 *
 * The history array is preserved from the existing file and the latest
 * snapshot is appended (or updated if the date matches today).
 */

import { execSync } from 'node:child_process'
import { readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const HEX_ROOT = resolve(ROOT, '../Hex')
const OUT = resolve(ROOT, 'demo/src/showcases/fixtures/health-data.ts')

// ── Helpers ──────────────────────────────────────────────────────────

function run(cmd, cwd = ROOT) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch {
    return ''
  }
}

function countFiles(dir, pattern) {
  let count = 0
  try {
    const entries = readdirSync(dir, { withFileTypes: true, recursive: true })
    for (const entry of entries) {
      if (entry.isFile() && pattern.test(entry.name)) count++
    }
  } catch { /* ignore */ }
  return count
}

function findFiles(dir, pattern) {
  const results = []
  try {
    const entries = readdirSync(dir, { withFileTypes: true, recursive: true })
    for (const entry of entries) {
      if (entry.isFile() && pattern.test(entry.name)) {
        results.push(join(entry.parentPath ?? entry.path, entry.name))
      }
    }
  } catch { /* ignore */ }
  return results
}

function pct(obj) {
  return typeof obj?.pct === 'number' ? Math.round(obj.pct * 100) / 100 : 0
}

function avg(arr) {
  if (!arr.length) return 0
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100
}

// ── Rig packages ─────────────────────────────────────────────────────

const PACKAGES = ['core', 'layout', 'nav', 'editor', 'lists', 'menus', 'extras', 'shell']

function collectPackages(perPkgCoverage) {
  return PACKAGES.map((pkg) => {
    const pkgDir = join(ROOT, 'packages', pkg, 'src')
    const components = countFiles(pkgDir, /\.vue$/)
    const testFiles = countFiles(pkgDir, /\.test\.ts$/)
    const benchFiles = countFiles(pkgDir, /\.bench\.ts$/)

    const cov = perPkgCoverage[pkg] ?? { statements: 0, branches: 0, functions: 0, lines: 0 }

    return {
      name: pkg,
      components,
      testFiles,
      benchFiles,
      coverage: cov,
    }
  })
}

// ── Coverage ─────────────────────────────────────────────────────────

function collectCoverage() {
  const summaryPath = join(ROOT, 'coverage', 'coverage-summary.json')

  // Generate coverage if stale (skip if coverage-summary.json exists and is <1h old)
  try {
    const stat = statSync(summaryPath)
    const ageMs = Date.now() - stat.mtimeMs
    if (ageMs > 3600_000) {
      run('npx vitest run --coverage 2>/dev/null', ROOT)
    }
  } catch {
    run('npx vitest run --coverage 2>/dev/null', ROOT)
  }

  try {
    const summary = JSON.parse(readFileSync(summaryPath, 'utf-8'))
    const total = summary.total

    const overall = {
      statements: pct(total.statements),
      branches: pct(total.branches),
      functions: pct(total.functions),
      lines: pct(total.lines),
    }

    // Per-package coverage
    const pkgBuckets = {}
    for (const [filepath, data] of Object.entries(summary)) {
      if (filepath === 'total') continue
      for (const pkg of PACKAGES) {
        if (filepath.includes(`packages/${pkg}/`)) {
          if (!pkgBuckets[pkg]) {
            pkgBuckets[pkg] = { statements: [], branches: [], functions: [], lines: [] }
          }
          pkgBuckets[pkg].statements.push(data.statements.pct)
          pkgBuckets[pkg].branches.push(data.branches.pct)
          pkgBuckets[pkg].functions.push(data.functions.pct)
          pkgBuckets[pkg].lines.push(data.lines.pct)
          break
        }
      }
    }

    const perPackage = {}
    for (const [pkg, metrics] of Object.entries(pkgBuckets)) {
      perPackage[pkg] = {
        statements: avg(metrics.statements),
        branches: avg(metrics.branches),
        functions: avg(metrics.functions),
        lines: avg(metrics.lines),
      }
    }

    return { overall, perPackage }
  } catch {
    return {
      overall: { statements: 0, branches: 0, functions: 0, lines: 0 },
      perPackage: {},
    }
  }
}

// ── Test counts ──────────────────────────────────────────────────────

function collectTestCounts() {
  // Try npx first (more reliable in execSync), fall back to pnpm
  let output = run('npx vitest run --reporter=verbose 2>&1', ROOT)
  if (!output) output = run('pnpm vitest run 2>&1', ROOT)

  const match = output.match(/Tests\s+(\d+)\s+passed/)
  const fileMatch = output.match(/Test Files\s+(\d+)\s+passed/)

  // Fallback: count test files directly if vitest didn't produce output
  if (!fileMatch) {
    const testFiles = countFiles(join(ROOT, 'packages'), /\.test\.ts$/)
    return { totalTests: 0, totalFiles: testFiles }
  }

  return {
    totalTests: match ? parseInt(match[1]) : 0,
    totalFiles: fileMatch ? parseInt(fileMatch[1]) : 0,
  }
}

// ── E2E counts ───────────────────────────────────────────────────────

function collectE2ECounts() {
  const e2eDir = join(ROOT, 'demo', 'e2e')
  const files = findFiles(e2eDir, /\.spec\.ts$/)

  return files.map((f) => {
    const content = readFileSync(f, 'utf-8')
    const name = f.split('/').pop().replace('.spec.ts', '')
    const testCount = (content.match(/\btest\(/g) || []).length
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      tests: testCount,
    }
  })
}

// ── Hex stats ────────────────────────────────────────────────────────

function collectHexStats() {
  const distDir = join(HEX_ROOT, 'dist')
  const themes = []

  try {
    for (const file of readdirSync(distDir).sort()) {
      if (!file.endsWith('.css')) continue
      const stat = statSync(join(distDir, file))
      themes.push({
        name: file.replace('.css', ''),
        sizeKB: Math.round((stat.size / 1024) * 10) / 10,
      })
    }
  } catch { /* no dist yet */ }

  const testOutput = run('node --test build.test.mjs 2>&1', HEX_ROOT)
  const testMatch = testOutput.match(/pass (\d+)/)
  const buildTests = testMatch ? parseInt(testMatch[1]) : 0

  return { themes, buildTests, sizeBudgetKB: 150 }
}

// ── Benchmark inventory ──────────────────────────────────────────────

function collectBenchmarks() {
  const benchFiles = findFiles(join(ROOT, 'packages'), /\.bench\.ts$/)
  return benchFiles.map((f) => {
    const name = f.split('/').pop().replace('.bench.ts', '')
    // Extract package name from path: packages/<pkg>/src/...
    const pkgMatch = f.match(/packages\/([^/]+)\//)
    const pkg = pkgMatch ? pkgMatch[1] : 'unknown'
    return { name, package: pkg }
  })
}

// ── Config thresholds ────────────────────────────────────────────────

function collectThresholds() {
  try {
    const vitestConfig = readFileSync(join(ROOT, 'vitest.config.ts'), 'utf-8')
    const thresholds = {}
    const matches = vitestConfig.matchAll(/(statements|branches|functions|lines):\s*(\d+)/g)
    for (const m of matches) {
      thresholds[m[1]] = parseInt(m[2])
    }
    return thresholds
  } catch {
    return { statements: 70, branches: 65, functions: 70, lines: 70 }
  }
}

// ── History ──────────────────────────────────────────────────────────

function loadExistingHistory() {
  try {
    const content = readFileSync(OUT, 'utf-8')
    // Extract the history array from the TS file
    const historyMatch = content.match(/history:\s*\[([\s\S]*?)\]\s*[,}]/)
    if (!historyMatch) return []

    // Parse each object in the array using a simple regex approach
    const entries = []
    const objRegex = /\{([^{}]+)\}/g
    let match
    while ((match = objRegex.exec(historyMatch[1])) !== null) {
      const obj = {}
      const kvRegex =
        /(\w+):\s*(?:\{([^}]+)\}|'([^']*)'|"([^"]*)"|([\d.]+))/g
      let kv
      while ((kv = kvRegex.exec(match[1])) !== null) {
        const key = kv[1]
        if (kv[2]) {
          // Nested object (coverage)
          const nested = {}
          const nestedKv = /(\w+):\s*([\d.]+)/g
          let nkv
          while ((nkv = nestedKv.exec(kv[2])) !== null) {
            nested[nkv[1]] = parseFloat(nkv[2])
          }
          obj[key] = nested
        } else if (kv[3] !== undefined) {
          obj[key] = kv[3]
        } else if (kv[4] !== undefined) {
          obj[key] = kv[4]
        } else {
          obj[key] = parseFloat(kv[5])
        }
      }
      if (obj.date) entries.push(obj)
    }
    return entries
  } catch {
    return []
  }
}

// ── Output TS file ───────────────────────────────────────────────────

function toTS(data) {
  const j = (v) => JSON.stringify(v, null, 2)

  const pkgs = data.rig.packages
    .map(
      (p) => `      {
        name: '${p.name}',
        components: ${p.components},
        testFiles: ${p.testFiles},
        benchFiles: ${p.benchFiles},
        coverage: { statements: ${p.coverage.statements}, branches: ${p.coverage.branches}, functions: ${p.coverage.functions}, lines: ${p.coverage.lines} },
      }`,
    )
    .join(',\n')

  const e2e = data.rig.e2e.map((e) => `      { name: '${e.name}', tests: ${e.tests} }`).join(',\n')

  const benchmarks = data.rig.benchmarks
    .map((b) => `      { name: '${b.name}', package: '${b.package}' }`)
    .join(',\n')

  const themes = data.hex.themes
    .map((t) => `      { name: '${t.name}', sizeKB: ${t.sizeKB} }`)
    .join(',\n')

  const history = data.history
    .map(
      (h) => `    {
      date: '${h.date}',
      totalTests: ${h.totalTests},
      totalFiles: ${h.totalFiles},
      totalComponents: ${h.totalComponents},
      e2eTests: ${h.e2eTests},
      coverage: { statements: ${h.coverage.statements}, branches: ${h.coverage.branches}, functions: ${h.coverage.functions}, lines: ${h.coverage.lines} },
      hexTotalKB: ${h.hexTotalKB},
    }`,
    )
    .join(',\n')

  const ct = data.rig.coverageThresholds

  return `/**
 * Ecosystem health data — static fixture for the Health & Performance showcases.
 *
 * Regenerate with: node demo/scripts/generate-health-data.mjs
 * Or update these values manually after running vitest --coverage.
 */

export interface PackageStats {
  name: string
  components: number
  testFiles: number
  benchFiles: number
  coverage: {
    statements: number
    branches: number
    functions: number
    lines: number
  }
}

export interface HexTheme {
  name: string
  sizeKB: number
}

export interface BenchmarkEntry {
  name: string
  package: string
}

export interface E2ECategory {
  name: string
  tests: number
}

export interface CoverageThresholds {
  statements: number
  branches: number
  functions: number
  lines: number
}

/** A point-in-time snapshot for historical tracking */
export interface HealthSnapshot {
  date: string
  totalTests: number
  totalFiles: number
  totalComponents: number
  e2eTests: number
  coverage: CoverageThresholds
  hexTotalKB: number
}

export interface HealthData {
  generated: string
  rig: {
    packages: PackageStats[]
    totalTests: number
    totalFiles: number
    totalComponents: number
    e2e: E2ECategory[]
    benchmarks: BenchmarkEntry[]
    coverageThresholds: CoverageThresholds
    overallCoverage: CoverageThresholds
  }
  hex: {
    themes: HexTheme[]
    buildTests: number
    sizeBudgetKB: number
  }
  /** Chronological snapshots for trend tracking */
  history: HealthSnapshot[]
}

export const healthData: HealthData = {
  generated: '${data.generated}',

  rig: {
    packages: [
${pkgs}
    ],
    totalTests: ${data.rig.totalTests},
    totalFiles: ${data.rig.totalFiles},
    totalComponents: ${data.rig.totalComponents},
    e2e: [
${e2e}
    ],
    benchmarks: [
${benchmarks}
    ],
    coverageThresholds: {
      statements: ${ct.statements},
      branches: ${ct.branches},
      functions: ${ct.functions},
      lines: ${ct.lines},
    },
    overallCoverage: {
      statements: ${data.rig.overallCoverage.statements},
      branches: ${data.rig.overallCoverage.branches},
      functions: ${data.rig.overallCoverage.functions},
      lines: ${data.rig.overallCoverage.lines},
    },
  },

  hex: {
    themes: [
${themes}
    ],
    buildTests: ${data.hex.buildTests},
    sizeBudgetKB: ${data.hex.sizeBudgetKB},
  },

  history: [
${history}
  ],
}
`
}

// ── Main ─────────────────────────────────────────────────────────────

console.log('Collecting ecosystem health data...')

const coverage = collectCoverage()
const packages = collectPackages(coverage.perPackage)
const { totalTests, totalFiles } = collectTestCounts()
const totalComponents = packages.reduce((s, p) => s + p.components, 0)
const e2e = collectE2ECounts()
const totalE2E = e2e.reduce((s, c) => s + c.tests, 0)
const hex = collectHexStats()
const hexTotalKB = Math.round(hex.themes.reduce((s, t) => s + t.sizeKB, 0))

// Build history: load existing, append/update today's snapshot
const existingHistory = loadExistingHistory()
const today = new Date().toISOString().slice(0, 10)
const todaySnapshot = {
  date: today,
  totalTests,
  totalFiles,
  totalComponents,
  e2eTests: totalE2E,
  coverage: coverage.overall,
  hexTotalKB,
}

// Remove any existing entry for today, then append
const history = existingHistory.filter((h) => h.date !== today)
history.push(todaySnapshot)

const data = {
  generated: new Date().toISOString(),
  rig: {
    packages,
    totalTests,
    totalFiles,
    totalComponents,
    e2e,
    benchmarks: collectBenchmarks(),
    coverageThresholds: collectThresholds(),
    overallCoverage: coverage.overall,
  },
  hex,
  history,
}

writeFileSync(OUT, toTS(data))
console.log(`Written to ${OUT}`)
console.log(`  Rig: ${totalTests} tests across ${totalFiles} files, ${totalComponents} components`)
console.log(`  E2E: ${totalE2E} tests across ${e2e.length} suites`)
console.log(`  Hex: ${hex.themes.length} theme files, ${hex.buildTests} build tests`)
console.log(`  Coverage: ${coverage.overall.statements}% statements`)
console.log(`  History: ${history.length} snapshots`)
