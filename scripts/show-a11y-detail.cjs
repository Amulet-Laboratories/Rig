#!/usr/bin/env node
const fs = require('fs')
const m = JSON.parse(fs.readFileSync('.health/manifest.json', 'utf-8'))

const gaps = []
let perfect = 0
let totalComps = 0

m.components.forEach((c) => {
  if (c.type === 'composable') return
  totalComps++
  const a = c.a11y || {}
  const axe = c.axeRuntime
  const missing = []
  if (!a.hasAriaAttributes) missing.push('aria')
  if (!a.hasKeyboardNav) missing.push('keyboard')
  if (!a.hasFocusManagement) missing.push('focus')
  if (!axe) missing.push('axe-runtime')
  if (missing.length > 0) {
    gaps.push({ name: c.name, missing, score: c.score })
  } else {
    perfect++
  }
})

gaps.sort((a, b) => a.score - b.score)

console.log(`A11y status: ${perfect}/${totalComps} components at 5/5`)
console.log(`Components with gaps: ${gaps.length}`)
console.log('')

// Group by gap type
const byGap = {}
gaps.forEach((g) => {
  g.missing.forEach((gap) => {
    if (!byGap[gap]) byGap[gap] = []
    byGap[gap].push(g.name)
  })
})

Object.entries(byGap).forEach(([gap, names]) => {
  console.log(`Missing "${gap}" (${names.length}):`)
  names.forEach((n) => console.log(`  ${n}`))
  console.log('')
})

// Show scoring breakdown
console.log('--- A11y scoring formula (20 pts total) ---')
console.log('Source scan (10pts): aria=4, keyboard=3, focus=3')
console.log('Axe runtime (10pts): score/100 * 10')
console.log('Fallback (no axe):   aria=4, keyboard=4, focus=2')
console.log('')
console.log('To get 5/5 (20/20 pts), each component needs:')
console.log('  1. Source: aria + keyboard + focus patterns (10pts)')
console.log('  2. Axe runtime data from comparison benchmarks (10pts)')
console.log('     OR the fallback gives 10pts if all 3 source patterns exist')
