#!/usr/bin/env node

/**
 * Dev watcher — re-collects health data when source/test files change.
 *
 * Watches packages/\*\/src/\*\* and stories/ for changes.
 * On change (debounced 2s), runs the quick pipeline:
 *   vitest run → generate-health-manifest.mjs
 *
 * The Lab dev server picks up .health/*.json changes via Vite file watching
 * and triggers HMR automatically.
 *
 * Started automatically by `pnpm dev`.
 */

import { watch } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const DEBOUNCE_MS = 2000
const COOL_DOWN_MS = 5000

let timer = null
let running = false
let lastRun = 0
let pendingWhileRunning = false

const WATCH_DIRS = [
  resolve(ROOT, 'packages'),
  resolve(ROOT, 'stories'),
]

function collect() {
  if (running) {
    pendingWhileRunning = true
    return
  }

  const now = Date.now()
  if (now - lastRun < COOL_DOWN_MS) return

  running = true
  lastRun = now
  const t0 = Date.now()

  console.log('\x1b[33m[watch]\x1b[0m Changes detected, collecting data...')

  try {
    execSync(
      'pnpm vitest run --reporter=json --outputFile=.health/tests.json --coverage 2>/dev/null',
      { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'], timeout: 60000 },
    )
    console.log('\x1b[33m[watch]\x1b[0m   Tests + coverage done')
  } catch {
    console.log('\x1b[31m[watch]\x1b[0m   Tests failed (manifest will use stale data)')
  }

  try {
    execSync('node scripts/generate-health-manifest.mjs', {
      cwd: ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15000,
    })
    console.log('\x1b[33m[watch]\x1b[0m   Health manifest updated')
  } catch {
    console.log('\x1b[31m[watch]\x1b[0m   Manifest generation failed')
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  console.log(`\x1b[33m[watch]\x1b[0m   Done in ${elapsed}s — Lab will refresh`)

  running = false

  if (pendingWhileRunning) {
    pendingWhileRunning = false
    scheduleCollect()
  }
}

function scheduleCollect() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(collect, DEBOUNCE_MS)
}

// Watch for changes
for (const dir of WATCH_DIRS) {
  try {
    watch(dir, { recursive: true }, (_event, filename) => {
      if (!filename) return
      const f = String(filename)
      // Only react to source + test + story files
      if (f.endsWith('.ts') || f.endsWith('.vue') || f.endsWith('.css')) {
        scheduleCollect()
      }
    })
  } catch {
    console.log(`\x1b[31m[watch]\x1b[0m Could not watch ${dir}`)
  }
}

console.log('\x1b[33m[watch]\x1b[0m Watching packages/ and stories/ for changes')
console.log('\x1b[33m[watch]\x1b[0m Running initial data collection...\n')

// Initial collection on startup
collect()
