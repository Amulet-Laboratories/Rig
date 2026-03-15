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
//   5. .health/bench.json          -- benchmark results (optional)
//
// Run:
//   pnpm health              -- collect + generate
//   node scripts/generate-health-manifest.mjs -- generate only (from existing data)
//
// Output: .health/manifest.json

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { resolve, join, relative, basename } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const HEX_ROOT = resolve(ROOT, 'hex')
const HEALTH_DIR = resolve(ROOT, '.health')
const TESTS_JSON = resolve(HEALTH_DIR, 'tests.json')
const BENCH_JSON = resolve(HEALTH_DIR, 'bench.json')
const COVERAGE_JSON = resolve(ROOT, 'coverage', 'coverage-summary.json')
const MANIFEST_OUT = resolve(HEALTH_DIR, 'manifest.json')

const PACKAGES = [
  'core',
  'layout',
  'nav',
  'editor',
  'lists',
  'menus',
  'extras',
  'shell',
  'data',
  'spatial',
  'temporal',
]

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
  } catch {
    /* dir doesn't exist */
  }
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

    // Composables at src/ root (use*.ts / provide*.ts files not in composables/)
    const rootTsFiles = readdirSync(srcDir).filter(
      (f) => /^(?:use|provide)[A-Z].*\.ts$/.test(f) && !f.includes('.test.') && !f.includes('.bench.'),
    )
    for (const fileName of rootTsFiles) {
      const name = basename(fileName, '.ts')
      const fullPath = join(srcDir, fileName)
      // Skip if already discovered from composables/ dir
      if (components.some((c) => c.name === name)) continue

      components.push({
        name,
        package: pkg,
        type: 'composable',
        source: relative(ROOT, fullPath),
        testFile: findSibling(fullPath, '.test.ts'),
        benchFile: findSibling(fullPath, '.bench.ts'),
      })
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
      duration: Math.round(suite.assertionResults.reduce((s, t) => s + (t.duration || 0), 0)),
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
    const hasFocusManagement = /useFocusTrap|\.focus\(\)|tabindex|:tabindex|roving/i.test(content)
    const hasReducedMotion = /prefers-reduced-motion|useReducedMotion/.test(content)

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

// ── 5b. Scan TypeScript strictness ───────────────────────────────────

function scanTsStrictness(sourcePath) {
  const absPath = resolve(ROOT, sourcePath)
  try {
    const content = readFileSync(absPath, 'utf-8')

    const anyCasts = (content.match(/\bas\s+any\b/g) || []).length
    const anyTypes = (content.match(/:\s*any\b/g) || []).length
    const tsIgnores = (content.match(/@ts-ignore/g) || []).length
    const tsExpectErrors = (content.match(/@ts-expect-error/g) || []).length
    const nonNullAssertions = (content.match(/!\./g) || []).length

    const issues = anyCasts + anyTypes + tsIgnores + tsExpectErrors + nonNullAssertions
    const isStrict = issues === 0

    return {
      isStrict,
      anyCasts,
      anyTypes,
      tsIgnores,
      tsExpectErrors,
      nonNullAssertions,
      totalIssues: issues,
    }
  } catch {
    return {
      isStrict: true,
      anyCasts: 0,
      anyTypes: 0,
      tsIgnores: 0,
      tsExpectErrors: 0,
      nonNullAssertions: 0,
      totalIssues: 0,
    }
  }
}

// ── 5c. Scan documentation coverage ─────────────────────────────────

function scanDocumentation(sourcePath, sourceMetrics) {
  const absPath = resolve(ROOT, sourcePath)
  try {
    const content = readFileSync(absPath, 'utf-8')

    // Check for JSDoc comments (/** ... */)
    const jsdocCount = (content.match(/\/\*\*[\s\S]*?\*\//g) || []).length

    // Check for inline comments preceding defineProps/defineEmits
    const hasPropsDoc =
      /\/\*\*[\s\S]*?\*\/\s*\n\s*(const\s+\w+\s*=\s*)?defineProps/m.test(content) ||
      /\/\/.*\n\s*(const\s+\w+\s*=\s*)?defineProps/m.test(content)
    const hasEmitsDoc =
      /\/\*\*[\s\S]*?\*\/\s*\n\s*(const\s+\w+\s*=\s*)?defineEmits/m.test(content) ||
      /\/\/.*\n\s*(const\s+\w+\s*=\s*)?defineEmits/m.test(content)

    // Check for @description, @param, @returns tags
    const hasParamDocs = /@param\s/.test(content)
    const hasReturnDocs = /@returns?\s/.test(content)

    // For composables: check if exported return values are documented
    const hasExportDoc = /\/\*\*[\s\S]*?\*\/\s*\n\s*export\s/.test(content)

    const documented = [hasPropsDoc, hasEmitsDoc, hasParamDocs, hasReturnDocs, hasExportDoc].filter(
      Boolean,
    ).length

    // Rough doc coverage: jsdoc comments vs (props + emits + 1 for the component itself)
    const expected = Math.max(sourceMetrics.propCount + sourceMetrics.emitCount + 1, 1)
    const ratio = Math.min(1, jsdocCount / expected)

    return {
      jsdocCount,
      hasPropsDoc,
      hasEmitsDoc,
      hasParamDocs,
      hasReturnDocs,
      hasExportDoc,
      documentedFeatures: documented,
      docCoverageRatio: Math.round(ratio * 100) / 100,
    }
  } catch {
    return {
      jsdocCount: 0,
      hasPropsDoc: false,
      hasEmitsDoc: false,
      hasParamDocs: false,
      hasReturnDocs: false,
      hasExportDoc: false,
      documentedFeatures: 0,
      docCoverageRatio: 0,
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
    // Match [data-rig-component-name] selectors (include digits for e.g. scatter-plot-3d)
    const matches = content.matchAll(/\[data-rig-([a-z0-9-]+)\]/g)
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
  'scatter-plot3-d': 'scatter-plot-3d',
}

/** Map a component name to its data-rig-* selector name */
function componentToRigSelector(name) {
  // PascalCase → kebab-case, e.g. 'EditorWorkbench' → 'editor-workbench'
  const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  return RIG_SELECTOR_ALIASES[kebab] ?? kebab
}

// -- 8. Compute health score --

// ── 8x. Scan interaction test quality ─────────────────────────────────

/** Scan a test file's content for interaction-quality signals */
function scanInteractionTests(testFilePath) {
  const empty = {
    hasKeyboardTests: false,
    hasFocusTests: false,
    hasEmitTests: false,
    hasSlotTests: false,
    hasReactivityTests: false,
    interactionPatterns: [],
    boilerplateCount: 0,
  }
  if (!testFilePath) return empty
  const absPath = resolve(ROOT, testFilePath)
  try {
    const content = readFileSync(absPath, 'utf-8')

    // ── Boilerplate detection ──
    // Count assertions that are always-true and therefore test nothing:
    //   expect(wrapper.exists()).toBe(true)  — always true after mount
    //   expect(document.activeElement).toBeDefined()  — always true in jsdom
    const boilerplateExists = (content.match(/expect\(wrapper\.exists\(\)\)/g) || []).length
    const boilerplateActive = (
      content.match(/expect\(document\.activeElement\)\.toBeDefined/g) || []
    ).length
    const boilerplateCount = boilerplateExists + boilerplateActive

    // ── Trigger detection (raw presence) ──
    const hasKeyboardTriggers =
      /trigger\(['"]keydown|trigger\(['"]keyup|KeyboardEvent|@keydown|key:\s*['"]Arrow|key:\s*['"]Enter|key:\s*['"]Escape|key:\s*['"]Tab|key:\s*['"]Home|key:\s*['"]End/.test(
        content,
      )
    const hasFocusTriggers =
      /\.focus\(|document\.activeElement|focusTrap|focusIn|focusOut|trigger\(['"]focus/.test(
        content,
      )
    const hasEmitPatterns = /emitted\(|emit\(/.test(content)
    const hasSlotPatterns = /slots:\s*\{|#default|v-slot|slot:/.test(content)
    const hasReactivityTriggers = /setProps|setValue|nextTick|flushPromises|wrapper\.vm\.\$/.test(
      content,
    )

    // ── Substantive assertion detection ──
    // These indicate real behavioral assertions (not just existence checks)
    const substantivePatterns =
      /toHaveAttribute|toContain|toHaveBeenCalled|toEqual|toHaveClass|toMatch|toHaveLength|toBeNull|toBeUndefined|toBeFalsy|emitted\(/
    const totalExpects = (content.match(/expect\(/g) || []).length
    const substantiveCount = totalExpects - boilerplateCount

    // ── Quality-gated flags ──
    // A dimension counts as tested only if the file has BOTH the trigger pattern
    // AND substantive assertions (not dominated by boilerplate).
    // boilerplateRatio > 0.5 means more boilerplate than real assertions.
    const boilerplateRatio = totalExpects > 0 ? boilerplateCount / totalExpects : 0
    const hasQuality = substantiveCount > boilerplateCount

    const hasKeyboardTests = hasKeyboardTriggers && (hasQuality || !boilerplateExists)
    const hasFocusTests = hasFocusTriggers && (hasQuality || !boilerplateActive)
    const hasEmitTests = hasEmitPatterns && substantivePatterns.test(content)
    const hasSlotTests = hasSlotPatterns
    const hasReactivityTests = hasReactivityTriggers && (hasQuality || !boilerplateExists)

    const patterns = []
    if (hasKeyboardTests) patterns.push('keyboard-interaction')
    if (hasFocusTests) patterns.push('focus-management')
    if (hasEmitTests) patterns.push('event-emissions')
    if (hasSlotTests) patterns.push('slot-rendering')
    if (hasReactivityTests) patterns.push('reactivity')

    return {
      hasKeyboardTests,
      hasFocusTests,
      hasEmitTests,
      hasSlotTests,
      hasReactivityTests,
      interactionPatterns: patterns,
      boilerplateCount,
      boilerplateRatio: Math.round(boilerplateRatio * 100) / 100,
    }
  } catch {
    return empty
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

// ── 8y2. Load per-component tree-shake sizes ────────────────────────

function loadTreeShakeResults() {
  const TREE_SHAKE_JSON = resolve(HEALTH_DIR, 'tree-shake.json')
  const data = readJSON(TREE_SHAKE_JSON)
  if (!data?.components) return {}
  return data.components // { ComponentName: { rawBytes, gzipBytes, rawKb, gzipKb } }
}

// ── 8z. Compute test depth ratio ─────────────────────────────────────

/**
 * Compute a test-depth multiplier (0.0 – 1.0) based on how many
 * SUBSTANTIVE tests exist relative to component complexity.
 *
 * Complexity proxy = max(propCount + emitCount, 1) * 2 + ceil(LOC / 25)
 * Effective tests  = testCount − boilerplateCount
 * Expected tests   = max(complexity, 5)
 * Depth ratio      = clamp(effectiveTests / expectedTests, 0, 1)
 */
function computeTestDepth(testCount, sourceMetrics, boilerplateCount = 0) {
  const effectiveTests = Math.max(0, testCount - boilerplateCount)
  const complexity =
    Math.max(sourceMetrics.propCount + sourceMetrics.emitCount, 1) * 2 +
    Math.ceil(sourceMetrics.loc / 25)
  const expected = Math.max(complexity, 5)
  return Math.round(Math.min(1, effectiveTests / expected) * 100) / 100
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
        .split(',')
        .filter((s) => s.trim()).length
    }

    // Count import dependencies (from rig packages only)
    const importMatches = content.matchAll(/from\s+['"]\.\.?\//g)
    for (const m of importMatches) deps.add(m[0])
    const rigImports = content.matchAll(
      /from\s+['"]@(core|layout|nav|editor|lists|menus|extras|shell)\//g,
    )
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

// Components: Tests(30) + Coverage(25) + A11y(20) + Interaction(5) + Hex(10) + Bench(10) = 100
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
    // Tests: depth-weighted (30 points)
    if (entry.tests) {
      const { total, passed } = entry.tests
      const depth = entry.testDepth ?? 1
      if (total > 0) {
        // Base: 15pts for having tests, scaled by depth
        score += Math.round(15 * Math.max(0.5, depth))
        // Bonus: up to 15pts for all passing, scaled by depth
        if (passed === total) score += Math.round(15 * Math.max(0.5, depth))
        else if (total > 0) score += Math.round(7 * (passed / total) * depth)
      }
    }

    // Coverage above thresholds (25 points)
    if (entry.coverage) {
      const avg =
        (entry.coverage.statements +
          entry.coverage.branches +
          entry.coverage.functions +
          entry.coverage.lines) /
        4
      score += Math.min(25, (avg / 100) * 25)
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

    // Interaction test quality (5 points — discounted by boilerplate)
    if (entry.interactionTests) {
      const it = entry.interactionTests
      // Discount interaction points by boilerplate ratio:
      //   0 boilerplate stubs → full credit
      //   3+ stubs → zero credit
      const bpPenalty = Math.min(1, (it.boilerplateCount || 0) / 3)
      const bpMultiplier = 1 - bpPenalty
      if (it.hasKeyboardTests) score += Math.round(2 * bpMultiplier)
      if (it.hasFocusTests) score += Math.round(1 * bpMultiplier)
      if (it.hasEmitTests) score += Math.round(1 * bpMultiplier)
      if (it.hasReactivityTests) score += Math.round(1 * bpMultiplier)
    }

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
const axeResultsMap = loadAxeResults()
const treeShakeMap = loadTreeShakeResults()

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

  // Hex CSS coverage
  const rigSelector = componentToRigSelector(comp.name)
  const hexMatches = hexSelectors[rigSelector]
  const hexCoverage = {
    hasStyles: !!hexMatches,
    selectors: hexMatches ?? [],
  }

  // Source metrics
  const sourceMetrics = scanSourceMetrics(comp.source, comp.type)

  // TypeScript strictness scan
  const tsStrictness = scanTsStrictness(comp.source)

  // Documentation coverage scan
  const documentation = scanDocumentation(comp.source, sourceMetrics)

  // Interaction test scan (with boilerplate detection)
  const interactionTests = scanInteractionTests(comp.testFile)

  // Test depth ratio (boilerplate-aware)
  const testDepth = tests
    ? computeTestDepth(tests.total, sourceMetrics, interactionTests.boilerplateCount)
    : 0

  // Axe-core runtime results (new: Rec #3)
  const axeRuntime = axeResultsMap[comp.name] ?? null

  // Per-component tree-shaken bundle size
  const treeShake = treeShakeMap[comp.name] ?? null

  // Compute score
  const entry = {
    name: comp.name,
    package: comp.package,
    type: comp.type,
    source: comp.source,
    sourceMetrics,
    tsStrictness,
    documentation,
    tests,
    coverage,
    benchmark,
    a11y,
    axeRuntime,
    interactionTests,
    testDepth,
    hexCoverage,
    treeShake,
  }

  const { score, grade } = computeScore(entry)
  entry.score = score
  entry.grade = grade

  // Gap analysis: what would improve this component's score?
  const gaps = []
  const isComposable = comp.type === 'composable'

  if (!tests || tests.total === 0) {
    gaps.push({ dimension: 'tests', label: 'Add unit tests', impact: isComposable ? 40 : 30 })
  } else if (tests.failed > 0) {
    gaps.push({
      dimension: 'tests',
      label: `Fix ${tests.failed} failing test(s)`,
      impact: isComposable ? 16 : 12,
    })
  } else if (testDepth < 0.6) {
    const currentPts = isComposable ? 40 : 30
    const potential = Math.round(currentPts * (1 - testDepth) * 0.5)
    if (potential > 0) {
      gaps.push({
        dimension: 'tests',
        label: `Add more tests (depth ${Math.round(testDepth * 100)}%, need ${Math.round(sourceMetrics.propCount + sourceMetrics.emitCount + Math.floor(sourceMetrics.loc / 50))} tests)`,
        impact: potential,
      })
    }
  }

  if (!coverage) {
    gaps.push({ dimension: 'coverage', label: 'Add coverage data', impact: isComposable ? 40 : 25 })
  } else {
    const avg = (coverage.statements + coverage.branches + coverage.functions + coverage.lines) / 4
    if (avg < 80) {
      const potential = isComposable
        ? Math.round(Math.min(40, (80 / 100) * 40) - Math.min(40, (avg / 100) * 40))
        : Math.round(Math.min(25, (80 / 100) * 25) - Math.min(25, (avg / 100) * 25))
      if (potential > 0) {
        gaps.push({
          dimension: 'coverage',
          label: `Increase coverage from ${Math.round(avg)}% to 80%`,
          impact: potential,
        })
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
      gaps.push({
        dimension: 'a11y-runtime',
        label: 'Add to comparison benchmarks for axe-core scan',
        impact: 10,
      })
    } else if (axeRuntime.score < 90) {
      const potential = Math.round(((90 - axeRuntime.score) / 100) * 10)
      if (potential > 0) {
        gaps.push({
          dimension: 'a11y-runtime',
          label: `Fix axe-core violations (score ${axeRuntime.score}, need 90+)`,
          impact: potential,
        })
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
            ? Math.round(pkgComponents.reduce((s, c) => s + c.score, 0) / pkgComponents.length)
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
      tests: {
        filled: components.filter((c) => c.tests && c.tests.total > 0).length,
        total: components.length,
      },
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
        filled: components.filter(
          (c) =>
            c.type === 'component' &&
            c.interactionTests &&
            c.interactionTests.interactionPatterns.length > 0,
        ).length,
        total: components.filter((c) => c.type === 'component').length,
      },
      hex: {
        filled: components.filter((c) => c.hexCoverage.hasStyles).length,
        total: components.filter((c) => c.type === 'component').length,
      },
      bench: {
        filled: components.filter((c) => c.benchmark.available).length,
        total: components.length,
      },
      tsStrict: {
        filled: components.filter((c) => c.tsStrictness.isStrict).length,
        total: components.length,
      },
      documentation: {
        filled: components.filter((c) => c.documentation.docCoverageRatio >= 0.5).length,
        total: components.length,
      },
    },

    // Test depth stats
    avgTestDepth:
      Math.round(
        (components.filter((c) => c.tests?.total > 0).reduce((s, c) => s + (c.testDepth ?? 0), 0) /
          Math.max(1, components.filter((c) => c.tests?.total > 0).length)) *
          100,
      ) / 100,

    // Boilerplate test quality metrics
    boilerplate: {
      totalBoilerplateAssertions: components.reduce(
        (s, c) => s + (c.interactionTests?.boilerplateCount ?? 0),
        0,
      ),
      filesWithBoilerplate: components.filter(
        (c) => (c.interactionTests?.boilerplateCount ?? 0) > 0,
      ).length,
      avgBoilerplateRatio:
        Math.round(
          (components
            .filter((c) => c.interactionTests?.boilerplateRatio != null)
            .reduce((s, c) => s + c.interactionTests.boilerplateRatio, 0) /
            Math.max(
              1,
              components.filter((c) => c.interactionTests?.boilerplateRatio != null).length,
            )) *
            100,
        ) / 100,
    },

    // Total gaps and actionable items
    totalGaps: components.reduce((s, c) => s + c.gaps.length, 0),
    avgGapsPerComponent:
      Math.round((components.reduce((s, c) => s + c.gaps.length, 0) / components.length) * 10) / 10,

    // Source metrics aggregates
    totalLoc: components.reduce((s, c) => s + c.sourceMetrics.loc, 0),
    avgLoc: Math.round(components.reduce((s, c) => s + c.sourceMetrics.loc, 0) / components.length),
  },

  components: components.sort((a, b) => a.name.localeCompare(b.name)),
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

// ── Cap history: keep ≤90 most recent, downsample older to 1-per-day ──
if (history.snapshots.length > 90) {
  const now = Date.now()
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
  const cutoff = now - THIRTY_DAYS

  // Split into recent (≤30 days, keep all) and older (>30 days, keep 1 per day)
  const recent = []
  const older = []
  for (const s of history.snapshots) {
    if (new Date(s.timestamp).getTime() >= cutoff) {
      recent.push(s)
    } else {
      older.push(s)
    }
  }

  // Downsample older entries to one per calendar day (keep the last of each day)
  const byDay = new Map()
  for (const s of older) {
    const day = new Date(s.timestamp).toISOString().slice(0, 10)
    byDay.set(day, s)
  }
  const downsampled = [...byDay.values()]

  // Cap total at 90
  const combined = [...downsampled, ...recent]
  history.snapshots = combined.slice(-90)
}

writeFileSync(HISTORY_JSON, JSON.stringify(history, null, 2))

const elapsed = Date.now() - start
console.log(`  Written to .health/manifest.json (${elapsed}ms)`)
console.log(`  History: ${history.snapshots.length} snapshot(s) in .health/history.json`)
console.log(
  `  ${manifest.summary.totalComponents} components, ${manifest.summary.totalComposables} composables`,
)
console.log(
  `  Average score: ${avgScore} | Grades: A:${gradeDistribution.A} B:${gradeDistribution.B} C:${gradeDistribution.C} D:${gradeDistribution.D} F:${gradeDistribution.F}`,
)
