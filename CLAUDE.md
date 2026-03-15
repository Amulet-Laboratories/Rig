# @amulet-laboratories/rig

## Overview

Headless, accessible Vue 3 component library. VSCode-style layout, completely unstyled. Consumers supply all styling via CSS custom properties, Tailwind, and slot content.

## Monorepo Structure

pnpm workspace with three packages:

| Package | Path | Purpose |
|---------|------|---------|
| `@amulet-laboratories/rig` | `.` (root) | Headless Vue 3 component library |
| `@amulet-laboratories/hex` | `hex/` | Multi-theme CSS layer targeting `data-rig-*` selectors |
| `@amulet-laboratories/config` | `config/` | Shared ESLint 9 flat config + Prettier |

Internal dependencies use `workspace:*` protocol. Config is consumed by both Rig and Hex.

## Tech Stack

- Vue 3 + TypeScript strict — `<script setup lang="ts">` only
- Vite 7 library mode (ESM + CJS)
- Vitest + @vue/test-utils for testing
- pnpm workspace (never npm or yarn)
- Vue peer dependency: ^3.5.0

## Code Style

- 2-space indent, no semicolons, single quotes, trailing commas
- PascalCase `.vue` files
- `@core/`, `@layout/`, etc. path aliases for internal imports
- Commit messages: imperative mood (`feat:`, `fix:`, `chore:`)

## Architecture

- `packages/` — 11 sub-packages (core, layout, nav, editor, lists, menus, extras, shell, data, spatial, temporal)
- `src/index.ts` — umbrella entry point re-exporting all packages
- Components are completely unstyled — semantic HTML + data attributes
- Root element: `data-rig-{component-name}`, state: `data-{state}`
- CSS custom properties with fallback values for behavioral dimensions
- Accessibility built in — ARIA, keyboard nav, focus management

## Commands

```bash
pnpm install          # Install all workspace dependencies
pnpm dev              # Watch mode (tests + health)
pnpm build            # Vite library build (Rig)
pnpm test             # Run all Rig tests
pnpm test:watch       # Watch mode
pnpm check            # Lint + format + vue-tsc --noEmit
pnpm health           # Full CI pipeline (check + build + test + bench + manifest + audit)
cd hex && pnpm build  # Build all Hex CSS themes
```

## Testing

Every component has a `.test.ts` file. Tests cover:

- Renders without errors
- Data attributes reflect props/state
- Emits fire with correct payloads
- Keyboard navigation
- ARIA attributes
- Slot rendering
- v-model updates
