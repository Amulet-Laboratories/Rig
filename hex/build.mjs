// Hex build script
// Processes each theme + entrypoint through PostCSS (Tailwind v4 + postcss-import)
// and writes the output to dist/

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, watch } from 'node:fs'
import { resolve, dirname } from 'node:path'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import tailwindcss from '@tailwindcss/postcss'
import cssnano from 'cssnano'

const ROOT = resolve(import.meta.dirname)
const SRC = resolve(ROOT, 'src')
const DIST = resolve(ROOT, 'dist')

// Define themes (directory-based, shadcn token contract)
// One CSS per theme — no light/dark variants
const themes = [
  'cobalt',
  'garden',
  'spacewizard',
  'greyline',
  'cypress',
  'iris',
  'lagoon',
  'ochre',
  'orchid',
  'vesper',
  'harbor',
  'copper',
  'cardinal',
  'clover',
  'sienna',
  'hearth',
  'juniper',
  'forge',
  'citron',
  'voltaic',
  'quartz',
  'fern',
  'roast',
  'damson',
  'brass',
  'slate',
  'beacon',
]

// Eras — the Museum of User Interfaces. Structurally different from the palette
// themes above: they carry material tokens (bevels, texture, density, motion)
// and are scoped to [data-hex-era] rather than applied globally, so several
// periods can render on one page. See docs/MUSEUM-ROADMAP.md.
const eras = [
  'cupertino84',
  'cube91',
  'terminal93',
  'redmond95',
  'bondi01',
  'glass07',
  'flat13',
  'soft25',
]

const getThemeEntrypoints = (theme) => [
  { input: `src/themes/${theme}/index.css`, output: `dist/${theme}.css` },
]

const getEraEntrypoints = (era) => [
  { input: `src/eras/${era}/index.css`, output: `dist/eras/${era}.css` },
]

// Default theme entry (builds cobalt as the root bundle)
const rootEntrypoints = [
  { input: 'src/themes/cobalt/index.css', output: 'dist/hex.css' },
  { input: 'src/scoped/index.css', output: 'dist/scoped.css' },
  // Every era in one file — what the museum loads.
  { input: 'src/eras/index.css', output: 'dist/eras.css' },
]

async function buildEntry(entry) {
  const inputPath = resolve(ROOT, entry.input)
  const outputPath = resolve(ROOT, entry.output)

  if (!existsSync(inputPath)) {
    console.warn(`  ⚠ Skipping missing file: ${entry.input}`)
    return
  }

  const css = readFileSync(inputPath, 'utf-8')

  // Entries may nest (dist/eras/*.css), so ensure the target directory exists.
  mkdirSync(dirname(outputPath), { recursive: true })

  try {
    const result = await postcss([
      postcssImport(),
      tailwindcss(),
      cssnano({ preset: 'default' }),
    ]).process(css, {
      from: inputPath,
      to: outputPath,
      map: false,
    })

    writeFileSync(outputPath, result.css, 'utf-8')

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
    ...eras.flatMap(getEraEntrypoints),
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
