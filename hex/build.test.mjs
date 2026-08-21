// Hex build script tests
// Uses Node's built-in test runner — no extra dependencies needed for a CSS-only package

import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = resolve(import.meta.dirname)
const DIST = resolve(ROOT, 'dist')
const SRC = resolve(ROOT, 'src')

// Every theme, not a hand-picked pair. This list was `['cobalt', 'garden']`
// until 2026-07-28, so each "for every theme" assertion below was really
// checking 2 of 27 — which is how `beacon` and `voltaic` shipped for months
// with no component styling at all and a green suite.
const themes = readdirSync(resolve(SRC, 'themes')).filter((t) =>
  existsSync(resolve(SRC, 'themes', t, 'index.css')),
)

describe('Hex build', () => {
  before(() => {
    // Clean dist and rebuild
    if (existsSync(DIST)) rmSync(DIST, { recursive: true })
    execSync('node build.mjs', { cwd: ROOT, stdio: 'pipe' })
  })

  it('creates dist directory', () => {
    assert.ok(existsSync(DIST), 'dist/ should exist after build')
  })

  it('creates hex.css root bundle', () => {
    const path = resolve(DIST, 'hex.css')
    assert.ok(existsSync(path), 'dist/hex.css should exist')
    const css = readFileSync(path, 'utf-8')
    assert.ok(css.length > 0, 'hex.css should not be empty')
  })

  for (const theme of themes) {
    it(`creates ${theme}.css full bundle`, () => {
      const path = resolve(DIST, `${theme}.css`)
      assert.ok(existsSync(path), `dist/${theme}.css should exist`)
      const css = readFileSync(path, 'utf-8')
      assert.ok(css.length > 0, `${theme}.css should not be empty`)
    })
  }

  // ─── Output size guards (prevents empty-file regression) ────────────────

  it('all dist files exceed minimum size threshold', () => {
    for (const theme of themes) {
      const fullSize = readFileSync(resolve(DIST, `${theme}.css`)).length
      assert.ok(fullSize > 5000, `${theme}.css full bundle is ${fullSize} bytes, expected >5000`)
    }
    // Root bundle should match cobalt (default theme)
    const hexSize = readFileSync(resolve(DIST, 'hex.css')).length
    const cobaltSize = readFileSync(resolve(DIST, 'cobalt.css')).length
    assert.equal(hexSize, cobaltSize, 'hex.css should match cobalt.css size')
  })

  // ─── CSS size budget (prevents unbounded growth) ────────────────────────

  it('no CSS file exceeds 200 KB budget', () => {
    const MAX_BYTES = 200 * 1024 // 200 KB (minified — bumped from 175 to accommodate display + elevation + media-filter tokens)
    const allFiles = ['hex.css', ...themes.map((t) => `${t}.css`)]
    for (const file of allFiles) {
      const size = readFileSync(resolve(DIST, file)).length
      assert.ok(
        size <= MAX_BYTES,
        `${file} is ${(size / 1024).toFixed(1)} KB, exceeds ${MAX_BYTES / 1024} KB budget`,
      )
    }
  })

  // ─── Content validation ─────────────────────────────────────────────────

  it('theme bundles declare shadcn color tokens', () => {
    for (const theme of themes) {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf-8')
      const requiredTokens = [
        '--background',
        '--foreground',
        '--primary',
        '--primary-foreground',
        '--muted',
        '--muted-foreground',
        '--destructive',
        '--destructive-foreground',
        '--card',
        '--card-foreground',
        '--popover',
        '--popover-foreground',
        '--secondary',
        '--secondary-foreground',
        '--accent',
        '--accent-foreground',
        '--border',
        '--input',
        '--ring',
        '--radius',
      ]
      for (const token of requiredTokens) {
        assert.ok(css.includes(token), `${theme}.css should declare ${token}`)
      }
    }
  })

  // NB: this asserts a *declaration* (`--color-x:`), not an occurrence. Until
  // 2026-08-06 it used `css.includes('--color-background')`, which is satisfied
  // by any `var(--color-background)` reference in component CSS — and every
  // bundle has ~90 of those. So the test passed while 21 of 30 bundles declared
  // none of these tokens at all and every reference resolved to nothing.
  // Match `--color-x:` but not `--color-x-y:` so a longer token can't stand in
  // for a missing shorter one.
  const declares = (css, token) => new RegExp(`${token}\\s*:`).test(css)

  it('theme bundles declare semantic color utilities', () => {
    for (const theme of themes) {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf-8')
      const semanticTokens = [
        '--color-background',
        '--color-foreground',
        '--color-primary',
        '--color-muted',
        '--color-muted-foreground',
        '--color-success',
        '--color-warning',
        '--color-info',
        '--color-destructive',
      ]
      for (const token of semanticTokens) {
        assert.ok(
          declares(css, token),
          `${theme}.css should declare ${token}, not merely reference it`,
        )
      }
    }
  })

  // The regression guard for the above. `@reference './tokens.css'` inside a
  // theme's base/components/domains puts tokens.css in Tailwind reference mode,
  // and Tailwind then emits none of its @theme variables — silently, because the
  // `var()` references that need them are still emitted. The tokens are already
  // in scope via index.css's `@import './tokens.css'`, so the @reference is
  // redundant as well as harmful. Same trap in src/scoped/index.css for bridge.css.
  it('no theme re-references its own tokens.css', () => {
    for (const theme of themes) {
      for (const file of ['base.css', 'components.css', 'domains.css']) {
        const path = resolve(SRC, 'themes', theme, file)
        if (!existsSync(path)) continue
        const css = readFileSync(path, 'utf-8')
        assert.ok(
          !/@reference\s+['"]\.\/tokens\.css['"]/.test(css),
          `${theme}/${file} must not @reference ./tokens.css — it suppresses every @theme token in the bundle`,
        )
      }
    }
  })

  it('the scoped bundle declares the bridge tokens', () => {
    const css = readFileSync(resolve(DIST, 'scoped.css'), 'utf-8')
    for (const token of ['--color-background', '--color-foreground', '--color-primary']) {
      assert.ok(declares(css, token), `scoped.css should declare ${token}, not merely reference it`)
    }
  })

  it('theme bundles contain data-rig-* component selectors', () => {
    const expectedSelectors = [
      'data-rig-button',
      'data-rig-badge',
      'data-rig-toast',
      'data-rig-input',
      'data-rig-card',
      'data-rig-modal',
      'data-rig-accordion',
      'data-rig-tree',
      'data-rig-tabs',
      'data-rig-checkbox',
      'data-rig-switch',
      'data-rig-select',
    ]
    for (const theme of themes) {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf-8')
      for (const sel of expectedSelectors) {
        assert.ok(css.includes(sel), `${theme}.css should style ${sel}`)
      }
    }
  })

  it('theme bundles include shared design tokens', () => {
    for (const theme of themes) {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf-8')
      assert.ok(css.includes('--text-xs'), `${theme}.css should include type scale`)
      assert.ok(css.includes('--text-sm'), `${theme}.css should include text-sm`)
      // No `--spacing` assertion: no theme declares it. It comes from Tailwind's
      // default theme and is only emitted when a spacing utility happens to be
      // used, so it lands in 2 of 27 bundles by accident. Asserting it tested
      // tree-shaking, not a design contract.
      assert.ok(css.includes('--radius'), `${theme}.css should include radius`)
      assert.ok(css.includes('--font-sans'), `${theme}.css should include font-sans`)
      assert.ok(css.includes('--font-mono'), `${theme}.css should include font-mono`)
    }
  })

  it('theme bundles include focus-visible styles', () => {
    for (const theme of themes) {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf-8')
      assert.ok(css.includes('focus-visible'), `${theme}.css should include focus-visible styles`)
    }
  })

  it('theme bundles include scrollbar and selection styles', () => {
    for (const theme of themes) {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf-8')
      assert.ok(css.includes('scrollbar-color'), `${theme}.css should include Firefox scrollbar`)
      assert.ok(css.includes('::selection'), `${theme}.css should include selection styles`)
    }
  })

  it('theme bundles include reduced motion support', () => {
    for (const theme of themes) {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf-8')
      assert.ok(
        css.includes('prefers-reduced-motion'),
        `${theme}.css should include reduced motion`,
      )
    }
  })

  it('each theme has distinct primary colors', () => {
    const cobalt = readFileSync(resolve(DIST, 'cobalt.css'), 'utf-8')
    const garden = readFileSync(resolve(DIST, 'garden.css'), 'utf-8')

    assert.ok(cobalt.includes('#0078d4'), 'cobalt should use VS Code blue primary')
    assert.ok(garden.includes('#eb4963'), 'garden should use rose primary')

    // Actually check distinctness, which the two spot-checks above do not.
    // Until 2026-07-28 `voltaic` was a byte-for-byte copy of `spacewizard`'s
    // palette and this test still passed, because it never compared themes.
    const seen = new Map()
    for (const theme of themes) {
      const src = readFileSync(resolve(SRC, 'themes', theme, 'tokens.css'), 'utf-8')
      const primary = src.match(/--color-primary:\s*(#[0-9a-fA-F]{3,8})/)?.[1]?.toLowerCase()
      assert.ok(primary, `${theme} should declare --color-primary`)
      assert.ok(
        !seen.has(primary),
        `${theme} shares primary ${primary} with ${seen.get(primary)} — themes must be visually distinct`,
      )
      seen.set(primary, theme)
    }
  })

  it('theme bundles include unstyled reset selector', () => {
    for (const theme of themes) {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf-8')
      assert.ok(
        css.includes("data-theme='unstyled'") || css.includes('data-theme=unstyled'),
        `${theme}.css should include data-theme='unstyled' reset`,
      )
    }
  })

  // ── Contrast-safe accent ────────────────────────────────────────────────
  // The 2026-07-31 fleet audit found the brand accent used as SMALL TEXT on
  // white, at 3.50:1 against a 4.5:1 AA floor, on all six content sites. The
  // fix splits display from text: --card-accent / --color-accent stay as-is,
  // and the few small-text rules read a darkened -text variant. These tests
  // guard both halves, because either alone silently does nothing.

  it('small-text accent rules read the contrast-safe -text token', () => {
    const site = readFileSync(resolve(SRC, 'shared', 'site.css'), 'utf-8')
    const content = readFileSync(resolve(SRC, 'shared', 'components', 'content.css'), 'utf-8')

    // Each rule must consult the -text token FIRST and still fall through to
    // the display accent, so themes that never opt in are unaffected.
    const smallText = [
      [site, '[data-rig-category-card-title]', '--card-accent-text'],
      [site, '[data-rig-article-card-category]', '--card-accent-text'],
      [site, '[data-rig-featured-card-category]', '--card-accent-text'],
      [content, '[data-rig-quiz-promo-badge]', '--color-accent-text'],
    ]
    for (const [css, selector, token] of smallText) {
      const i = css.indexOf(selector + ' {')
      assert.ok(i !== -1, `${selector} should exist`)
      const block = css.slice(i, css.indexOf('}', i))
      assert.ok(
        block.includes(`var(${token},`),
        `${selector} is small text — it must read var(${token}, …) so it can clear 4.5:1`,
      )
    }

    // The icon beside the featured-card category is NOT text and must keep the
    // display accent — icons answer to the 3:1 non-text rule, and darkening
    // them was never the point.
    const svg = site.indexOf('[data-rig-featured-card-category] svg {')
    assert.ok(svg !== -1)
    assert.ok(
      !site.slice(svg, site.indexOf('}', svg)).includes('--card-accent-text'),
      'the category icon should keep the display accent, not the text variant',
    )
  })

  it('--color-accent-text clears 4.5:1 wherever a theme declares it', () => {
    const srgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    const lum = (r) => 0.2126 * lin(r[0]) + 0.7152 * lin(r[1]) + 0.0722 * lin(r[2])
    const ratio = (a, b) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
      return (hi + 0.05) / (lo + 0.05)
    }

    let declared = 0
    for (const theme of themes) {
      const src = readFileSync(resolve(SRC, 'themes', theme, 'tokens.css'), 'utf-8')
      const text = src.match(/--color-accent-text:\s*(#[0-9a-fA-F]{6})/)?.[1]
      if (!text) continue // opting out is legitimate — see the note in shared/site.css
      declared++
      const card = src.match(/--color-card:\s*(#[0-9a-fA-F]{6})/)?.[1]
      assert.ok(card, `${theme} should declare --color-card`)
      const r = ratio(srgb(text), srgb(card))
      assert.ok(
        r >= 4.5,
        `${theme}: --color-accent-text ${text} on card ${card} is ${r.toFixed(2)}:1, under the 4.5:1 AA floor`,
      )
    }
    assert.ok(declared > 0, 'at least one theme should declare --color-accent-text')
  })
})

/**
 * Every theme must skin the page chrome.
 *
 * The README lists all 27 as interchangeable — "switch themes by changing one
 * import, every component re-skins on the next paint" — and names `cobalt` and
 * `spacewizard` in its example block. Six themes (beacon, cobalt, forge,
 * greyline, spacewizard, voltaic) shipped with no rules at all for SiteNav or
 * SiteFooter, so choosing one for a site produced a nav computing
 * `display: block` and an invisible footer.
 *
 * This is the same failure the theme list at the top of this file records —
 * a "for every theme" claim that was really checking a couple of them. The
 * omission is easy to reintroduce, because a new theme is made by copying an
 * existing one and any of the six was a plausible thing to copy.
 */
describe('theme coverage', () => {
  // The chrome a marketing site cannot render without.
  const chrome = ['data-rig-site-nav', 'data-rig-site-footer', 'data-rig-hero', 'data-rig-section']

  for (const theme of themes) {
    it(`${theme} skins the page chrome`, () => {
      const css = readFileSync(resolve(DIST, `${theme}.css`), 'utf8')
      const missing = chrome.filter((sel) => !css.includes(sel))
      assert.deepEqual(
        missing,
        [],
        `${theme}.css has no rules for ${missing.join(', ')} — ` +
          `add \`@import '../../shared/components/web.css'\` to its components.css, ` +
          `with the other @imports (an @import after any other rule is dropped).`,
      )
    })
  }
})
