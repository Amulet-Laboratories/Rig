/**
 * Validate that every .vue component and public .ts composable is exported
 * from its package barrel.
 * Run with: node scripts/check-exports.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import process from 'node:process'
import { join, basename } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

const packages = [
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

/** Extract all exported names from an index.ts content string. */
function extractExports(content) {
  const names = new Set()

  // export { default as Foo }
  for (const m of content.matchAll(/default as (\w+)/g)) {
    names.add(m[1])
  }

  // export { A, B, C } — capture everything inside the braces
  for (const m of content.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of m[1].split(',')) {
      // Handle "Foo as Bar" — the public name is the last word
      const words = part.trim().split(/\s+/)
      const name = words[words.length - 1]
      if (name && /^\w+$/.test(name)) names.add(name)
    }
  }

  return names
}

/** Extract all source file stems referenced by export-from statements. */
function extractExportSources(content) {
  const sources = new Set()
  for (const m of content.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g)) {
    sources.add(m[1])
  }
  return sources
}

// 1. Build a map of what each package actually exports
const exportMap = {}
const sourceMap = {}
for (const pkg of packages) {
  const indexPath = join(ROOT, 'packages', pkg, 'src', 'index.ts')
  if (existsSync(indexPath)) {
    const content = readFileSync(indexPath, 'utf-8')
    const allExports = extractExports(content)
    const allSources = extractExportSources(content)

    // For core, also scan primitives/index.ts
    if (pkg === 'core') {
      const primPath = join(ROOT, 'packages/core/src/primitives/index.ts')
      if (existsSync(primPath)) {
        const primContent = readFileSync(primPath, 'utf-8')
        for (const name of extractExports(primContent)) {
          allExports.add(name)
        }
        for (const src of extractExportSources(primContent)) {
          allSources.add(src)
        }
      }
      // Also scan composables/index.ts
      const composPath = join(ROOT, 'packages/core/src/composables/index.ts')
      if (existsSync(composPath)) {
        const composContent = readFileSync(composPath, 'utf-8')
        for (const name of extractExports(composContent)) {
          allExports.add(name)
        }
        for (const src of extractExportSources(composContent)) {
          allSources.add(src)
        }
      }
    }
    exportMap[pkg] = allExports
    sourceMap[pkg] = allSources
  }
}

// 2. Check for .vue and .ts files that exist but aren't exported
const unexported = []

for (const pkg of packages) {
  const srcDir = join(ROOT, 'packages', pkg, 'src')
  const exports = exportMap[pkg] || new Set()
  const sources = sourceMap[pkg] || new Set()

  if (!existsSync(srcDir)) continue

  // Top-level .vue files
  const vueFiles = readdirSync(srcDir).filter(
    (f) => f.endsWith('.vue') && !f.endsWith('.story.vue'),
  )
  for (const f of vueFiles) {
    const name = basename(f, '.vue')
    if (!exports.has(name) && !sources.has(name)) {
      unexported.push({ name, pkg, file: `packages/${pkg}/src/${f}` })
    }
  }

  // For core, check primitives/
  if (pkg === 'core') {
    const primDir = join(ROOT, 'packages/core/src/primitives')
    if (existsSync(primDir)) {
      const files = readdirSync(primDir).filter(
        (f) => f.endsWith('.vue') && !f.endsWith('.story.vue'),
      )
      for (const f of files) {
        const name = basename(f, '.vue')
        if (!exports.has(name) && !sources.has(name)) {
          unexported.push({ name, pkg, file: `packages/core/src/primitives/${f}` })
        }
      }
    }

    // Check composables/ .ts files
    const composDir = join(ROOT, 'packages/core/src/composables')
    if (existsSync(composDir)) {
      const files = readdirSync(composDir).filter(
        (f) =>
          f.endsWith('.ts') &&
          !f.endsWith('.test.ts') &&
          !f.endsWith('.bench.ts') &&
          f !== 'index.ts',
      )
      for (const f of files) {
        const name = basename(f, '.ts') // e.g. "useKeyboard"
        if (!exports.has(name) && !sources.has(name)) {
          unexported.push({ name, pkg, file: `packages/core/src/composables/${f}` })
        }
      }
    }
  }

  // For extras, check top-level .ts composable files
  if (pkg === 'extras') {
    const tsFiles = readdirSync(srcDir).filter(
      (f) =>
        f.endsWith('.ts') &&
        !f.endsWith('.test.ts') &&
        !f.endsWith('.bench.ts') &&
        f !== 'index.ts',
    )
    for (const f of tsFiles) {
      const name = basename(f, '.ts')
      if (!exports.has(name) && !sources.has(name)) {
        unexported.push({ name, pkg, file: `packages/${pkg}/src/${f}` })
      }
    }
  }
}

// Report
if (unexported.length === 0) {
  console.log('✓ All components and composables are exported from their package barrels')
} else {
  console.log(`\n✗ Files not exported from package barrel (${unexported.length}):`)
  for (const { name, pkg, file } of unexported) {
    console.log(`  ${name} (${pkg}) — ${file}`)
  }
  process.exit(1)
}
