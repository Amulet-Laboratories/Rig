#!/usr/bin/env node
/**
 * Auto-generate .bench.ts files for components/composables that lack them.
 * Only creates files that don't already exist.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, basename, dirname, relative } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(readFileSync(resolve(ROOT, '.health/manifest.json'), 'utf-8'))

let created = 0
let skipped = 0

for (const comp of manifest.components) {
  const benchPath = resolve(ROOT, comp.source.replace(/\.(vue|ts)$/, '.bench.ts'))
  if (existsSync(benchPath)) {
    skipped++
    continue
  }

  const name = comp.name
  const isComposable = comp.type === 'composable'
  const ext = comp.source.endsWith('.vue') ? '.vue' : '.ts'

  let content
  if (isComposable) {
    content = generateComposableBench(name, ext)
  } else {
    // Read source to detect required props
    const source = readFileSync(resolve(ROOT, comp.source), 'utf-8')
    content = generateComponentBench(name, ext, source)
  }

  writeFileSync(benchPath, content, 'utf-8')
  created++
  console.log(`  Created ${relative(ROOT, benchPath)}`)
}

console.log(`\nDone: ${created} created, ${skipped} skipped (already exist)`)

// ── Generators ─────────────────────────────────────────────────────────

function generateComposableBench(name, ext) {
  return `import { describe, bench } from 'vitest'
import { ${name} } from './${name}'

describe('${name}', () => {
  bench('invoke ${name}', () => {
    ${name}()
  })
})
`
}

function generateComponentBench(name, ext, source) {
  // Detect required props by looking for defineProps patterns without defaults
  const propsBlock = extractRequiredProps(source)

  const propsArg = propsBlock ? `, { props: ${propsBlock} }` : ''

  return `import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ${name} from './${name}${ext}'

describe('${name} mount', () => {
  bench('default mount', () => {
    const w = mount(${name}${propsArg})
    w.unmount()
  })
})
`
}

function extractRequiredProps(source) {
  // Check for common required prop patterns
  const props = []

  // Match items/actions arrays
  if (/\bitems\b.*\bAction\[\]|\bitems\b.*\bTabItem\[\]|\bitems\b.*\bstring\[\]/.test(source)) {
    props.push('items: []')
  }
  if (/\bactions\b.*\bAction\[\]/.test(source)) {
    props.push('actions: []')
  }
  if (/\bshortcut\b.*\bstring\b/.test(source) && !source.includes('shortcut?')) {
    props.push("shortcut: 'Ctrl+S'")
  }
  if (/\bariaLabel\b.*\bstring\b/.test(source) && !source.includes('ariaLabel?')) {
    props.push("ariaLabel: 'Test'")
  }
  if (/\bmodelValue\b.*\bstring\b/.test(source) && !source.includes('modelValue?')) {
    props.push("modelValue: ''")
  }
  if (/\bicon\b.*\bstring\b/.test(source) && !source.includes('icon?')) {
    props.push("icon: 'test'")
  }

  if (props.length === 0) return null
  return `{ ${props.join(', ')} }`
}
