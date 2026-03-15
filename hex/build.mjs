// Hex build script
// Processes each theme + entrypoint through PostCSS (Tailwind v4 + postcss-import)
// and writes the output to dist/

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
  watch,
} from 'node:fs'
import { resolve } from 'node:path'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import tailwindcss from '@tailwindcss/postcss'
import cssnano from 'cssnano'

const ROOT = resolve(import.meta.dirname)
const SRC = resolve(ROOT, 'src')
const DIST = resolve(ROOT, 'dist')

// Define themes (directory-based, shadcn token contract)
// One CSS per theme — no light/dark variants
const themes = ['hexrig', 'vscode', 'spotify', 'gmail']

const getThemeEntrypoints = (theme) => [
  { input: `src/themes/${theme}/index.css`, output: `dist/${theme}.css` },
]

// Default theme entry (builds hexrig as the root bundle)
const rootEntrypoints = [
  { input: 'src/themes/hexrig/index.css', output: 'dist/hex.css' },
]

async function buildEntry(entry) {
  const inputPath = resolve(ROOT, entry.input)
  const outputPath = resolve(ROOT, entry.output)

  if (!existsSync(inputPath)) {
    console.warn(`  ⚠ Skipping missing file: ${entry.input}`)
    return
  }

  const css = readFileSync(inputPath, 'utf-8')

  try {
    const result = await postcss([postcssImport(), tailwindcss(), cssnano({ preset: 'default' })]).process(css, {
      from: inputPath,
      to: outputPath,
    })

    writeFileSync(outputPath, result.css, 'utf-8')

    if (result.map) {
      writeFileSync(`${outputPath}.map`, result.map.toString(), 'utf-8')
    }

    console.log(`  ✓ ${entry.input} → ${entry.output}`)
  } catch (err) {
    console.error(`  ✗ ${entry.input}: ${err.message}`)
    throw err
  }
}

async function build() {
  // Clean dist before building
  if (existsSync(DIST)) {
    rmSync(DIST, { recursive: true })
  }
  mkdirSync(DIST, { recursive: true })

  console.log('Building Hex themes...')
  const start = Date.now()

  // Collect all entries
  const allEntries = [
    ...rootEntrypoints,
    ...themes.flatMap(getThemeEntrypoints),
  ]

  // Build all entries in parallel
  await Promise.all(allEntries.map(buildEntry))

  console.log(`Done in ${Date.now() - start}ms`)
}

// --watch flag with debounce
if (process.argv.includes('--watch')) {
  await build()
  console.log('\nWatching for changes...')

  let debounceTimer = null
  watch(SRC, { recursive: true }, (event, filename) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      console.log(`\n${filename} changed, rebuilding...`)
      try {
        await build()
      } catch {
        console.error('Build failed, waiting for next change...')
      }
    }, 100)
  })
} else {
  await build()
}
