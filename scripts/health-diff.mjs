#!/usr/bin/env node
/**
 * health-diff.mjs — Compare two health manifest snapshots and print a changelog.
 *
 * Usage:
 *   node scripts/health-diff.mjs                      # compare latest 2 history snapshots
 *   node scripts/health-diff.mjs --from=2025-12-01    # compare specific date to latest
 *   node scripts/health-diff.mjs --json                # output as JSON instead of text
 *
 * Reads .health/history.json and .health/manifest.json.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const HEALTH_DIR = resolve(ROOT, '.health')
const HISTORY_PATH = resolve(HEALTH_DIR, 'history.json')
const MANIFEST_PATH = resolve(HEALTH_DIR, 'manifest.json')

// ── CLI ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const fromArg = args.find((a) => a.startsWith('--from='))?.split('=')[1] ?? null
const jsonOutput = args.includes('--json')

// ── Load data ───────────────────────────────────────────────────────

if (!existsSync(HISTORY_PATH)) {
  console.error('No history.json found. Run pnpm health first.')
  process.exit(1)
}

const history = JSON.parse(readFileSync(HISTORY_PATH, 'utf-8'))
const snapshots = history.snapshots

if (snapshots.length < 2 && !fromArg) {
  console.error('Need at least 2 snapshots to diff. Run pnpm health twice.')
  process.exit(1)
}

// Determine "before" and "after" snapshots
let before, after

if (fromArg) {
  // Find the snapshot closest to the requested date
  const targetDate = new Date(fromArg).getTime()
  let closest = snapshots[0]
  let closestDist = Infinity
  for (const s of snapshots) {
    const dist = Math.abs(new Date(s.timestamp).getTime() - targetDate)
    if (dist < closestDist) {
      closest = s
      closestDist = dist
    }
  }
  before = closest
  after = snapshots[snapshots.length - 1]
} else {
  before = snapshots[snapshots.length - 2]
  after = snapshots[snapshots.length - 1]
}

// ── Compare ─────────────────────────────────────────────────────────

function delta(a, b) {
  const d = b - a
  if (d === 0) return null
  return { from: a, to: b, delta: d, direction: d > 0 ? 'up' : 'down' }
}

function sign(n) {
  return n > 0 ? `+${n}` : `${n}`
}

const diff = {
  period: {
    from: before.timestamp,
    to: after.timestamp,
  },
  averageScore: delta(before.averageScore, after.averageScore),
  totalTests: delta(before.totalTests, after.totalTests),
  totalPassed: delta(before.totalPassed, after.totalPassed),
  totalFailed: delta(before.totalFailed, after.totalFailed),
  totalComponents: delta(before.totalComponents, after.totalComponents),
  totalComposables: delta(before.totalComposables, after.totalComposables),
  totalLoc: delta(before.totalLoc, after.totalLoc),
  overallCoverage: delta(
    typeof before.overallCoverage === 'object' ? before.overallCoverage?.statements : before.overallCoverage,
    typeof after.overallCoverage === 'object' ? after.overallCoverage?.statements : after.overallCoverage,
  ),
  totalGaps: delta(before.totalGaps, after.totalGaps),
  gradeDistribution: {},
  componentChanges: [],
}

// Grade distribution changes
for (const grade of ['A', 'B', 'C', 'D', 'F']) {
  const d = delta(
    before.gradeDistribution?.[grade] ?? 0,
    after.gradeDistribution?.[grade] ?? 0,
  )
  if (d) diff.gradeDistribution[grade] = d
}

// Per-component score changes
if (before.componentScores && after.componentScores) {
  const allNames = new Set([
    ...Object.keys(before.componentScores),
    ...Object.keys(after.componentScores),
  ])

  for (const name of allNames) {
    const bScore = before.componentScores[name]
    const aScore = after.componentScores[name]

    if (bScore == null && aScore != null) {
      diff.componentChanges.push({ name, type: 'added', score: aScore })
    } else if (bScore != null && aScore == null) {
      diff.componentChanges.push({ name, type: 'removed', score: bScore })
    } else if (bScore != null && aScore != null && bScore !== aScore) {
      diff.componentChanges.push({
        name,
        type: 'changed',
        from: bScore,
        to: aScore,
        delta: aScore - bScore,
      })
    }
  }

  diff.componentChanges.sort((a, b) => {
    // Added first, then biggest improvements, then regressions
    if (a.type === 'added' && b.type !== 'added') return -1
    if (b.type === 'added' && a.type !== 'added') return 1
    if (a.type === 'removed' && b.type !== 'removed') return 1
    if (b.type === 'removed' && a.type !== 'removed') return -1
    return (b.delta ?? 0) - (a.delta ?? 0)
  })
}

// ── Output ──────────────────────────────────────────────────────────

if (jsonOutput) {
  console.log(JSON.stringify(diff, null, 2))
  process.exit(0)
}

// Text output
const fromDate = new Date(diff.period.from).toLocaleDateString()
const toDate = new Date(diff.period.to).toLocaleDateString()

console.log()
console.log('Health Diff')
console.log(`${fromDate} -> ${toDate}`)
console.log('='.repeat(50))
console.log()

// Summary metrics
const metrics = [
  ['Average Score', diff.averageScore],
  ['Total Tests', diff.totalTests],
  ['Tests Passed', diff.totalPassed],
  ['Tests Failed', diff.totalFailed],
  ['Components', diff.totalComponents],
  ['Composables', diff.totalComposables],
  ['Total LOC', diff.totalLoc],
  ['Coverage', diff.overallCoverage],
  ['Open Gaps', diff.totalGaps],
]

let hasChanges = false
for (const [label, d] of metrics) {
  if (d) {
    hasChanges = true
    const arrow = d.direction === 'up' ? '^' : 'v'
    const prefix = label === 'Tests Failed' || label === 'Open Gaps'
      ? (d.direction === 'down' ? '  +' : '  -')  // Fewer failures = good
      : (d.direction === 'up' ? '  +' : '  -')     // Higher score = good
    console.log(`${prefix} ${label}: ${d.from} -> ${d.to} (${sign(d.delta)})`)
  }
}

if (!hasChanges) {
  console.log('  No metric changes detected.')
}

// Grade changes
const gradeChanges = Object.entries(diff.gradeDistribution)
if (gradeChanges.length > 0) {
  console.log()
  console.log('Grade Distribution:')
  for (const [grade, d] of gradeChanges) {
    console.log(`  ${grade}: ${d.from} -> ${d.to} (${sign(d.delta)})`)
  }
}

// Component changes
if (diff.componentChanges.length > 0) {
  console.log()
  console.log('Component Changes:')

  const added = diff.componentChanges.filter((c) => c.type === 'added')
  const removed = diff.componentChanges.filter((c) => c.type === 'removed')
  const improved = diff.componentChanges.filter((c) => c.type === 'changed' && c.delta > 0)
  const regressed = diff.componentChanges.filter((c) => c.type === 'changed' && c.delta < 0)

  if (added.length > 0) {
    console.log(`  Added (${added.length}):`)
    for (const c of added) console.log(`    + ${c.name} (${c.score})`)
  }

  if (improved.length > 0) {
    console.log(`  Improved (${improved.length}):`)
    for (const c of improved) console.log(`    ^ ${c.name}: ${c.from} -> ${c.to} (${sign(c.delta)})`)
  }

  if (regressed.length > 0) {
    console.log(`  Regressed (${regressed.length}):`)
    for (const c of regressed) console.log(`    v ${c.name}: ${c.from} -> ${c.to} (${sign(c.delta)})`)
  }

  if (removed.length > 0) {
    console.log(`  Removed (${removed.length}):`)
    for (const c of removed) console.log(`    - ${c.name} (was ${c.score})`)
  }
} else {
  console.log()
  console.log('No per-component changes.')
}

console.log()
