#!/usr/bin/env node
/**
 * tree-shake-analysis.mjs — Per-component tree-shaken bundle size measurement.
 *
 * Creates a temp Vite project for each component, imports it individually from
 * the Rig dist output, builds, and measures the resulting JS size (raw + gzip).
 *
 * Writes results to .health/tree-shake.json.
 *
 * Usage:
 *   node scripts/tree-shake-analysis.mjs            # all components
 *   node scripts/tree-shake-analysis.mjs Button Tabs # specific components
 *
 * Requires: pnpm build to have been run first (needs dist/).
 */

import { mkdtempSync, writeFileSync, rmSync, readdirSync, readFileSync, statSync, existsSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { gzipSync } from 'node:zlib'

const ROOT = resolve(import.meta.dirname, '..')
const DIST = resolve(ROOT, 'dist')
const HEALTH_DIR = resolve(ROOT, '.health')
const OUTPUT = resolve(HEALTH_DIR, 'tree-shake.json')

// ── Discover exported components from dist ──────────────────────────

function discoverExports() {
  const indexPath = join(DIST, 'index.mjs')
  if (!existsSync(indexPath)) {
    console.error('dist/index.mjs not found — run pnpm build first')
    process.exit(1)
  }

  const content = readFileSync(indexPath, 'utf-8')

  // Match all named exports: export { Foo, Bar } or export { Foo as Bar }
  const names = new Set()
  const exportMatches = content.matchAll(/export\s*\{([^}]+)\}/g)
  for (const m of exportMatches) {
    const items = m[1].split(',').map((s) => s.trim())
    for (const item of items) {
      // Handle "Foo as Bar" — take the exported name (Bar)
      const asMatch = item.match(/(\w+)\s+as\s+(\w+)/)
      if (asMatch) {
        names.add(asMatch[2])
      } else if (item && /^[A-Z]/.test(item)) {
        names.add(item)
      }
    }
  }

  // Also match direct export declarations
  const directExports = content.matchAll(/export\s+(?:const|function|class)\s+([A-Z]\w+)/g)
  for (const m of directExports) {
    names.add(m[1])
  }

  return [...names].sort()
}

// ── Measure single component ────────────────────────────────────────

function measureComponent(componentName) {
  const tmp = mkdtempSync(join(tmpdir(), `rig-ts-${componentName}-`))

  try {
    // package.json linking Rig locally
    writeFileSync(
      join(tmp, 'package.json'),
      JSON.stringify({
        name: 'tree-shake-test',
        private: true,
        type: 'module',
        dependencies: {
          '@amulet-laboratories/rig': `file:${ROOT}`,
        },
        devDependencies: {
          vite: '^7.0.0',
          '@vitejs/plugin-vue': '^6.0.0',
          vue: '^3.5.0',
        },
      }),
    )

    // Entry file — import just this one component
    writeFileSync(
      join(tmp, 'index.js'),
      `import { ${componentName} } from '@amulet-laboratories/rig'\nexport { ${componentName} }\n`,
    )

    // Vite config for tree-shaken lib build
    writeFileSync(
      join(tmp, 'vite.config.js'),
      `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './index.js',
      formats: ['es'],
      fileName: 'out',
    },
    outDir: 'dist',
    minify: 'esbuild',
    reportCompressedSize: false,
    rollupOptions: {
      external: ['vue', '@iconify/vue', '@floating-ui/vue'],
    },
  },
})
`,
    )

    // Install + build
    execSync('pnpm install --no-frozen-lockfile 2>/dev/null', {
      cwd: tmp,
      stdio: 'pipe',
      timeout: 60_000,
    })
    execSync('npx vite build 2>/dev/null', {
      cwd: tmp,
      stdio: 'pipe',
      timeout: 30_000,
    })

    // Measure output
    const distDir = join(tmp, 'dist')
    const files = readdirSync(distDir).filter((f) => f.endsWith('.js') || f.endsWith('.mjs'))

    let rawBytes = 0
    let gzipBytes = 0
    for (const file of files) {
      const content = readFileSync(join(distDir, file))
      rawBytes += content.length
      gzipBytes += gzipSync(content).byteLength
    }

    return { rawBytes, gzipBytes }
  } catch {
    return null
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

// ── Main ────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const allComponents = discoverExports()

const targets = args.length > 0
  ? args.filter((a) => allComponents.includes(a))
  : allComponents

console.log(`Tree-shake analysis: ${targets.length} components`)
console.log()

if (!existsSync(HEALTH_DIR)) mkdirSync(HEALTH_DIR, { recursive: true })

// Load existing results if incrementally adding
let existing = {}
if (existsSync(OUTPUT)) {
  try {
    existing = JSON.parse(readFileSync(OUTPUT, 'utf-8')).components || {}
  } catch {
    // Start fresh
  }
}

const results = { ...existing }
let completed = 0

for (const name of targets) {
  completed++
  process.stdout.write(`  [${completed}/${targets.length}] ${name}... `)

  const result = measureComponent(name)
  if (result) {
    results[name] = {
      rawBytes: result.rawBytes,
      gzipBytes: result.gzipBytes,
      rawKb: (result.rawBytes / 1024).toFixed(1),
      gzipKb: (result.gzipBytes / 1024).toFixed(1),
    }
    console.log(`${results[name].gzipKb} KB gzip`)
  } else {
    console.log('FAILED')
  }
}

// Compute summary stats
const sizes = Object.values(results).map((r) => r.gzipBytes)
const summary = {
  totalComponents: Object.keys(results).length,
  avgGzipBytes: sizes.length > 0 ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length) : 0,
  minGzipBytes: sizes.length > 0 ? Math.min(...sizes) : 0,
  maxGzipBytes: sizes.length > 0 ? Math.max(...sizes) : 0,
  medianGzipBytes: sizes.length > 0
    ? sizes.sort((a, b) => a - b)[Math.floor(sizes.length / 2)]
    : 0,
}

const output = {
  generated: new Date().toISOString(),
  summary,
  components: results,
}

writeFileSync(OUTPUT, JSON.stringify(output, null, 2))
console.log()
console.log(`Summary:`)
console.log(`  Components: ${summary.totalComponents}`)
console.log(`  Avg gzip: ${(summary.avgGzipBytes / 1024).toFixed(1)} KB`)
console.log(`  Min gzip: ${(summary.minGzipBytes / 1024).toFixed(1)} KB`)
console.log(`  Max gzip: ${(summary.maxGzipBytes / 1024).toFixed(1)} KB`)
console.log(`  Median gzip: ${(summary.medianGzipBytes / 1024).toFixed(1)} KB`)
console.log(`\n✓ Results saved to .health/tree-shake.json`)
