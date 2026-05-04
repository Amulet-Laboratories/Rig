# Changelog

All notable changes to `@amulet-laboratories/hex` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
