/* eslint-disable no-console */
/**
 * Validate that every .vue component is exported from its package barrel.
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

// 1. Build a map of what each package actually exports
const exportMap = {}
for (const pkg of packages) {
  const indexPath = join(ROOT, 'packages', pkg, 'src', 'index.ts')
  if (existsSync(indexPath)) {
    const content = readFileSync(indexPath, 'utf-8')
    // Match: export { default as Foo } and export { Foo }
    const defaults = [...content.matchAll(/default as (\w+)/g)].map((m) => m[1])
    const named = [...content.matchAll(/export \{ (\w+)(?:,\s*(\w+))*/g)].flatMap((m) =>
      [m[1], m[2]].filter(Boolean),
    )
    // Also check re-exports from sub-barrels like primitives
    const allExports = new Set([...defaults, ...named])

    // For core, also scan primitives/index.ts
    if (pkg === 'core') {
      const primPath = join(ROOT, 'packages/core/src/primitives/index.ts')
      if (existsSync(primPath)) {
        const primContent = readFileSync(primPath, 'utf-8')
        for (const m of primContent.matchAll(/default as (\w+)/g)) {
          allExports.add(m[1])
        }
      }
    }
    exportMap[pkg] = allExports
  }
}

// 2. Check for .vue files that exist but aren't exported
const unexported = []
for (const pkg of packages) {
  const srcDir = join(ROOT, 'packages', pkg, 'src')
  const exports = exportMap[pkg] || new Set()

  // Top-level .vue files
  if (existsSync(srcDir)) {
    const files = readdirSync(srcDir).filter((f) => f.endsWith('.vue'))
    for (const f of files) {
      const name = basename(f, '.vue')
      if (!exports.has(name)) {
        unexported.push({ name, pkg, file: `packages/${pkg}/src/${f}` })
      }
    }
  }

  // For core, check primitives/
  if (pkg === 'core') {
    const primDir = join(ROOT, 'packages/core/src/primitives')
    if (existsSync(primDir)) {
      const files = readdirSync(primDir).filter((f) => f.endsWith('.vue'))
      for (const f of files) {
        const name = basename(f, '.vue')
        if (!exports.has(name)) {
          unexported.push({ name, pkg, file: `packages/core/src/primitives/${f}` })
        }
      }
    }
  }
}

// Report
if (unexported.length === 0) {
  console.log('✓ All .vue files are exported from their package barrels')
} else {
  if (unexported.length > 0) {
    console.log(`\n✗ Vue files not exported from package barrel (${unexported.length}):`)
    for (const { name, pkg, file } of unexported) {
      console.log(`  ${name} (${pkg}) — ${file}`)
    }
  }
  process.exit(1)
}
