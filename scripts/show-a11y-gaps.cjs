const { resolve } = require('path')
const m = require(resolve(__dirname, '..', '.health/manifest.json'))
m.components.sort((a, b) => a.score - b.score).forEach(c => {
  const a = c.a11y || {}
  const missing = []
  if (a.hasAriaAttributes !== true) missing.push('aria')
  if (a.hasKeyboardNav !== true) missing.push('keyboard')
  if (a.hasFocusManagement !== true) missing.push('focus')
  if (missing.length > 0)
    console.log(String(c.score).padStart(3) + ' ' + c.name.padEnd(22) + ' a11y-miss: ' + missing.join(', '))
})
