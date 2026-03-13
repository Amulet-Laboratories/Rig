#!/usr/bin/env node
/**
 * Fix missing nextTick imports in test files.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')

function walk(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (entry === 'node_modules' || entry === '.git') continue
    const stat = statSync(full)
    if (stat.isDirectory()) results.push(...walk(full))
    else if (entry.endsWith('.test.ts')) results.push(full)
  }
  return results
}

const files = walk(resolve(ROOT, 'packages'))
let fixed = 0

for (const f of files) {
  const content = readFileSync(f, 'utf-8')
  if (!content.includes('nextTick')) continue
  if (content.includes("import { nextTick }")) continue

  const lines = content.split('\n')
  let lastImport = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImport = i
  }
  if (lastImport >= 0) {
    lines.splice(lastImport + 1, 0, "import { nextTick } from 'vue'")
    writeFileSync(f, lines.join('\n'))
    fixed++
    console.log(`  Fixed: ${f.replace(ROOT + '/', '')}`)
  }
}

console.log(`\nDone: ${fixed} files fixed`)
