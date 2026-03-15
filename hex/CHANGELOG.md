# Changelog

All notable changes to `@amulet-laboratories/hex` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
