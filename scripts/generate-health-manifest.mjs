#!/usr/bin/env node

// generate-health-manifest.mjs
//
// Produces .health/manifest.json -- a per-component quality manifest
// consumed by the Lab app, Histoire health panels, and CI reports.
//
// Data sources:
//   1. .health/tests.json          -- vitest JSON reporter output
//   2. coverage/coverage-summary.json -- v8 coverage per file
//   3. packages/{pkg}/src/         -- source file scanning (a11y, structure)
//   4. ../Hex/src/shared/          -- CSS selector coverage
//   5. stories/                    -- story file existence
//   6. .health/bench.json          -- benchmark results (optional)
//
// Run:
//   pnpm health              -- collect + generate
//   node scripts/generate-health-manifest.mjs -- generate only (from existing data)
//
// Output: .health/manifest.json

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { resolve, join, relative, basename } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const HEX_ROOT = resolve(ROOT, '../Hex')
const HEALTH_DIR = resolve(ROOT, '.health')
const TESTS_JSON = resolve(HEALTH_DIR, 'tests.json')
const BENCH_JSON = resolve(HEALTH_DIR, 'bench.json')
const COVERAGE_JSON = resolve(ROOT, 'coverage', 'coverage-summary.json')
const MANIFEST_OUT = resolve(HEALTH_DIR, 'manifest.json')

const PACKAGES = ['core', 'layout', 'nav', 'editor', 'lists', 'menus', 'extras', 'shell']

// ── Helpers ──────────────────────────────────────────────────────────

function readJSON(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return null
  }
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
  } catch { /* dir doesn't exist */ }
  return results
}

function pct(obj) {
  return typeof obj?.pct === 'number' ? Math.round(obj.pct * 100) / 100 : 0
}

// ── 1. Discover components ───────────────────────────────────────────

function discoverComponents() {
  const components = []

  for (const pkg of PACKAGES) {
    const srcDir = join(ROOT, 'packages', pkg, 'src')
    if (!existsSync(srcDir)) continue

    // Vue components (files directly in src or in src/primitives)
    const vueFiles = findFiles(srcDir, /\.vue$/)
    for (const vf of vueFiles) {
      const name = basename(vf, '.vue')
      // Skip story files that might be in the dir
      if (name.endsWith('.story')) continue

      components.push({
        name,
        package: pkg,
        type: 'component',
        source: relative(ROOT, vf),
        testFile: findSibling(vf, '.test.ts'),
        benchFile: findSibling(vf, '.bench.ts'),
      })
    }

    // Composables (TypeScript files in composables/)
    const composablesDir = join(srcDir, 'composables')
    if (existsSync(composablesDir)) {
      const tsFiles = findFiles(composablesDir, /^(?!.*\.test\.)(?!.*\.bench\.).*\.ts$/)
      for (const tf of tsFiles) {
        const name = basename(tf, '.ts')
        if (name === 'index') continue

        components.push({
          name,
          package: pkg,
          type: 'composable',
          source: relative(ROOT, tf),
          testFile: findSibling(tf, '.test.ts'),
          benchFile: findSibling(tf, '.bench.ts'),
        })
      }
    }
  }

  return components
}

function findSibling(filePath, suffix) {
  const base = filePath.replace(/\.(vue|ts)$/, '')
  const sibling = base + suffix
  return existsSync(sibling) ? relative(ROOT, sibling) : null
}

// ── 2. Map test results ──────────────────────────────────────────────

function mapTestResults(testsJson) {
  if (!testsJson?.testResults) return {}

  const map = {}
  for (const suite of testsJson.testResults) {
    const relPath = relative(ROOT, suite.name)
    map[relPath] = {
      status: suite.status,
      duration: Math.round(
        suite.assertionResults.reduce((s, t) => s + (t.duration || 0), 0),
      ),
      tests: suite.assertionResults.map((t) => ({
        name: t.fullName,
        status: t.status,
        duration: Math.round((t.duration || 0) * 100) / 100,
      })),
    }
  }
  return map
}

// ── 3. Map coverage ──────────────────────────────────────────────────

function mapCoverage(coverageJson) {
  if (!coverageJson) return {}

  const map = {}
  for (const [absPath, data] of Object.entries(coverageJson)) {
    if (absPath === 'total') continue
    const relPath = relative(ROOT, absPath)
    map[relPath] = {
      statements: pct(data.statements),
      branches: pct(data.branches),
      functions: pct(data.functions),
      lines: pct(data.lines),
    }
  }
  return map
}

// ── 4. Map benchmarks ────────────────────────────────────────────────

function mapBenchmarks(benchJson) {
  if (!benchJson) return {}

  const map = {}

  // vitest bench --outputJson format: { files: [{ filepath, groups: [{ fullName, benchmarks }] }] }
  if (benchJson.files) {
    for (const file of benchJson.files) {
      const relPath = relative(ROOT, file.filepath)
      const results = []

      for (const group of file.groups ?? []) {
        for (const b of group.benchmarks ?? []) {
          results.push({
            name: group.fullName ? `${group.fullName} > ${b.name}` : b.name,
            hz: Math.round(b.hz ?? 0),
            mean: Math.round((b.mean ?? 0) * 10000) / 10000,
            p99: Math.round((b.p99 ?? 0) * 10000) / 10000,
          })
        }
      }

      if (results.length > 0) {
        map[relPath] = results
      }
    }
    return map
  }

  // Legacy format: { testResults: [{ name, assertionResults: [{ meta: { benchmark } }] }] }
  if (benchJson.testResults) {
    for (const suite of benchJson.testResults) {
      const relPath = relative(ROOT, suite.name)
      const results = []

      if (suite.assertionResults) {
        for (const r of suite.assertionResults) {
          if (r.meta?.benchmark) {
            results.push({
              name: r.fullName,
              hz: Math.round(r.meta.benchmark.hz),
              mean: Math.round(r.meta.benchmark.mean * 10000) / 10000,
              p99: Math.round(r.meta.benchmark.p99 * 10000) / 10000,
            })
          }
        }
      }

      if (results.length > 0) {
        map[relPath] = results
      }
    }
  }

  return map
}

// ── 5. Scan for accessibility patterns ───────────────────────────────

function scanA11y(sourcePath) {
  const absPath = resolve(ROOT, sourcePath)
  try {
    const content = readFileSync(absPath, 'utf-8')

    const hasAria = /aria-|:aria-/.test(content)
    const hasRole = /\brole=|:role=/.test(content)
    const hasKeyboardNav = /@keydown|@keyup|useKeyboard|handleKeydown|onKeydown/.test(content)
    const hasFocusManagement =
      /useFocusTrap|\.focus\(\)|tabindex|:tabindex|roving/i.test(content)
    const hasReducedMotion = /prefers-reduced-motion/.test(content)

    return {
      hasAriaAttributes: hasAria || hasRole,
      hasKeyboardNav,
      hasFocusManagement,
      hasReducedMotion,
      patterns: [
        ...(hasAria ? ['aria-attributes'] : []),
        ...(hasRole ? ['semantic-roles'] : []),
        ...(hasKeyboardNav ? ['keyboard-nav'] : []),
        ...(hasFocusManagement ? ['focus-management'] : []),
        ...(hasReducedMotion ? ['reduced-motion'] : []),
      ],
    }
  } catch {
    return {
      hasAriaAttributes: false,
      hasKeyboardNav: false,
      hasFocusManagement: false,
      hasReducedMotion: false,
      patterns: [],
    }
  }
}

// ── 6. Scan Hex CSS for component selectors ──────────────────────────

function scanHexSelectors() {
  const selectorMap = {}
  const cssDir = resolve(HEX_ROOT, 'src/shared/components')

  if (!existsSync(cssDir)) return selectorMap

  const allSelectors = new Set()
  const cssFiles = findFiles(cssDir, /\.css$/)
  for (const cssFile of cssFiles) {
    const content = readFileSync(cssFile, 'utf-8')
    // Match [data-rig-component-name] selectors
    const matches = content.matchAll(/\[data-rig-([a-z-]+)\]/g)
    for (const m of matches) {
      allSelectors.add(m[1])
      const selectorAttribute = m[0]
      const rigName = m[1]
      if (!selectorMap[rigName]) {
        selectorMap[rigName] = new Set()
      }
      // Get the full selector context
      selectorMap[rigName].add(selectorAttribute)
    }
  }

  // Build prefix groups: if 'panel-header' exists, also populate 'panel'
  // This ensures components with only sub-element selectors get matched
  for (const name of allSelectors) {
    const parts = name.split('-')
    // Generate all meaningful prefixes (at least 1 segment)
    for (let i = 1; i < parts.length; i++) {
      const prefix = parts.slice(0, i).join('-')
      if (!selectorMap[prefix]) {
        selectorMap[prefix] = new Set()
      }
      selectorMap[prefix].add(`[data-rig-${name}]`)
    }
  }

  // Convert sets to arrays
  for (const key of Object.keys(selectorMap)) {
    selectorMap[key] = [...selectorMap[key]]
  }

  return selectorMap
}

// Known aliases: component PascalCase → actual data-rig selector prefix
const RIG_SELECTOR_ALIASES = {
  'side-bar': 'sidebar',
  'tree-view': 'tree',
  'notification-center': 'notification',
  'ide-shell': 'shell',
  'shell-grid': 'shell',
  'scroll-area': 'scroll',
}

/** Map a component name to its data-rig-* selector name */
function componentToRigSelector(name) {
  // PascalCase → kebab-case, e.g. 'EditorWorkbench' → 'editor-workbench'
  const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  return RIG_SELECTOR_ALIASES[kebab] ?? kebab
}

// ── 7. Find stories ──────────────────────────────────────────────────

function findStories() {
  const storiesDir = join(ROOT, 'stories')
  if (!existsSync(storiesDir)) return {}

  const storyFiles = findFiles(storiesDir, /\.story\.vue$/)
  const map = {}

  for (const sf of storyFiles) {
    const name = basename(sf, '.story.vue')
    const content = readFileSync(sf, 'utf-8')
    const variantCount = (content.match(/<Variant/g) || []).length

    map[name] = {
      path: relative(ROOT, sf),
      variants: variantCount,
    }
  }

  return map
}

// -- 8. Compute health score --

// ── 8x. Scan interaction test quality ─────────────────────────────────

/** Scan a test file's content for interaction-quality signals */
function scanInteractionTests(testFilePath) {
  if (!testFilePath) return { hasKeyboardTests: false, hasFocusTests: false, hasEmitTests: false, hasSlotTests: false, hasReactivityTests: false, interactionPatterns: [] }
  const absPath = resolve(ROOT, testFilePath)
  try {
    const content = readFileSync(absPath, 'utf-8')
    const hasKeyboardTests = /trigger\(['"]keydown|trigger\(['"]keyup|KeyboardEvent|@keydown|key:\s*['"]Arrow|key:\s*['"]Enter|key:\s*['"]Escape|key:\s*['"]Tab|key:\s*['"]Home|key:\s*['"]End/.test(content)
    const hasFocusTests = /\.focus\(|document\.activeElement|focusTrap|focusIn|focusOut|trigger\(['"]focus/.test(content)
    const hasEmitTests = /emitted\(|emit\(/.test(content)
    const hasSlotTests = /slots:\s*\{|#default|v-slot|slot:/.test(content)
    const hasReactivityTests = /setProps|setValue|nextTick|flushPromises|wrapper\.vm\.\$/.test(content)

    const patterns = []
    if (hasKeyboardTests) patterns.push('keyboard-interaction')
    if (hasFocusTests) patterns.push('focus-management')
    if (hasEmitTests) patterns.push('event-emissions')
    if (hasSlotTests) patterns.push('slot-rendering')
    if (hasReactivityTests) patterns.push('reactivity')

    return { hasKeyboardTests, hasFocusTests, hasEmitTests, hasSlotTests, hasReactivityTests, interactionPatterns: patterns }
  } catch {
    return { hasKeyboardTests: false, hasFocusTests: false, hasEmitTests: false, hasSlotTests: false, hasReactivityTests: false, interactionPatterns: [] }
  }
}

// ── 8y. Load axe-core runtime results from comparison benchmarks ─────

function loadAxeResults() {
  const COMPARISON_JSON = resolve(HEALTH_DIR, 'comparison.json')
  const compData = readJSON(COMPARISON_JSON)
  if (!compData?.comparisons) return {}

  const map = {} // componentName → { violations, passes, score }
  for (const comp of compData.comparisons) {
    const rigResult = comp.results?.find((r) => r.lib === 'rig')
    if (rigResult && rigResult.a11yScore >= 0) {
      map[comp.rigComponent] = {
        violations: rigResult.a11yViolations,
        passes: rigResult.a11yPasses,
        score: rigResult.a11yScore,
      }
    }
  }
  return map
}

// ── 8z. Compute test depth ratio ─────────────────────────────────────

/**
 * Compute a test-depth multiplier (0.0 – 1.0) based on how many tests
 * exist relative to component complexity.
 *
 * Complexity proxy = max(propCount + emitCount, 1) + floor(LOC / 50)
 * Expected tests  = complexity proxy (roughly 1 test per prop/emit + 1 per 50 LOC)
 * Depth ratio     = clamp(testCount / expectedTests, 0, 1)
 */
function computeTestDepth(testCount, sourceMetrics) {
  const complexity = Math.max(sourceMetrics.propCount + sourceMetrics.emitCount, 1)
    + Math.floor(sourceMetrics.loc / 50)
  const expected = Math.max(complexity, 3) // minimum 3 tests expected
  return Math.min(1, testCount / expected)
}

// ── 8a. Scan source metrics (LOC, props, emits, deps, file size) ─────

function scanSourceMetrics(sourcePath, type) {
  const absPath = resolve(ROOT, sourcePath)
  try {
    const content = readFileSync(absPath, 'utf-8')
    const stat = statSync(absPath)
    const lines = content.split('\n')
    const loc = lines.length

    let propCount = 0
    let emitCount = 0
    const deps = new Set()

    if (type === 'component') {
      // Count defineProps fields
      const propsMatch = content.match(/defineProps<\{([^}]*)\}>/s)
      if (propsMatch) {
        propCount = (propsMatch[1].match(/\w+\s*[?:]?\s*:/g) || []).length
      }
      // Also count withDefaults(defineProps<{...}>())
      const withDefaultsMatch = content.match(/defineProps<\{([^}]*)\}>\(\)/s)
      if (withDefaultsMatch && propCount === 0) {
        propCount = (withDefaultsMatch[1].match(/\w+\s*[?:]?\s*:/g) || []).length
      }

      // Count defineEmits
      const emitsMatch = content.match(/defineEmits<\{([^}]*)\}>/s)
      if (emitsMatch) {
        emitCount = (emitsMatch[1].match(/\(/g) || []).length
      }
      const emitsArrayMatch = content.match(/defineEmits\(\[([^\]]*)\]\)/)
      if (emitsArrayMatch && emitCount === 0) {
        emitCount = (emitsArrayMatch[1].match(/'/g) || []).length / 2
      }
    } else {
      // Composable: count exported functions/refs as "props" equivalent
      propCount = (content.match(/return\s*\{([^}]*)\}/s) || ['', ''])[1]
        .split(',').filter((s) => s.trim()).length
    }

    // Count import dependencies (from rig packages only)
    const importMatches = content.matchAll(/from\s+['"]\.\.?\//g)
    for (const m of importMatches) deps.add(m[0])
    const rigImports = content.matchAll(/from\s+['"]@(core|layout|nav|editor|lists|menus|extras|shell)\//g)
    for (const m of rigImports) deps.add(m[1])

    return {
      loc,
      fileSize: stat.size,
      propCount: Math.max(0, propCount),
      emitCount: Math.max(0, Math.round(emitCount)),
      depCount: deps.size,
    }
  } catch {
    return { loc: 0, fileSize: 0, propCount: 0, emitCount: 0, depCount: 0 }
  }
}

// ── 8b. Compute health score ─────────────────────────────────────────

// Components: Tests(25) + Coverage(25) + A11y(20) + Story(10) + Hex(10) + Bench(10) = 100
// Composables: Tests(40) + Coverage(40) + Bench(20) = 100
//
// Test scoring is depth-weighted: points scale by testDepth ratio and
// interaction test coverage, not just existence + pass/fail.
//
// A11y scoring blends regex source scan with runtime axe-core results
// (from comparison benchmarks) when available.
//
// An interaction test dimension rewards keyboard, focus, and reactivity
// test patterns within the test file.

function computeScore(entry) {
  let score = 0

  if (entry.type === 'composable') {
    // -- Composable scoring profile --
    // Tests: depth-weighted (40 points)
    if (entry.tests) {
      const { total, passed } = entry.tests
      const depth = entry.testDepth ?? 1
      if (total > 0) {
        // Base: 20pts for having tests, scaled by depth (0–1)
        score += Math.round(20 * Math.max(0.5, depth))
        // Bonus: up to 20pts for all passing, scaled by depth
        if (passed === total) score += Math.round(20 * Math.max(0.5, depth))
        else if (total > 0) score += Math.round(10 * (passed / total) * depth)
      }
    }

    // Coverage above thresholds (40 points)
    if (entry.coverage) {
      const avg =
        (entry.coverage.statements +
          entry.coverage.branches +
          entry.coverage.functions +
          entry.coverage.lines) /
        4
      score += Math.min(40, (avg / 100) * 40)
    }

    // Benchmark exists (20 points)
    if (entry.benchmark?.available) score += 20
  } else {
    // -- Component scoring profile --
    // Tests: depth-weighted (25 points)
    if (entry.tests) {
      const { total, passed } = entry.tests
      const depth = entry.testDepth ?? 1
      if (total > 0) {
        // Base: 12pts for having tests, scaled by depth
        score += Math.round(12 * Math.max(0.5, depth))
        // Bonus: up to 13pts for all passing, scaled by depth
        if (passed === total) score += Math.round(13 * Math.max(0.5, depth))
        else if (total > 0) score += Math.round(6 * (passed / total) * depth)
      }
    }

    // Coverage above thresholds (20 points — was 25, 5pts moved to interaction)
    if (entry.coverage) {
      const avg =
        (entry.coverage.statements +
          entry.coverage.branches +
          entry.coverage.functions +
          entry.coverage.lines) /
        4
      score += Math.min(20, (avg / 100) * 20)
    }

    // Accessibility: blended source scan + axe runtime (20 points)
    // Source regex scan: up to 10pts (presence in source code)
    // Axe-core runtime:  up to 10pts (actual a11y quality from comparison bench)
    if (entry.a11y) {
      // Source scan portion (10pts)
      if (entry.a11y.hasAriaAttributes) score += 4
      if (entry.a11y.hasKeyboardNav) score += 3
      if (entry.a11y.hasFocusManagement) score += 3
    }
    if (entry.axeRuntime) {
      // Axe-core runtime portion (10pts) — from comparison benchmarks
      score += Math.round((entry.axeRuntime.score / 100) * 10)
    } else if (entry.a11y) {
      // No axe data available: source scan earns up to 10 more
      // (a fallback so components without comparison bench data
      // can still earn the full 20)
      if (entry.a11y.hasAriaAttributes) score += 4
      if (entry.a11y.hasKeyboardNav) score += 4
      if (entry.a11y.hasFocusManagement) score += 2
    }

    // Interaction test quality (5 points — new dimension)
    if (entry.interactionTests) {
      const it = entry.interactionTests
      if (it.hasKeyboardTests) score += 2
      if (it.hasFocusTests) score += 1
      if (it.hasEmitTests) score += 1
      if (it.hasReactivityTests) score += 1
    }

    // Story exists (10 points)
    if (entry.story?.exists) score += 10

    // Hex CSS coverage (10 points)
    if (entry.hexCoverage?.hasStyles) score += 10

    // Benchmark exists (10 points)
    if (entry.benchmark?.available) score += 10
  }

  score = Math.min(100, Math.round(score))

  let grade
  if (score >= 90) grade = 'A'
  else if (score >= 75) grade = 'B'
  else if (score >= 60) grade = 'C'
  else if (score >= 45) grade = 'D'
  else grade = 'F'

  return { score, grade }
}

// -- 9. Discover showcase projects --

// Diagnostic views are measurement/health dashboards, not component showcases.
// They are kept in the demo app but excluded from showcase metrics.
const DIAGNOSTIC_IDS = new Set(['ecosystem-health', 'performance'])

function discoverShowcases(allComponents) {
  const showcasesDir = join(ROOT, 'demo', 'src', 'showcases')
  if (!existsSync(showcasesDir)) return { showcases: [], diagnostics: [] }

  const storyFiles = findFiles(showcasesDir, /\.story\.vue$/)
  const e2eDir = join(ROOT, 'demo', 'e2e')
  const e2eFiles = existsSync(e2eDir) ? findFiles(e2eDir, /\.spec\.ts$/) : []

  // Read e2e files once to check which showcases they cover
  const e2eContent = e2eFiles.map((f) => readFileSync(f, 'utf-8')).join('\n')

  // Build lookups from the enriched component data
  const componentNames = new Set(allComponents.map((c) => c.name))
  const componentByName = new Map(allComponents.map((c) => [c.name, c]))

  const all = []

  for (const sf of storyFiles) {
    const name = basename(sf, '.story.vue')
    const content = readFileSync(sf, 'utf-8')
    const relPath = relative(ROOT, sf)

    // Parse component imports from the file
    const importedComponents = []
    const importMatches = content.matchAll(/import\s+(\w+)\s+from\s+['"]@(?:core|layout|nav|editor|lists|menus|extras|shell)\//g)
    for (const m of importMatches) {
      if (componentNames.has(m[1])) {
        importedComponents.push(m[1])
      }
    }

    // Also find composable usage
    const composableMatches = content.matchAll(/import\s+\{\s*([^}]+)\}\s+from\s+['"]@(?:core|layout|nav|editor|lists|menus|extras|shell)\//g)
    for (const m of composableMatches) {
      const names = m[1].split(',').map((n) => n.trim())
      for (const n of names) {
        if (componentNames.has(n)) {
          importedComponents.push(n)
        }
      }
    }

    const uniqueImports = [...new Set(importedComponents)].sort()

    // Count lines of code (rough complexity)
    const loc = content.split('\n').length

    // Kebab-case ID from PascalCase name
    const id = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

    // Check if covered by e2e tests
    const hasE2e = e2eContent.includes(`'${id}'`) || e2eContent.includes(`"${id}"`)

    // Count unique Rig packages used
    const pkgMatches = content.matchAll(/@(core|layout|nav|editor|lists|menus|extras|shell)\//g)
    const packagesUsed = [...new Set([...pkgMatches].map((m) => m[1]))]

    // ── Computed measurements ──────────────────────────────────────
    // Average health score of imported components
    const compScores = uniqueImports
      .map((n) => componentByName.get(n))
      .filter(Boolean)
      .map((c) => c.score)
    const avgComponentScore = compScores.length > 0
      ? Math.round(compScores.reduce((a, b) => a + b, 0) / compScores.length)
      : 0

    // Coverage reach: what % of total library components does this showcase exercise?
    const coverageReach = allComponents.length > 0
      ? Math.round((uniqueImports.length / allComponents.length) * 1000) / 10
      : 0

    // How many of the used components have unit tests?
    const testedCount = uniqueImports
      .map((n) => componentByName.get(n))
      .filter(Boolean)
      .filter((c) => c.tests.total > 0)
      .length
    const testedRatio = uniqueImports.length > 0
      ? Math.round((testedCount / uniqueImports.length) * 100)
      : 0

    // Average coverage (statements) of used components
    const compCoverages = uniqueImports
      .map((n) => componentByName.get(n))
      .filter(Boolean)
      .filter((c) => c.coverage && c.coverage.statements > 0)
      .map((c) => c.coverage.statements)
    const avgCoverage = compCoverages.length > 0
      ? Math.round(compCoverages.reduce((a, b) => a + b, 0) / compCoverages.length * 10) / 10
      : 0

    // How many have a11y attributes scanned?
    const a11yCount = uniqueImports
      .map((n) => componentByName.get(n))
      .filter(Boolean)
      .filter((c) => c.a11y?.hasAriaAttributes)
      .length

    // Package breadth: ratio of packages used vs total available (8 packages)
    const packageBreadth = Math.round((packagesUsed.length / 8) * 100)

    all.push({
      name,
      id,
      source: relPath,
      componentsUsed: uniqueImports,
      componentCount: uniqueImports.length,
      packagesUsed: packagesUsed.sort(),
      packageCount: packagesUsed.length,
      loc,
      hasE2e,
      // Measurements
      avgComponentScore,
      coverageReach,
      testedRatio,
      avgCoverage,
      a11yCount,
      packageBreadth,
    })
  }

  // Separate showcases from diagnostics
  const showcases = all
    .filter((s) => !DIAGNOSTIC_IDS.has(s.id))
    .sort((a, b) => a.name.localeCompare(b.name))
  const diagnostics = all
    .filter((s) => DIAGNOSTIC_IDS.has(s.id))
    .sort((a, b) => a.name.localeCompare(b.name))

  return { showcases, diagnostics }
}

// -- Main --

console.log('Generating health manifest...')
const start = Date.now()

// Load data sources
const testsJson = readJSON(TESTS_JSON)
const coverageJson = readJSON(COVERAGE_JSON)
const benchJson = readJSON(BENCH_JSON)

if (!testsJson) {
  console.warn('  Warning: .health/tests.json not found. Run: pnpm health:collect')
}
if (!coverageJson) {
  console.warn('  Warning: coverage/coverage-summary.json not found. Run: pnpm test:coverage')
}

// Build lookup maps
const testMap = mapTestResults(testsJson)
const coverageMap = mapCoverage(coverageJson)
const benchMap = mapBenchmarks(benchJson)
const hexSelectors = scanHexSelectors()
const stories = findStories()
const axeResultsMap = loadAxeResults()

// Discover and enrich components
const discovered = discoverComponents()
const components = []

for (const comp of discovered) {
  // Tests
  const testData = comp.testFile ? testMap[comp.testFile] : null
  const tests = testData
    ? {
        total: testData.tests.length,
        passed: testData.tests.filter((t) => t.status === 'passed').length,
        failed: testData.tests.filter((t) => t.status === 'failed').length,
        duration: testData.duration,
        names: testData.tests.map((t) => ({
          name: t.name,
          status: t.status,
          duration: t.duration,
        })),
      }
    : null

  // Coverage
  const coverage = coverageMap[comp.source] ?? null

  // Benchmarks
  const benchData = comp.benchFile ? benchMap[comp.benchFile] : null
  const benchmark = benchData
    ? { available: true, results: benchData }
    : { available: comp.benchFile !== null, results: [] }

  // Accessibility
  const a11y = comp.type === 'component' ? scanA11y(comp.source) : null

  // Story
  const storyData = stories[comp.name]
  const story = {
    exists: !!storyData,
    path: storyData?.path ?? null,
    variants: storyData?.variants ?? 0,
  }

  // Hex CSS coverage
  const rigSelector = componentToRigSelector(comp.name)
  const hexMatches = hexSelectors[rigSelector]
  const hexCoverage = {
    hasStyles: !!hexMatches,
    selectors: hexMatches ?? [],
  }

  // Source metrics
  const sourceMetrics = scanSourceMetrics(comp.source, comp.type)

  // Interaction test scan (new: Rec #4)
  const interactionTests = scanInteractionTests(comp.testFile)

  // Test depth ratio (new: Rec #1)
  const testDepth = tests ? computeTestDepth(tests.total, sourceMetrics) : 0

  // Axe-core runtime results (new: Rec #3)
  const axeRuntime = axeResultsMap[comp.name] ?? null

  // Compute score
  const entry = {
    name: comp.name,
    package: comp.package,
    type: comp.type,
    source: comp.source,
    sourceMetrics,
    tests,
    coverage,
    benchmark,
    a11y,
    axeRuntime,
    interactionTests,
    testDepth,
    story,
    hexCoverage,
  }

  const { score, grade } = computeScore(entry)
  entry.score = score
  entry.grade = grade

  // Gap analysis: what would improve this component's score?
  const gaps = []
  const isComposable = comp.type === 'composable'

  if (!tests || tests.total === 0) {
    gaps.push({ dimension: 'tests', label: 'Add unit tests', impact: isComposable ? 40 : 25 })
  } else if (tests.failed > 0) {
    gaps.push({ dimension: 'tests', label: `Fix ${tests.failed} failing test(s)`, impact: isComposable ? 16 : 10 })
  } else if (testDepth < 0.6) {
    const currentPts = isComposable ? 40 : 25
    const potential = Math.round(currentPts * (1 - testDepth) * 0.5)
    if (potential > 0) {
      gaps.push({ dimension: 'tests', label: `Add more tests (depth ${Math.round(testDepth * 100)}%, need ${Math.round(sourceMetrics.propCount + sourceMetrics.emitCount + Math.floor(sourceMetrics.loc / 50))} tests)`, impact: potential })
    }
  }

  if (!coverage) {
    gaps.push({ dimension: 'coverage', label: 'Add coverage data', impact: isComposable ? 40 : 20 })
  } else {
    const avg = (coverage.statements + coverage.branches + coverage.functions + coverage.lines) / 4
    if (avg < 80) {
      const potential = isComposable
        ? Math.round(Math.min(40, (80 / 100) * 40) - Math.min(40, (avg / 100) * 40))
        : Math.round(Math.min(20, (80 / 100) * 20) - Math.min(20, (avg / 100) * 20))
      if (potential > 0) {
        gaps.push({ dimension: 'coverage', label: `Increase coverage from ${Math.round(avg)}% to 80%`, impact: potential })
      }
    }
  }

  if (!isComposable) {
    // A11y: source scan gaps (10pts portion)
    if (!a11y || !a11y.hasAriaAttributes) {
      gaps.push({ dimension: 'a11y', label: 'Add ARIA attributes or roles', impact: 4 })
    }
    if (!a11y || !a11y.hasKeyboardNav) {
      gaps.push({ dimension: 'a11y', label: 'Add keyboard navigation', impact: 3 })
    }
    if (!a11y || !a11y.hasFocusManagement) {
      gaps.push({ dimension: 'a11y', label: 'Add focus management', impact: 3 })
    }
    // A11y: axe runtime gaps (10pts portion)
    if (!axeRuntime) {
      gaps.push({ dimension: 'a11y-runtime', label: 'Add to comparison benchmarks for axe-core scan', impact: 10 })
    } else if (axeRuntime.score < 90) {
      const potential = Math.round(((90 - axeRuntime.score) / 100) * 10)
      if (potential > 0) {
        gaps.push({ dimension: 'a11y-runtime', label: `Fix axe-core violations (score ${axeRuntime.score}, need 90+)`, impact: potential })
      }
    }
    // Interaction test gaps (5pts)
    if (!interactionTests.hasKeyboardTests) {
      gaps.push({ dimension: 'interaction', label: 'Add keyboard interaction tests', impact: 2 })
    }
    if (!interactionTests.hasFocusTests) {
      gaps.push({ dimension: 'interaction', label: 'Add focus management tests', impact: 1 })
    }
    if (!interactionTests.hasEmitTests) {
      gaps.push({ dimension: 'interaction', label: 'Add event emission tests', impact: 1 })
    }
    if (!interactionTests.hasReactivityTests) {
      gaps.push({ dimension: 'interaction', label: 'Add reactivity/prop-update tests', impact: 1 })
    }
    if (!story.exists) {
      gaps.push({ dimension: 'story', label: 'Create a .story.vue file', impact: 10 })
    }
    if (!hexCoverage.hasStyles) {
      gaps.push({ dimension: 'hex', label: 'Add Hex CSS selectors', impact: 10 })
    }
  }

  if (!benchmark.available) {
    gaps.push({ dimension: 'bench', label: 'Add a .bench.ts file', impact: isComposable ? 20 : 10 })
  }

  // Sort by impact descending
  gaps.sort((a, b) => b.impact - a.impact)

  // What grade threshold comes next?
  const thresholds = [90, 75, 60, 45]
  const nextThreshold = thresholds.find((t) => t > score) ?? 100
  const pointsToNext = nextThreshold - score

  entry.gaps = gaps
  entry.nextGrade = {
    current: grade,
    target: nextThreshold >= 90 ? 'A' : nextThreshold >= 75 ? 'B' : nextThreshold >= 60 ? 'C' : 'D',
    pointsNeeded: pointsToNext,
    totalGapImpact: gaps.reduce((s, g) => s + g.impact, 0),
  }

  components.push(entry)
}

// Aggregate stats
const totalTests = testsJson?.numTotalTests ?? 0
const totalPassed = testsJson?.numPassedTests ?? 0
const totalFailed = testsJson?.numFailedTests ?? 0

const coverageTotal = coverageJson?.total
const overallCoverage = coverageTotal
  ? {
      statements: pct(coverageTotal.statements),
      branches: pct(coverageTotal.branches),
      functions: pct(coverageTotal.functions),
      lines: pct(coverageTotal.lines),
    }
  : null

const avgScore =
  components.length > 0
    ? Math.round(components.reduce((s, c) => s + c.score, 0) / components.length)
    : 0

const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 }
for (const c of components) {
  gradeDistribution[c.grade]++
}

// Build manifest
const manifest = {
  generated: new Date().toISOString(),
  version: 3,

  summary: {
    totalComponents: components.filter((c) => c.type === 'component').length,
    totalComposables: components.filter((c) => c.type === 'composable').length,
    totalTests,
    totalPassed,
    totalFailed,
    overallCoverage,
    averageScore: avgScore,
    gradeDistribution,
    packages: PACKAGES.map((pkg) => {
      const pkgComponents = components.filter((c) => c.package === pkg)
      return {
        name: pkg,
        count: pkgComponents.length,
        avgScore:
          pkgComponents.length > 0
            ? Math.round(
                pkgComponents.reduce((s, c) => s + c.score, 0) / pkgComponents.length,
              )
            : 0,
      }
    }),

    // Score distribution (buckets of 10)
    scoreDistribution: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((min) => ({
      min,
      max: min + 9,
      count: components.filter((c) => c.score >= min && c.score <= min + 9).length,
    })),

    // Dimension fill rates
    dimensionFill: {
      tests: { filled: components.filter((c) => c.tests && c.tests.total > 0).length, total: components.length },
      coverage: { filled: components.filter((c) => c.coverage).length, total: components.length },
      a11y: {
        filled: components.filter((c) => c.a11y && c.a11y.patterns.length > 0).length,
        total: components.filter((c) => c.type === 'component').length,
      },
      axeRuntime: {
        filled: components.filter((c) => c.axeRuntime).length,
        total: components.filter((c) => c.type === 'component').length,
      },
      interaction: {
        filled: components.filter((c) => c.interactionTests && c.interactionTests.interactionPatterns.length > 0).length,
        total: components.filter((c) => c.type === 'component').length,
      },
      story: {
        filled: components.filter((c) => c.story.exists).length,
        total: components.filter((c) => c.type === 'component').length,
      },
      hex: {
        filled: components.filter((c) => c.hexCoverage.hasStyles).length,
        total: components.filter((c) => c.type === 'component').length,
      },
      bench: { filled: components.filter((c) => c.benchmark.available).length, total: components.length },
    },

    // Test depth stats
    avgTestDepth: Math.round(
      (components.filter((c) => c.tests?.total > 0).reduce((s, c) => s + (c.testDepth ?? 0), 0) /
        Math.max(1, components.filter((c) => c.tests?.total > 0).length)) * 100,
    ) / 100,

    // Total gaps and actionable items
    totalGaps: components.reduce((s, c) => s + c.gaps.length, 0),
    avgGapsPerComponent: Math.round(
      (components.reduce((s, c) => s + c.gaps.length, 0) / components.length) * 10,
    ) / 10,

    // Source metrics aggregates
    totalLoc: components.reduce((s, c) => s + c.sourceMetrics.loc, 0),
    avgLoc: Math.round(components.reduce((s, c) => s + c.sourceMetrics.loc, 0) / components.length),
  },

  components: components.sort((a, b) => a.name.localeCompare(b.name)),

  ...discoverShowcases(components),
}

writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2))

// ── Append history snapshot ──────────────────────────────────────────
const HISTORY_JSON = resolve(HEALTH_DIR, 'history.json')
const history = readJSON(HISTORY_JSON) ?? { snapshots: [] }

const snapshot = {
  timestamp: manifest.generated,
  averageScore: avgScore,
  gradeDistribution: { ...gradeDistribution },
  totalTests,
  totalPassed,
  totalFailed,
  totalComponents: manifest.summary.totalComponents,
  totalComposables: manifest.summary.totalComposables,
  totalGaps: manifest.summary.totalGaps,
  totalLoc: manifest.summary.totalLoc,
  overallCoverage: manifest.summary.overallCoverage,
  dimensionFill: Object.fromEntries(
    Object.entries(manifest.summary.dimensionFill).map(([k, v]) => [
      k,
      Math.round((v.filled / v.total) * 100),
    ]),
  ),
  packages: manifest.summary.packages.map((p) => ({ name: p.name, avgScore: p.avgScore })),
  componentScores: Object.fromEntries(components.map((c) => [c.name, c.score])),
}

history.snapshots.push(snapshot)
writeFileSync(HISTORY_JSON, JSON.stringify(history, null, 2))

const elapsed = Date.now() - start
console.log(`  Written to .health/manifest.json (${elapsed}ms)`)
console.log(`  History: ${history.snapshots.length} snapshot(s) in .health/history.json`)
console.log(`  ${manifest.summary.totalComponents} components, ${manifest.summary.totalComposables} composables, ${manifest.showcases.length} showcases, ${manifest.diagnostics.length} diagnostics`)
console.log(`  Average score: ${avgScore} | Grades: A:${gradeDistribution.A} B:${gradeDistribution.B} C:${gradeDistribution.C} D:${gradeDistribution.D} F:${gradeDistribution.F}`)
