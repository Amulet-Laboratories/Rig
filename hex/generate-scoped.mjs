// Hex — Scoped Theme Generator
// Reads each theme's tokens.css and generates scoped versions where
// :root {} is replaced with [data-hex-theme="name"] {}
// Also generates a combined scoped.css entry point.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname)
const SRC = resolve(ROOT, 'src')
const SCOPED_DIR = resolve(SRC, 'scoped/themes')

// Demo site themes that need scoped variants
const SCOPED_THEMES = [
  'aldricpace',
  'briarcove',
  'briarcovelib',
  'compass',
  'duskline',
  'kbcv',
  'lanternhouse',
  'marenlys',
  'saltsignal',
  'tidemark',
  'undertow',
]

function extractProperties(block) {
  // Extract CSS property declarations from a { ... } block body
  const props = []
  for (const line of block.split('\n')) {
    const trimmed = line.trim()
    // Match CSS custom property declarations: --name: value;
    if (trimmed.startsWith('--') && trimmed.includes(':')) {
      props.push(trimmed)
    }
  }
  return props
}

function scopeTokens(css, themeName) {
  const allProps = []

  // Extract properties from @theme blocks (--color-*, --font-*, --radius)
  const themeBlockRe = /@theme\s*\{([^}]*)\}/gs
  let match
  while ((match = themeBlockRe.exec(css)) !== null) {
    allProps.push(...extractProperties(match[1]))
  }

  // Extract properties from :root blocks (--background, --primary, --ap-*, --rig-*, etc.)
  const rootBlockRe = /:root\s*\{([^}]*)\}/gs
  while ((match = rootBlockRe.exec(css)) !== null) {
    allProps.push(...extractProperties(match[1]))
  }

  // Deduplicate — later values win (same key)
  const seen = new Map()
  for (const prop of allProps) {
    const colonIdx = prop.indexOf(':')
    const key = prop.substring(0, colonIdx).trim()
    seen.set(key, prop)
  }

  // Preserve the comment header (everything before the first @theme { or :root {)
  // Use regex to match actual block starts, not mentions in comments
  const themeStart = css.search(/@theme\s*\{/)
  const rootStart = css.search(/:root\s*\{/)
  const headerEnd = Math.min(
    themeStart >= 0 ? themeStart : Infinity,
    rootStart >= 0 ? rootStart : Infinity,
  )
  const header = headerEnd < Infinity ? css.substring(0, headerEnd).trim() : ''

  // Build scoped output
  const indent = '  '
  const body = [...seen.values()].map((p) => `${indent}${p}`).join('\n')

  return `${header}\n\n[data-hex-theme="${themeName}"] {\n${body}\n}`
}

function generate() {
  if (!existsSync(SCOPED_DIR)) {
    mkdirSync(SCOPED_DIR, { recursive: true })
  }

  console.log('Generating scoped theme tokens...')

  for (const theme of SCOPED_THEMES) {
    const tokensPath = resolve(SRC, `themes/${theme}/tokens.css`)

    if (!existsSync(tokensPath)) {
      console.warn(`  ⚠ Skipping ${theme}: tokens.css not found`)
      continue
    }

    const css = readFileSync(tokensPath, 'utf-8')
    const scoped = scopeTokens(css, theme)
    const outPath = resolve(SCOPED_DIR, `${theme}.css`)

    writeFileSync(outPath, `/* Hex — ${theme} (scoped) */\n\n${scoped}\n`)
    console.log(`  ✓ ${theme}`)
  }

  // Generate the combined entry point (standalone build — includes Tailwind)
  const entryLines = [
    "@import 'tailwindcss';",
    '',
    '/* Hex — Scoped Theme Bundle',
    ' * All demo site themes scoped to [data-hex-theme="name"] containers.',
    ' * For standalone use (Hex build). Vite projects should import individual',
    ' * scoped theme files instead.',
    ' */',
    '',
    "/* Universal token bridge — maps Tailwind utilities to CSS custom properties */",
    "@import './bridge.css';",
    '',
    "/* References for @apply resolution */",
    "@reference 'tailwindcss';",
    "@reference './bridge.css';",
    '',
    '/* Rig component token defaults */',
    "@import '../shared/rig-defaults.css';",
    '',
    '/* Component styles (shared across all themes) */',
    "@import '../shared/components/core.css';",
    "@import '../shared/components/layout.css';",
    "@import '../shared/components/nav.css';",
    "@import '../shared/components/editor.css';",
    "@import '../shared/components/lists.css';",
    "@import '../shared/components/menus.css';",
    "@import '../shared/components/extras.css';",
    "@import '../shared/components/shell.css';",
    "@import '../shared/components/data.css';",
    "@import '../shared/components/spatial.css';",
    "@import '../shared/components/temporal.css';",
    "@import '../shared/components/web.css';",
    "@import '../shared/a11y.css';",
    '',
    '/* Scoped theme tokens */',
    ...SCOPED_THEMES.map((t) => `@import './themes/${t}.css';`),
    '',
  ]

  const entryPath = resolve(SRC, 'scoped/index.css')
  writeFileSync(entryPath, entryLines.join('\n'))
  console.log(`  ✓ scoped/index.css`)

  console.log('Done.')
}

generate()
