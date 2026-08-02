// Hex theme contrast tests
// Uses Node's built-in test runner, like build.test.mjs — no extra deps.
//
// Every theme here dresses a live site, so a token pair that fails WCAG AA is a
// real accessibility defect on a real property. Three of them were failing when
// this file was written: quartz, fern and brass each put the active nav link at
// 2.5-2.8 against its own background, and their white button labels sat around
// 3.0. That went unnoticed because contrast was only ever checked by rendering
// a page and running axe — which reaches one theme, in one colour scheme, on
// whatever pages get crawled.
//
// A contrast ratio is arithmetic over two hex values. It does not need a
// browser, and checking it here means a bad palette cannot ship at all.

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const THEMES = resolve(import.meta.dirname, 'src/themes')

/**
 * The themes consumed by the estate, and by whom. Only these are asserted:
 * the other twenty are unused, several fail today, and repainting a public
 * component library is a design decision rather than a bug fix. See the
 * `reports every theme` test below, which prints the rest without failing.
 */
const IN_USE = {
  brass: 'TheScruffGuide.com',
  citron: 'QuizSort.com',
  damson: 'Meepleloft.com',
  fern: 'OneGoodLamp.com',
  quartz: 'FewerSerums.com',
  roast: 'Beanwoven.com',
  slate: 'TheShelfNook.com',
}

/** WCAG 2.2 AA, normal-size text. */
const AA = 4.5

function readTokens(theme) {
  const css = readFileSync(resolve(THEMES, theme, 'tokens.css'), 'utf8')
  const start = css.indexOf('@theme {')
  assert.notEqual(start, -1, `${theme}/tokens.css has no @theme block`)
  const body = css.slice(start, css.indexOf('\n}', start))
  const tokens = {}
  for (const [, name, value] of body.matchAll(/(--color-[\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[name] = value
  }
  return tokens
}

const channel = (c) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * The pairs that shared CSS actually composes. Each mirrors a rule in
 * src/shared/components/web.css — change one there and this list must follow.
 */
const PAIRS = [
  // [data-rig-site-nav-link] { color: var(--color-muted-foreground) }
  ['site nav link', '--color-muted-foreground', '--color-background'],
  // [data-rig-site-nav-link][data-active] — primary text on a secondary chip,
  // which is a harder pair than primary on the page background.
  ['active nav link', '--color-primary', '--color-secondary'],
  // Primary buttons: the label sits on the primary fill.
  ['primary button label', '--color-primary-foreground', '--color-primary'],
  ['body text', '--color-foreground', '--color-background'],
]

describe('hex theme contrast', () => {
  for (const [theme, site] of Object.entries(IN_USE)) {
    describe(`${theme} (${site})`, () => {
      const tokens = readTokens(theme)

      for (const [label, fgToken, bgToken] of PAIRS) {
        it(`${label} clears AA`, () => {
          const fg = tokens[fgToken]
          const bg = tokens[bgToken]
          assert.ok(fg, `${theme} defines no ${fgToken}`)
          assert.ok(bg, `${theme} defines no ${bgToken}`)

          const ratio = contrast(fg, bg)
          assert.ok(
            ratio >= AA,
            `${theme}: ${label} is ${ratio.toFixed(2)}:1 (${fg} on ${bg}), below AA's ${AA}:1`,
          )
        })
      }

      it('hovers a button darker than the button itself', () => {
        // --rig-button-hover-bg is defined outside @theme, so read it directly.
        const css = readFileSync(resolve(THEMES, theme, 'tokens.css'), 'utf8')
        const hover = css.match(/--rig-button-hover-bg:\s*(#[0-9a-fA-F]{6})\s*;/)?.[1]
        if (!hover) return // not every theme styles button hover

        const primary = tokens['--color-primary']
        assert.ok(
          luminance(hover) < luminance(primary),
          `${theme}: hover ${hover} is lighter than primary ${primary} — hover feedback inverted`,
        )
      })
    })
  }

  it('reports every theme, failing only on the ones in use', () => {
    const unusedFailures = []

    for (const theme of readdirSync(THEMES)) {
      if (theme in IN_USE) continue
      const tokens = readTokens(theme)
      for (const [label, fgToken, bgToken] of PAIRS) {
        const fg = tokens[fgToken]
        const bg = tokens[bgToken]
        if (!fg || !bg) continue
        const ratio = contrast(fg, bg)
        if (ratio < AA) unusedFailures.push(`${theme}: ${label} ${ratio.toFixed(2)}:1`)
      }
    }

    // Not an assertion — these ship to nobody. Printed so the backlog is
    // visible rather than rediscovered by the next audit.
    if (unusedFailures.length) {
      console.log(
        `\n  ${unusedFailures.length} AA failures in unused themes (not blocking):\n` +
          unusedFailures.map((f) => `    ${f}`).join('\n') +
          '\n',
      )
    }
  })
})
