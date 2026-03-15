#!/usr/bin/env node
/* global process */

/**
 * Unified data-collection pipeline.
 *
 * Runs every data source in order and writes all .health/ artefacts:
 *
 *   1. vitest run --coverage --reporter=json   →  .health/tests.json + coverage/
 *   2. generate-health-manifest.mjs             →  .health/manifest.json + history.json
 *
 * Flags:
 *   --quick   Same as default (kept for backwards compat)
 *   --skip-tests   Skip tests (re-generate from existing data)
 *
 * Usage:
 *   node scripts/collect-all.mjs          # full pipeline
 *   node scripts/collect-all.mjs --quick  # tests + manifest only (~8s)
 *   pnpm collect                          # alias for full
 *   pnpm collect:quick                    # alias for quick
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { performance } from 'node:perf_hooks'

const ROOT = resolve(import.meta.dirname, '..')
const HEALTH_DIR = resolve(ROOT, '.health')

const args = process.argv.slice(2)
const quick = args.includes('--quick')
const skipTests = args.includes('--skip-tests')

if (!existsSync(HEALTH_DIR)) mkdirSync(HEALTH_DIR, { recursive: true })

function run(label, cmd) {
  const t0 = performance.now()
  process.stdout.write(`  ${label} ... `)
  try {
    execSync(cmd, { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'], timeout: 120000 })
    const ms = (performance.now() - t0).toFixed(0)
    console.log(`done (${ms}ms)`)
    return true
  } catch (e) {
    // execSync throws on non-zero exit OR if there was stderr output in some
    // edge cases. Check the actual exit code — 0 means success despite warnings.
    if (e.status === 0 || e.status === null) {
      const ms = (performance.now() - t0).toFixed(0)
      console.log(`done (${ms}ms)`)
      return true
    }
    const ms = (performance.now() - t0).toFixed(0)
    console.log(`FAILED (${ms}ms)`)
    if (e.stderr) {
      const stderr = e.stderr.toString().trim().split('\n').slice(-5).join('\n')
      console.error(`    ${stderr.replace(/\n/g, '\n    ')}`)
    }
    return false
  }
}

const t0 = performance.now()
console.log(`\n  Rig data pipeline ${quick ? '(quick)' : '(full)'}`)
console.log(`  ${'─'.repeat(40)}\n`)

// Step 1: Tests + coverage
if (!skipTests) {
  run(
    'Tests + coverage',
    'pnpm vitest run --reporter=json --outputFile=.health/tests.json --coverage',
  )
} else {
  console.log('  Tests + coverage ... skipped')
}

// Step 2: Health manifest
run('Health manifest', 'node scripts/generate-health-manifest.mjs')

const total = ((performance.now() - t0) / 1000).toFixed(1)
console.log(`\n  ${'─'.repeat(40)}`)
console.log(`  Pipeline complete in ${total}s\n`)
