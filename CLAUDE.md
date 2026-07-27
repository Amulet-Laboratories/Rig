# @amulet-laboratories/rig

## Overview

Headless, accessible Vue 3 component library. Completely unstyled — Hex provides all visual styling. Consumers compose sites from Rig components using props, slots, and content. They do not write CSS.

## Branding

Marketed as **one product: Hexrig** — the design system. Rig and Hex are its two _layers_
(Rig = headless components, Hex = the theme framework), named only in developer/architecture
contexts. Client- and marketing-facing copy says "Hexrig," never "Rig + Hex" or "Hex/Rig". The
live site is `/hexrig`; the example sites are `/hexrig/demos`. (Package names stay
`@amulet-laboratories/rig` and `hex` — the layers are still the real installable units.)

## Composition Boundary

Rig and Hex together form the library. Consumer sites are the composition layer.

**Library (Rig + Hex) owns:**

- All visual styling — colors, typography, spacing, borders, backgrounds, hover states
- Component structure — semantic HTML, data attributes, ARIA
- Theme tokens — every color, font, radius decision
- Layout behavior — responsive breakpoints, grid/flex patterns within components

**Consumer sites own:**

- Content — text, images, data arrays
- Composition — which components to use, in what order
- Configuration — props, variants, slot content
- Navigation — page structure, routing

**When adding or modifying a Rig component, ask:** "If a site needs `style=` or arbitrary Tailwind values to use this component correctly, the component is missing a prop, variant, or slot." Every visual need a consumer might have should be expressible through the component API. If you find yourself writing inline styles in a consumer site, that's a signal to go back and add the missing capability to Rig or Hex.

## Monorepo Structure

pnpm workspace packages:

| Package                            | Path       | Purpose                                                |
| ---------------------------------- | ---------- | ------------------------------------------------------ |
| `@amulet-laboratories/rig`         | `.` (root) | Headless Vue 3 component library                       |
| `@amulet-laboratories/hex`         | `hex/`     | Multi-theme CSS layer targeting `data-rig-*` selectors |
| `@amulet-laboratories/config`      | `config/`  | Shared ESLint 9 flat config + Prettier                 |
| `@amulet-laboratories/hexrig-site` | `landing/` | Hexrig marketing landing page (→ `/hexrig`)            |
| `@amulet-laboratories/demos`       | `demos/`   | 13 example sites showcasing Hexrig (→ `/hexrig/demos`) |
| `@amulet-laboratories/rig-nuxt`    | `nuxt/`    | Nuxt module wrapper                                    |

Internal dependencies use `workspace:*` protocol. Config is consumed across packages.

`landing/`, `demos/`, and the Histoire stories are built and assembled into `deploy/hexrig/**`
by `scripts/build-deploy.mjs` (wired in `netlify.toml`). **`demos/` moved here from
AmuletLabs.org** so the example sites sit next to the design system they showcase; each demo
is a self-contained app route (`demos/src/pages/demos/<name>/index.vue`) composing Rig + Hex,
consuming them as `workspace:*` deps. AmuletLabs.org `/demos/*` 301-redirects to `/hexrig/demos`.

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

- `packages/` — 12 sub-packages (core, layout, nav, editor, lists, menus, extras, shell, data, spatial, temporal, web)
- `src/index.ts` — umbrella entry point re-exporting all packages
- Components are completely unstyled — semantic HTML + data attributes
- Root element: `data-rig-{component-name}`, state: `data-{state}`
- CSS custom properties with fallback values for behavioral dimensions
- Accessibility built in — ARIA, keyboard nav, focus management
- Slot content renders directly — avoid wrapper divs around slots unless structurally required

## Commands

```bash
pnpm install          # Install all workspace dependencies
pnpm dev              # Watch mode (vitest)
pnpm build            # Vite library build (Rig)
pnpm test             # Run all Rig tests
pnpm test:watch       # Watch mode
pnpm check            # Lint + format + vue-tsc --noEmit
pnpm story:dev        # Histoire dev server (component stories)
pnpm story:build      # Build static Histoire site
pnpm story:preview    # Preview built Histoire site
cd hex && pnpm build  # Build all Hex CSS themes
```

## Histoire (Component Stories)

Stories live in two locations:

- `packages/*/src/**/*.story.vue` — Individual component stories, co-located with source
- `stories/**/*.story.vue` — Full-page composition demos (Workbench, Dashboard, Observatory)

### Story conventions

- Use `<Story title="Package/Component">` with slash-separated tree path
- Add `group="package-id"` matching the tree group (`core`, `layout`, `nav`, `editor`, `lists`, `menus`, `extras`, `shell`, `data`, `spatial`, `temporal`, `demos`)
- Include at least: Default variant, key prop variants, Playground variant with `#controls` slot
- Playground controls use `HstSelect`, `HstCheckbox`, `HstSlider`, etc.
- No `<style>` blocks — use inline styles with `var(--token)` references
- Icons from `lucide:` set via Iconify

### Configuration

- `histoire.config.ts` — Theme, tree groups, responsive viewports, background presets, Vite aliases
- `histoire.setup.ts` — Imports scaffold CSS, sets sandbox defaults (box-sizing, font, focus rings)
- `stories/env.d.ts` — Type declarations for global `Story`, `Variant`, `Hst*` components

### Integration tests

- `stories/__tests__/*.test.ts` — E2E-style flow tests using Vitest + jsdom + @vue/test-utils
- Included in the main test suite via `vitest.config.ts`

## Testing

Every component has a `.test.ts` file. Tests cover:

- Renders without errors
- Data attributes reflect props/state
- Emits fire with correct payloads
- Keyboard navigation
- ARIA attributes
- Slot rendering
- v-model updates
