const { resolve } = require('path')
const m = require(resolve(__dirname, '..', '.health/manifest.json'))
const all = [...m.components].sort((a, b) => a.score - b.score)
all.slice(0, 20).forEach(c => {
  const cv = c.coverage ? Math.round(c.coverage.statements) : '?'
  const hex = c.hexCoverage || {}
  const hexN = hex.matchedSelectors ? hex.matchedSelectors.length : 0
  console.log(
    String(c.score).padStart(3) + ' ' + c.grade + ' ' +
    c.name.padEnd(22) +
    ' cov:' + String(cv).padStart(3) +
    ' hex:' + String(hexN).padStart(2) +
    ' story:' + (c.story ? 'Y' : 'N') +
    ' gaps:' + (c.gaps || []).map(g => g.dimension + ':+' + g.impact).join(', '))
})
