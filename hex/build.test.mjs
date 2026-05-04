// Hex build script tests
// Uses Node's built-in test runner — no extra dependencies needed for a CSS-only package

import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = resolve(import.meta.dirname)
const DIST = resolve(ROOT, 'dist')

const themes = ['vscode', 'garden']

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
    // Root bundle should match vscode (default theme)
    const hexSize = readFileSync(resolve(DIST, 'hex.css')).length
    const vscodeSize = readFileSync(resolve(DIST, 'vscode.css')).length
    assert.equal(hexSize, vscodeSize, 'hex.css should match vscode.css size')
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
        assert.ok(css.includes(token), `${theme}.css should declare ${token}`)
      }
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
      assert.ok(css.includes('--spacing'), `${theme}.css should include spacing`)
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
    const vscode = readFileSync(resolve(DIST, 'vscode.css'), 'utf-8')
    const garden = readFileSync(resolve(DIST, 'garden.css'), 'utf-8')

    assert.ok(vscode.includes('#0078d4'), 'vscode should use VS Code blue primary')
    assert.ok(garden.includes('#eb4963'), 'garden should use rose primary')
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
})
