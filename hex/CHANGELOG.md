# Changelog

All notable changes to `@amulet-laboratories/hex` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **`beacon` and `voltaic` shipped with no component styling at all.** Neither theme's
  `index.css` imported a `components.css` barrel, and neither `tokens.css` declared the
  typography tokens (`--font-sans`, `--font-mono`, the size scale) that the shared component
  CSS `@apply`s. Both built to ~15 KB against 106–150 KB for a real theme — tokens and base
  only, every `data-rig-*` component unstyled. `beacon` is offered in Obelisk's theme
  switcher, which swaps the whole stylesheet via a single `<link>`, so choosing it left the
  entire app unstyled. Both now build at ~105 KB with ~930 component selectors.
- **`data-theme='unstyled'` now works in all 27 themes.** The escape hatch was defined in 11
  themes' `domains.css` and silently absent from the other 16. Moved to
  `shared/rig-defaults.css`, which every theme's barrel imports. `cobalt`'s extra
  shell-chrome border rule stays in `cobalt`.
- The build test suite iterated `['cobalt', 'garden']` — every "for every theme" assertion
  was really checking 2 of 27, which is how the two broken themes stayed green. It now
  enumerates the themes directory: **40 tests, up from 15**. Also dropped an assertion that
  required `--spacing` in every bundle: no theme declares it, it comes from Tailwind's
  defaults and lands in 2 of 27 bundles by accident, so the test measured tree-shaking rather
  than a design contract. And `each theme has distinct primary colors` now actually compares
  themes — it previously spot-checked two hex literals, which is why the duplicate below went
  unnoticed.

### Changed

- **Extracted the content-site skin into an opt-in `shared/site.css`.** Six themes (`slate`,
  `roast`, `fern`, `quartz`, `damson`, `brass`) each carried a ~730-line `domains.css` that
  was not a domain accent map at all but the full long-form site skin — fluid typography,
  hero, cards, prose, newsletter CTA, footer, nav. The six were **96% identical: 4,392 lines
  of which 335 were unique**. The shared 335 now live in `shared/site.css`, which no theme
  imports; the 12 declarations that genuinely varied became `--site-*` hooks with fallbacks.
  Consuming sites supply their own `[data-category]` map and overrides. Those six bundles
  each shrank ~13.4 KB (**−80,657 bytes across `dist/`**) and all 27 themes are now honestly
  general-purpose. The other 21 bundles are byte-identical.
- **`voltaic` re-cut** — was a byte-for-byte duplicate of `spacewizard` (`#aef66d` on
  `#060d2b`), because it began as a port of a portfolio site rather than a designed theme,
  carrying `--color-*: initial` namespace resets and that site's private `--color-blue-*`
  utility names. Now arc chartreuse `#cfe84a` on graphite `#0d0f08` (h≈69°), filling the gap
  between `citron` and `spacewizard`. Its `base.css`, which was that site's stylesheet down to
  the job-listing transitions, was rewritten as a theme base.
- **`forge` re-cut** from CRT yellow phosphor `#e6c830` (h≈50°, 1° from `citron`) to CRT
  magenta phosphor `#dd55e8` (h≈296°), filling what was the palette's largest hue gap.
  Surfaces, typography, and radii unchanged.
- Palette after both re-cuts: **no duplicate primaries** (was 1), **largest hue gap 37°**
  (was 55°), no incomplete themes (was 2), light/dark split unchanged at 14/13.
- **Hex is no longer published as a standalone package.** As of `rig@3.0.0` the theme layer
  ships inside `@amulet-laboratories/rig` under the `hex/` subpath. `@amulet-laboratories/hex`
  is deprecated on npm at 0.8.0, its final release. This directory remains the source of
  record for theme work; it is simply built and published as part of Rig now. Consumers
  should replace `@amulet-laboratories/hex/…` with `@amulet-laboratories/rig/hex/…` — see
  [../MIGRATION.md](../MIGRATION.md). No theme names, tokens, selectors, or compiled bytes
  changed.

## [0.7.0] — 2026-07-14

### Changed

- **Added a `prepare` script** (`node build.mjs`) that builds every theme's CSS on install and before publish. `dist/` is gitignored, so this guarantees the built bundles exist for consumers — sibling repos reading `../Rig/hex/dist/*.css` no longer need a manual pre-build step (the root cause of Obelisk's `ensure-hex.mjs` workaround), and publishing can never ship a stale/absent `dist/`.
- **Rewrote `CLAUDE.md`** — it documented four themes that were removed long ago (`hexrig`/`vscode`/`spotify`/`gmail`); the real roster is 27 themes with `cobalt` as the default. Also corrected the shared component-file list (added `prose`/`web`/`content`) and the build-outputs section.

### Fixed

- **`SectionDivider` background and `FlankedHeading` ornament color now honor their custom properties.** `[data-rig-section-divider]` gained `background: var(--section-divider-bg, transparent)` (the var was previously defined by some themes but never applied), and the flanked-heading ornament color now reads `var(--flanked-heading-color, var(--color-primary))` instead of a hardcoded `--color-primary`. Pairs with Rig's new `SectionDivider` `fill`/`bg` and `FlankedHeading` `color` props.

### Added (component skins)

- **Callout + FAQ skins** — `[data-rig-callout*]` (tone-aware: info/success/warning/danger via `--rig-callout-accent` + `color-mix`) and `[data-rig-faq*]` in `content.css`, for rig-nuxt's new `QuickAnswer` / `FaqBlock`. Previously every content site re-implemented these in a local `<style scoped>` block.
- **`Icon` tone** — `[data-rig-icon][data-tone='…']` maps Icon's semantic `tone` prop (primary/success/warning/danger/info/muted) to the matching theme color token. Icons still inherit `currentColor` by default; Rig's `color` prop (inline) overrides both.
- **`Card` selected/featured state** — `[data-rig-card][data-selected]` now draws a highlighted border via a new `--rig-card-selected-border` token (falls back to `--color-primary`). Pairs with Rig's new `Card` `selected` prop; replaces consumers hand-setting an inline `border-color` on featured cards.

## [0.6.0] — 2026-06-05

### Fixed

- **Theme color-contrast raised to WCAG AA.** Nudged token lightness (hue preserved) across iris, sienna, clover, lagoon, hearth, vesper, ochre, cardinal, and cypress so demo-site text and UI clear AA, and raised the shared stat-row label color-mix (fixing the near-invisible vesper stat-row). Each change verified by recomputed WCAG 2.1 ratios (≥4.5:1 text, ≥3:1 large/UI).

### Added

- **`./shared/*` package exports** so custom themes built outside `src/themes/` can import the shared component CSS individually. 16 new entries: `./shared/rig-defaults`, `./shared/a11y`, `./shared/tokens`, and `./shared/components/{core, layout, nav, editor, lists, menus, extras, shell, data, spatial, temporal, prose, web, content}`.

### Changed

- **Theme content cleanup (all 27 themes).** Stripped project-specific identifiers from comments across 14 themes — cardinal (KBCV), clover (Compass), copper (Undertow), cypress ("real estate theme"), damson (Meepleloft), hearth (Fogline), iris (Briarcove), lagoon (Duskline), roast (Beanwoven), sienna (Briarcovelib), slate (The Shelf Nook), vesper ("hospitality theme"), voltaic (Andrew Passanisi). Renamed 17 brand-prefixed CSS variables to use theme names (`--beanwoven-*` → `--roast-*`, `--kbcv-*` → `--cardinal-*`, etc.). Zero source files in any consumer project reference the old names. Token values unchanged.
- **README rewrite.** Documents all 27 themes (was 4) with one-line palette summaries. New section on building a custom theme outside `src/themes/` via `@amulet-laboratories/hex/shared/*` imports.

### Added (component skins)

- **CTA button distinct token namespace** — new `--rig-button-cta-{bg, fg, border, shadow}` (plus hover + active variants). Consumers with custom CTA palettes now override tokens instead of the entire selector. Each falls back to the primary token when unset; existing themes unaffected.

## [0.4.0] — 2026-05-03

### Added

- `fogline` full theme + scoped (coffee roastery — espresso brown / crema gold)
- `rootremedy` scoped theme already present, now also full-theme + `build.mjs` registered
- New `./fogline`, `./fogline/source`, `./rootremedy`, `./rootremedy/source` package exports
- New `./scoped/fogline`, `./scoped/rootremedy` package exports
- `dist/fogline.css` and `dist/rootremedy.css` build outputs
- Per-theme display typography scale tokens (`--rig-display-{xs,sm,md,lg,xl,2xl}`, `--rig-display-tracking`, `--rig-display-leading`, `--rig-display-weight`)
- Shared elevation token scale (`--rig-elevation-{0,1,2,3,4}` with per-theme `--rig-elevation-rgb` tint)
- Per-theme `--rig-media-filter` token applied to `[data-rig-card][data-media] img`
- Per-theme `--link-slide-color` for accent-aware text-link underlines
- `[data-rig-card][data-media]` variant with built-in image hover-zoom + reduced-motion guard

### Changed

- All 13 demo themes now define their own display rhythm, image filter, and link-slide accent
- `[data-rig-card][data-interactive]` hover lift increased from 2px to 4px and uses `--rig-elevation-2`
- `fogline` and `rootremedy` added to `build.mjs` themes array
- Bundle size budget raised from 175 KB → 200 KB to accommodate the new token additions

### Fixed

- Stale `scoped/tokens.css` no longer omits fogline + rootremedy theme imports

## [0.3.0]

### Changed

- Cut theme roster from 10 to 4: hexrig (default), vscode, spotify, gmail
- Removed github, figma, jira, bloomberg, maps, tableau themes
- Added cssnano minification to build output (~150 kB per theme, ~14 kB gzipped)
- Updated size budget from 200 KB to 175 KB to reflect minified output

## [0.1.0] — 2025-06-30

### Added

- Initial release with PostCSS + Tailwind v4 build pipeline via `build.mjs`
- Shared component CSS across 11 files mapping 1:1 to Rig packages (core, layout, nav, editor, lists, menus, extras, shell, data, spatial, temporal)
- Accessibility utilities: forced-colors and prefers-contrast overrides
- shadcn-compatible token contract (`@theme` + `:root` blocks)
- CSS file hot-swap architecture — one CSS file per theme, swap `<link>` at runtime
- Domain accent system with `--domain-accent` contextual colors
- Build tests verifying output structure, token presence, component selectors, and theme distinctness
- CI pipeline with ESLint, Prettier, Stylelint, build, and test
