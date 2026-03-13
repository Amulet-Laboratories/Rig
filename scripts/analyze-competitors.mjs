#!/usr/bin/env node
/**
 * Static Analysis: Competitor Package Metrics
 *
 * Measures without rendering:
 *  - Install size (node_modules footprint)
 *  - Dependency count (direct + transitive)
 *  - TypeScript type quality
 *  - Package version
 *
 * Outputs: .health/static-analysis.json
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

// This script lives in Rig/scripts/, so import.meta.dirname is Rig/scripts/
const RIG_ROOT = resolve(import.meta.dirname, '..')
const LAB_ROOT = resolve(RIG_ROOT, 'lab')
const NODE_MODULES = resolve(LAB_ROOT, 'node_modules')
const HEALTH_DIR = resolve(RIG_ROOT, '.health')

const PACKAGES = [
  { key: 'rig', name: '@amulet-laboratories/rig', paths: ['../packages'], isLocal: true },
  { key: 'radix', name: 'radix-vue', paths: ['radix-vue'] },
  { key: 'hui', name: '@headlessui/vue', paths: ['@headlessui/vue'] },
  { key: 'ant', name: 'ant-design-vue', paths: ['ant-design-vue'] },
  { key: 'fwb', name: 'flowbite-vue', paths: ['flowbite-vue'] },
  { key: 'mui', name: '@mui/material', paths: ['@mui/material'] },
  { key: 'chakra', name: '@chakra-ui/react', paths: ['@chakra-ui/react'] },
  { key: 'mantine', name: '@mantine/core', paths: ['@mantine/core'] },
]

function dirSize(dir) {
  let total = 0
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        total += dirSize(full)
      } else {
        try { total += statSync(full).size } catch { /* skip */ }
      }
    }
  } catch { /* skip */ }
  return total
}

function readPkgJson(pkgPath) {
  try {
    return JSON.parse(readFileSync(join(pkgPath, 'package.json'), 'utf8'))
  } catch {
    return null
  }
}

function countDeps(pkg) {
  if (!pkg) return { direct: 0, peer: 0 }
  return {
    direct: Object.keys(pkg.dependencies ?? {}).length,
    peer: Object.keys(pkg.peerDependencies ?? {}).length,
  }
}

function hasTypes(pkgPath) {
  const pkg = readPkgJson(pkgPath)
  if (!pkg) return false
  // Check for types/typings field or .d.ts files
  if (pkg.types || pkg.typings) return true
  if (pkg.exports) {
    const str = JSON.stringify(pkg.exports)
    if (str.includes('.d.ts') || str.includes('types')) return true
  }
  // Check for index.d.ts
  try { statSync(join(pkgPath, 'dist', 'index.d.ts')); return true } catch {}
  try { statSync(join(pkgPath, 'index.d.ts')); return true } catch {}
  return false
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

console.log('Analyzing competitor packages...\n')

const results = []

for (const pkg of PACKAGES) {
  let pkgPath
  let installSize = 0
  let pkgJson = null

  if (pkg.isLocal) {
    // Rig is local, measure package source dirs
    const packagesDir = resolve(RIG_ROOT, 'packages')
    installSize = dirSize(packagesDir)
    // Use root package.json
    pkgJson = readPkgJson(RIG_ROOT)
    pkgPath = RIG_ROOT
  } else {
    pkgPath = resolve(NODE_MODULES, ...pkg.paths)
    installSize = dirSize(pkgPath)
    pkgJson = readPkgJson(pkgPath)
  }

  const deps = countDeps(pkgJson)
  const hasTs = pkg.isLocal ? true : hasTypes(pkgPath)
  const version = pkgJson?.version ?? 'unknown'

  // Count exported components (heuristic)
  let exportCount = 0
  if (pkg.isLocal) {
    // Count .vue files in packages
    const packagesDir = resolve(LAB_ROOT, '..', 'packages')
    try {
      const pkgDirs = readdirSync(packagesDir, { withFileTypes: true }).filter(d => d.isDirectory())
      for (const dir of pkgDirs) {
        const srcDir = join(packagesDir, dir.name, 'src')
        try {
          const files = readdirSync(srcDir, { recursive: true })
          exportCount += files.filter(f => String(f).endsWith('.vue')).length
        } catch {}
      }
    } catch {}
  } else {
    // Count from multiple possible layout patterns
    const searchDirs = [
      // PascalCase dirs in dist/ (radix-vue)
      { dir: join(pkgPath, 'dist'), filter: e => e.isDirectory() && /^[A-Z]/.test(e.name) },
      // PascalCase dirs in es/ (some libs) or lowercase dirs (ant-design-vue)
      { dir: join(pkgPath, 'es'), filter: e => e.isDirectory() && /^[A-Za-z]/.test(e.name) && !e.name.startsWith('_') },
      // lowercase dirs in dist/components/ (headlessui)
      { dir: join(pkgPath, 'dist', 'components'), filter: e => e.isDirectory() },
      // PascalCase dirs at package root (MUI)
      { dir: pkgPath, filter: e => e.isDirectory() && /^[A-Z]/.test(e.name) },
      // PascalCase dirs in esm/components/ (mantine)
      { dir: join(pkgPath, 'esm', 'components'), filter: e => e.isDirectory() && /^[A-Z]/.test(e.name) },
      // dirs in dist/esm/components/ (chakra)
      { dir: join(pkgPath, 'dist', 'esm', 'components'), filter: e => e.isDirectory() },
      // dirs in src/components/
      { dir: join(pkgPath, 'src', 'components'), filter: e => e.isDirectory() && /^[A-Z]/.test(e.name) },
    ]
    for (const { dir, filter } of searchDirs) {
      try {
        const entries = readdirSync(dir, { withFileTypes: true })
        const count = entries.filter(filter).length
        if (count > exportCount) exportCount = count
      } catch {}
    }
  }

  const entry = {
    key: pkg.key,
    name: pkg.name,
    version,
    installSizeBytes: installSize,
    installSizeFormatted: formatBytes(installSize),
    directDeps: deps.direct,
    peerDeps: deps.peer,
    hasTypeScript: hasTs,
    estimatedComponents: exportCount,
    isVueNative: ['rig', 'radix', 'hui', 'ant', 'fwb'].includes(pkg.key),
    framework: ['mui', 'chakra', 'mantine'].includes(pkg.key) ? 'react' : 'vue',
  }

  results.push(entry)
  console.log(`  ${pkg.name.padEnd(25)} ${formatBytes(installSize).padStart(8)}  ${deps.direct} deps  ${exportCount} components  ${hasTs ? 'TS' : 'no-TS'}  v${version}`)
}

// Write output
if (!existsSync(HEALTH_DIR)) mkdirSync(HEALTH_DIR, { recursive: true })
const output = {
  timestamp: new Date().toISOString(),
  packages: results,
}
writeFileSync(resolve(HEALTH_DIR, 'static-analysis.json'), JSON.stringify(output, null, 2))
console.log(`\nWritten to .health/static-analysis.json`)
