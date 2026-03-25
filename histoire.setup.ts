/// <reference types="vite/client" />

// ── Histoire global setup ───────────────────────────────────────────────
// Runs inside every story sandbox iframe before the story mounts.
// Injects the active Hex theme + a persistent floating theme switcher.

import aldricpaceCss from './hex/dist/aldricpace.css?inline'
import briarcoveCss from './hex/dist/briarcove.css?inline'
import briarcoveLibCss from './hex/dist/briarcovelib.css?inline'
import compassCss from './hex/dist/compass.css?inline'
import dusklineCss from './hex/dist/duskline.css?inline'
import forgeCss from './hex/dist/forge.css?inline'
import gardenCss from './hex/dist/garden.css?inline'
import greylineCss from './hex/dist/greyline.css?inline'
import kbcvCss from './hex/dist/kbcv.css?inline'
import lanternhouseCss from './hex/dist/lanternhouse.css?inline'
import marlenlysCss from './hex/dist/marenlys.css?inline'
import quizbitCss from './hex/dist/quizbit.css?inline'
import saltsignalCss from './hex/dist/saltsignal.css?inline'
import spacewizardCss from './hex/dist/spacewizard.css?inline'
import tidemarkCss from './hex/dist/tidemark.css?inline'
import undertowCss from './hex/dist/undertow.css?inline'
import vscodeCss from './hex/dist/vscode.css?inline'

// ── Theme registry ──────────────────────────────────────────────────────

const THEMES: Record<string, { css: string; label: string; scheme: 'dark' | 'light' }> = {
  // Dark
  vscode: { css: vscodeCss, label: 'VSCode', scheme: 'dark' },
  garden: { css: gardenCss, label: 'Garden', scheme: 'dark' },
  forge: { css: forgeCss, label: 'Forge', scheme: 'dark' },
  duskline: { css: dusklineCss, label: 'Duskline', scheme: 'dark' },
  greyline: { css: greylineCss, label: 'Greyline', scheme: 'dark' },
  lanternhouse: { css: lanternhouseCss, label: 'Lanternhouse', scheme: 'dark' },
  spacewizard: { css: spacewizardCss, label: 'Spacewizard', scheme: 'dark' },
  undertow: { css: undertowCss, label: 'Undertow', scheme: 'dark' },
  quizbit: { css: quizbitCss, label: 'Quizbit', scheme: 'dark' },
  // Light
  aldricpace: { css: aldricpaceCss, label: 'Aldricpace', scheme: 'light' },
  briarcove: { css: briarcoveCss, label: 'Briarcove', scheme: 'light' },
  briarcovelib: { css: briarcoveLibCss, label: 'Briarcove Lib', scheme: 'light' },
  compass: { css: compassCss, label: 'Compass', scheme: 'light' },
  kbcv: { css: kbcvCss, label: 'KBCV', scheme: 'light' },
  marenlys: { css: marlenlysCss, label: 'Marenlys', scheme: 'light' },
  saltsignal: { css: saltsignalCss, label: 'Saltsignal', scheme: 'light' },
  tidemark: { css: tidemarkCss, label: 'Tidemark', scheme: 'light' },
}

const STORAGE_KEY = 'hex-active-theme-id'

function getActiveId(): string {
  return localStorage.getItem(STORAGE_KEY) ?? 'vscode'
}

// ── Inject active theme ─────────────────────────────────────────────────

const themeEl = document.createElement('style')
themeEl.id = 'hex-active-theme'
document.head.appendChild(themeEl)

function applyTheme(id: string): void {
  const entry = THEMES[id] ?? THEMES['vscode']!
  themeEl.textContent = entry.css
  document.documentElement.style.colorScheme = entry.scheme
  document.body.dataset.theme = id
  localStorage.setItem(STORAGE_KEY, id)

  // Update select if it exists (theme may be applied before bar is created)
  const select = document.getElementById('hex-theme-select') as HTMLSelectElement | null
  if (select && select.value !== id) select.value = id
}

applyTheme(getActiveId())

// Expose globally so story components can trigger theme changes on mount
;(window as Window & { __hexApplyTheme?: typeof applyTheme }).__hexApplyTheme = applyTheme

// ── Sandbox overrides ───────────────────────────────────────────────────

const overrides = document.createElement('style')
overrides.textContent = /* css */ `
  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    padding: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body > * { max-width: 100%; }

  :focus-visible {
    outline: 2px solid var(--ring, #6b9fff);
    outline-offset: 2px;
  }

  /* ── Floating theme switcher ─────────────────────────────────────── */

  #hex-theme-bar {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: var(--card, #181818);
    border: 1px solid var(--border, #2b2b2b);
    border-radius: var(--radius, 4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    color: var(--muted-foreground, #9d9d9d);
    line-height: 1;
    user-select: none;
  }

  #hex-theme-bar select {
    background: var(--background, #1f1f1f);
    color: var(--foreground, #ccc);
    border: 1px solid var(--border, #3c3c3c);
    border-radius: calc(var(--radius, 4px) - 1px);
    padding: 3px 5px;
    font-size: 11px;
    font-family: inherit;
    cursor: pointer;
    outline: none;
  }

  #hex-theme-bar select:focus-visible {
    outline: 2px solid var(--ring, #6b9fff);
  }
`
document.head.appendChild(overrides)

// ── Floating switcher bar ───────────────────────────────────────────────

const activeId = getActiveId()
const bar = document.createElement('div')
bar.id = 'hex-theme-bar'

const darkGroup = Object.entries(THEMES)
  .filter(([, t]) => t.scheme === 'dark')
  .map(
    ([id, t]) => `<option value="${id}"${id === activeId ? ' selected' : ''}>${t.label}</option>`,
  )
  .join('')

const lightGroup = Object.entries(THEMES)
  .filter(([, t]) => t.scheme === 'light')
  .map(
    ([id, t]) => `<option value="${id}"${id === activeId ? ' selected' : ''}>${t.label}</option>`,
  )
  .join('')

bar.innerHTML = `
  <span>theme</span>
  <select id="hex-theme-select">
    <optgroup label="Dark">${darkGroup}</optgroup>
    <optgroup label="Light">${lightGroup}</optgroup>
  </select>
`
document.body.appendChild(bar)

document.getElementById('hex-theme-select')!.addEventListener('change', (e) => {
  applyTheme((e.target as HTMLSelectElement).value)
})
