#!/usr/bin/env node
/**
 * rig build-theme — compile a site's design-system bundle to public/theme.css.
 *
 *   theme.css  =  hex/<theme>        (skin: Tailwind preflight + theme tokens)
 *              +  hex/shared/site    (content-site layer, if the site opts in)
 *              +  <site>/assets/css/site.css   (its accents + --site-* vars)
 *              +  rig/styles         (structure: layout, nav, components, a11y)
 *
 * The six affiliate sites each carried their own 108-line copy of this until
 * 2026-07-28, and each resolved Rig and Hex from a sibling monorepo checkout —
 * so a site could not regenerate its own stylesheet unless the Rig repo
 * happened to sit next to it on disk. This reads everything from the installed
 * `@amulet-laboratories/rig` instead, which since 3.0.0 ships hex's sources.
 *
 * This is a MAINTAINER tool. `public/theme.css` is committed and is the only
 * stylesheet a site loads; Netlify never runs this. Regenerate and commit
 * whenever the theme or Rig's structural CSS changes.
 *
 * Usage:  rig build-theme [--site <dir>] [--out <file>]
 *
 * The theme codename is read from the site's assets/css/main.css, which is
 * expected to contain an @import of `.../hex/<theme>/source`.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const argv = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
}

const SITE = resolve(process.cwd(), flag('site', '.'))
const RIG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HEX = resolve(RIG, 'hex')
const out = resolve(SITE, flag('out', 'public/theme.css'))

const mainCss = resolve(SITE, 'assets/css/main.css')
if (!existsSync(mainCss)) {
  console.error(`rig build-theme: no assets/css/main.css under ${SITE}`)
  process.exit(1)
}
const source = readFileSync(mainCss, 'utf-8')
const theme = source.match(/hex\/([a-z0-9]+)\/source/)?.[1]
if (!theme) {
  console.error(
    'rig build-theme: could not read the theme from assets/css/main.css.\n' +
      'Expected an @import ending in `hex/<theme>/source`.',
  )
  process.exit(1)
}

// The PostCSS toolchain is not a dependency of this package — it would be dead
// weight for the many consumers who never build a theme. Resolve it from the
// consuming project first, then from rig's own install.
// hex/ is last because it only resolves inside the Rig monorepo, where hex is a
// workspace package that owns the PostCSS toolchain; a published rig has no
// hex/node_modules. It is worth trying so `rig build-theme` works in-repo with
// no extra install.
const resolvers = [SITE, RIG, HEX].map((dir) => {
  try {
    return createRequire(resolve(dir, 'package.json'))
  } catch {
    return null
  }
})
const warned = new Set()
const need = (name) => {
  const chain = resolvers.filter(Boolean)
  for (let i = 0; i < chain.length; i++) {
    try {
      const mod = chain[i](name)
      // Which copy of Tailwind runs changes what it emits: it scans for class
      // names relative to itself, so a fallback copy generated ~1,800 utility
      // classes the site's own copy did not, inflating theme.css by 38%. Silent
      // fallback would make that look like a legitimate rebuild.
      if (i > 0 && !warned.has(name)) {
        warned.add(name)
        console.warn(
          `rig build-theme: warning — "${name}" resolved from outside the site.\n` +
            `  Output can differ from a build using the site's own toolchain.\n` +
            `  Fix with: pnpm add -D postcss postcss-import @tailwindcss/postcss cssnano`,
        )
      }
      return mod
    } catch {
      /* try the next resolver */
    }
  }
  console.error(
    `rig build-theme: cannot resolve "${name}".\n` +
      'This command needs the PostCSS toolchain in the site:\n\n' +
      '  pnpm add -D postcss postcss-import @tailwindcss/postcss cssnano\n',
  )
  process.exit(1)
}

const postcss = need('postcss')
const postcssImport = need('postcss-import')
const tailwindcss = need('@tailwindcss/postcss')
const cssnano = need('cssnano')

const run = async (css, from, plugins) =>
  (await postcss(plugins).process(css, { from, to: out, map: false })).css

const compileFile = (entry, plugins) => run(readFileSync(entry, 'utf-8'), entry, plugins)

// 1. Hex skin — same pipeline as hex's own build.
const hexCss = await compileFile(resolve(HEX, `src/themes/${theme}/index.css`), [
  postcssImport(),
  tailwindcss(),
  cssnano({ preset: 'default' }),
])

// 2. Content-site layer plus this site's own overrides, if it has them. Goes
//    through Tailwind with the theme's tokens @reference'd — that context is
//    what makes Tailwind emit the paired `@supports (color: color-mix(…))`
//    fallbacks. Note @import must precede @reference or postcss-import skips it
//    and the whole layer compiles to nothing.
const siteVars = resolve(SITE, 'assets/css/site.css')
const wantsSiteLayer = /hex\/shared\/site/.test(source) || existsSync(siteVars)
let siteCss = ''
if (wantsSiteLayer) {
  const entry = [
    `@import '${resolve(HEX, 'src/shared/site.css')}';`,
    ...(existsSync(siteVars) ? [`@import '${siteVars}';`] : []),
    "@reference 'tailwindcss';",
    `@reference '${resolve(HEX, `src/themes/${theme}/tokens.css`)}';`,
  ].join('\n')
  siteCss = await run(entry, mainCss, [
    postcssImport(),
    tailwindcss(),
    cssnano({ preset: 'default' }),
  ])
}

// 3. Rig structure — plain CSS, so no second Tailwind pass (would duplicate preflight).
const rigCss = await compileFile(resolve(RIG, 'src/styles/base.css'), [
  postcssImport(),
  cssnano({ preset: 'default' }),
])

// Skin first, structure last (rig wins where the two overlap, e.g. responsive nav).
let css = [hexCss, siteCss, rigCss].filter(Boolean).join('\n')

// Safety net for a Rig that predates a11y.css; a no-op once rig ships it.
if (!/\.sr-only\b/.test(css)) {
  css +=
    '\n/* sr-only (skip links) — mirrors @amulet-laboratories/rig a11y.css */' +
    '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}' +
    '.sr-only:focus{position:fixed;top:.5rem;left:.5rem;width:auto;height:auto;margin:0;clip:auto;padding:.75rem 1rem;background:var(--color-background,#fff);color:var(--color-foreground,#000);z-index:9999;border-radius:.375rem;box-shadow:0 4px 12px rgba(0,0,0,.2)}\n'
}

writeFileSync(out, css, 'utf-8')
console.log(
  `✓ theme.css ← hex/${theme}${wantsSiteLayer ? ' + hex/shared/site' : ''} + rig/styles  (${(css.length / 1024).toFixed(0)} KB)`,
)
