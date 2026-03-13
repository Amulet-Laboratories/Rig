#!/usr/bin/env node
// Compute exactly how many a11y points each component actually earns
const fs = require('fs')
const m = JSON.parse(fs.readFileSync('.health/manifest.json', 'utf-8'))

let under20 = 0

m.components.forEach((c) => {
  if (c.type === 'composable') return
  let pts = 0
  const a = c.a11y || {}

  // Source scan (10pts)
  if (a.hasAriaAttributes) pts += 4
  if (a.hasKeyboardNav) pts += 3
  if (a.hasFocusManagement) pts += 3

  // Runtime or fallback (10pts)
  if (c.axeRuntime) {
    pts += Math.round((c.axeRuntime.score / 100) * 10)
  } else if (c.a11y) {
    if (a.hasAriaAttributes) pts += 4
    if (a.hasKeyboardNav) pts += 4
    if (a.hasFocusManagement) pts += 2
  }

  if (pts < 20) {
    under20++
    console.log(`${pts}/20  ${c.name}  aria=${a.hasAriaAttributes} kb=${a.hasKeyboardNav} focus=${a.hasFocusManagement} axe=${!!c.axeRuntime}`)
  }
})

if (under20 === 0) {
  console.log('All components earn 20/20 a11y points.')
} else {
  console.log(`\n${under20} component(s) under 20/20`)
}
