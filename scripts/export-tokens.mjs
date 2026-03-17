#!/usr/bin/env node

/**
 * export-tokens — Extract design tokens from Hex theme CSS files into JSON.
 *
 * Outputs a JSON file per theme in hex/dist/tokens/ with all CSS custom
 * properties declared in :root. Compatible with Style Dictionary, Figma
 * Token Studio, and other token pipeline tools.
 *
 * Usage:
 *   node scripts/export-tokens.mjs
 *
 * Output:
 *   hex/dist/tokens/hexrig.json
 *   hex/dist/tokens/vscode.json
 *   hex/dist/tokens/garden.json
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const HEX_DIST = resolve(import.meta.dirname, '../hex/dist')
const OUT_DIR = resolve(HEX_DIST, 'tokens')

mkdirSync(OUT_DIR, { recursive: true })

const themes = readdirSync(HEX_DIST)
  .filter((f) => f.endsWith('.css') && f !== 'hex.css')
  .map((f) => f.replace('.css', ''))

for (const theme of themes) {
  const css = readFileSync(resolve(HEX_DIST, `${theme}.css`), 'utf-8')

  // Extract all --property: value declarations
  const tokenRegex = /--([\w-]+)\s*:\s*([^;]+)/g
  const tokens = {}
  let match

  while ((match = tokenRegex.exec(css)) !== null) {
    const name = `--${match[1]}`
    const value = match[2].trim()
    // Skip internal/generated tokens (Tailwind utilities, keyframes, etc.)
    if (name.startsWith('--tw-') || name.startsWith('--animate-')) continue
    // Keep semantic tokens, color tokens, font tokens, radius
    tokens[name] = value
  }

  // Group tokens by prefix for Style Dictionary compatibility
  const grouped = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    $description: `Design tokens for the ${theme} theme`,
    color: {},
    font: {},
    radius: {},
    rig: {},
    other: {},
  }

  for (const [name, value] of Object.entries(tokens)) {
    if (name.startsWith('--color-') || name.startsWith('--')) {
      const clean = name.replace(/^--/, '')
      if (clean.startsWith('color-')) {
        grouped.color[clean.replace('color-', '')] = { $value: value, $type: 'color' }
      } else if (clean.startsWith('font-')) {
        grouped.font[clean.replace('font-', '')] = { $value: value, $type: 'fontFamily' }
      } else if (clean === 'radius') {
        grouped.radius.default = { $value: value, $type: 'dimension' }
      } else if (clean.startsWith('rig-')) {
        grouped.rig[clean.replace('rig-', '')] = { $value: value, $type: 'color' }
      } else {
        grouped.other[clean] = { $value: value }
      }
    }
  }

  const outPath = resolve(OUT_DIR, `${theme}.json`)
  writeFileSync(outPath, `${JSON.stringify(grouped, null, 2)  }\n`)
  console.log(`  Exported ${Object.keys(tokens).length} tokens → ${outPath}`)
}

console.log(`\nDone. Token files ready for Style Dictionary / Figma Token Studio.\n`)
