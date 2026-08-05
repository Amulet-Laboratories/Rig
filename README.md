# @amulet-laboratories/rig

Headless, accessible Vue 3 component library. VSCode-style layout primitives, completely unstyled. Consumers supply all styling via CSS custom properties, Tailwind, or slot content — or drop in one of the 27 Hex themes that ship in the box.

## Status

**As of 2026-07-28.** Published and stable. `rig@3.0.0` and `rig-nuxt@0.6.6` live on npm.
The surface has settled — a few components a year get added, one or two removed.

**3.0.0 folded Hex into Rig.** `@amulet-laboratories/hex` was never a separate project — it
has always been a workspace package in this repo, and splitting the published artifacts only
meant the two could never move independently. The themes now ship under
`@amulet-laboratories/rig/hex/*`; the standalone package is deprecated on npm at 0.8.0. See
[MIGRATION.md](MIGRATION.md) — the change is a find-and-replace, and no theme names, token
names, or selectors moved.

The jump from 0.7.0 straight to 3.0.0 is deliberate, not a typo; see the note on version
lines below.

Rig is the load-bearing repository of the workspace: it is consumed by all seven content
network sites, AmuletLabs.org, and Obelisk. It is also the largest, at ~87,000 lines of
tracked source across the workspace's 270,000.

**Note on version lines.** `@amulet-laboratories/rig` also exists on _GitHub Packages_ at
2.x, consumed only by `vrd`. That is a separate registry and an unrelated version line —
do not try to reconcile the two numbers. The npm line starts at 3.0.0 specifically so it
sits clear of that 2.x line and no version number is ever ambiguous between the two.

Note also that this repo's **git tags run on their own line** from the package versions:
tag `v0.8.5` shipped `rig@0.7.0`. That is expected.

## Features

- **148 components** across 12 packages — core primitives, layout, navigation, editor, lists, menus, extras, shell, data visualization, spatial, temporal, and marketing-web. 143 are auto-importable from the root barrel; the 5 spatial components come from `@amulet-laboratories/rig/spatial`, because they need `d3`
- **Completely unstyled** — semantic HTML with `data-rig-*` attributes for styling hooks
- **Accessible by default** — ARIA roles, keyboard navigation, focus management
- **Slot-driven** — every visual element is customizable through typed named slots (`defineSlots`)
- **TypeScript strict** — full type safety with exported interfaces
- **Tree-shakeable** — `sideEffects: false`, ESM + CJS outputs

## Install

```bash
pnpm add @amulet-laboratories/rig
```

### Peer Dependencies

```bash
pnpm add vue@^3.5.0
# Required (breaking change in 0.2.0 — was optional in 0.1.0)
pnpm add @floating-ui/vue@^1.0.0
# Optional — required only if using the Icon component
pnpm add @iconify/vue@^4.0.0
# Optional — required only if you import from `rig/spatial` (MapCanvas,
# GlobeView, GraphNetwork, PointCloud, ScatterPlot3D)
pnpm add d3@^7.0.0
```

`dompurify` and `markdown-it` are ordinary dependencies and install with the package —
`renderMarkdown` is a synchronous export of `core`, so they were never optional in practice.

### Styling: two imports, not one

Rig ships **structure** and Hex ships **skin**, and you need both:

```ts
import '@amulet-laboratories/rig/styles' // layout, sizing, interaction
import '@amulet-laboratories/rig/hex/citron' // colour, type, borders — pick any theme
```

Without the first, components render as unstyled runs of inline text: `[data-rig-site-nav-links]`
computes `display: block` and breadcrumbs stack. Both imports are needed once, at the app root.

> **Upgrading from 0.1.0?** `@floating-ui/vue` is now a required peer dependency. See [MIGRATION.md](./MIGRATION.md) for details.

## Usage

```vue
<script setup lang="ts">
import { Button, Modal, TreeView } from '@amulet-laboratories/rig'
</script>

<template>
  <Button variant="primary" @click="open = true">Open</Button>

  <Modal v-model:open="open" aria-label="Example">
    <template #header>Title</template>
    <p>Modal content</p>
  </Modal>
</template>
```

### Subpackage imports (smaller bundles)

The root barrel re-exports every component. For projects that only need a slice — say, primitives + marketing-web bits — import from a subpackage instead. This skips the data / spatial / temporal trees entirely.

**`./spatial` is not re-exported from the root barrel**, deliberately: it imports `d3`, and a
re-export made the optional peer non-optional — every consumer without `d3` installed failed to
build, from a page with no graph on it. Import spatial components from `@amulet-laboratories/rig/spatial`.

```ts
// Just primitives — Button, Card, Badge, Avatar, Icon, etc.
import { Button, Card, Badge } from '@amulet-laboratories/rig/core'

// Marketing-site scaffolds — Hero, Section, SiteFooter, CTABanner, etc.
import { Hero, Section, SiteFooter } from '@amulet-laboratories/rig/web'

// Nav — Tabs, Breadcrumbs, Stepper, ActivityBar, etc.
import { Tabs, Breadcrumbs } from '@amulet-laboratories/rig/nav'
```

Available subpackage entries: `./core`, `./layout`, `./nav`, `./editor`, `./lists`, `./menus`, `./extras`, `./shell`, `./data`, `./spatial`, `./temporal`, `./web`. The root barrel (`@amulet-laboratories/rig`) still works and is fine for shell apps that use components across many packages.

## Packages

| Package      | Components | Description                                          |
| ------------ | ---------: | ---------------------------------------------------- |
| **core**     |         37 | Form controls, buttons, badges, primitives           |
| **layout**   |         12 | Structural containers, modals, panels, scroll areas  |
| **nav**      |         14 | Sidebars, tabs, breadcrumbs, pickers, navigation     |
| **editor**   |          6 | Code blocks, diff viewers, editor workspaces         |
| **lists**    |          4 | DataGrid, List, Table, TreeView                      |
| **menus**    |          6 | Command palette, context/dropdown menus, menubar     |
| **extras**   |         17 | Toasts, dialogs, calendar, kanban, feedback overlays |
| **shell**    |          8 | IDE-style shell pieces (chat, browser, search, etc.) |
| **data**     |         14 | Charts, sparklines, heatmaps, stat cards             |
| **spatial**  |          5 | Globes, graphs, maps, 3D scatter, point clouds       |
| **temporal** |          5 | Animation, particle fields, timeline scrubbers       |
| **web**      |         21 | Hero, Section, CTA, footer, marketing-site scaffolds |

## Composables

Rig exports **39 composables** across the packages. The most commonly used:

| Composable            | Description                                  |
| --------------------- | -------------------------------------------- |
| `useKeyboard`         | Declarative keyboard shortcut bindings       |
| `usePersistedState`   | Reactive state with localStorage persistence |
| `useGlobalState`      | Provided/injected global application state   |
| `useCommandRegistry`  | Command palette registry and execution       |
| `useTooltip`          | Tooltip state management                     |
| `useVirtualList`      | Windowed/virtualized list rendering          |
| `useFocusTrap`        | Focus trap for modals and overlays           |
| `useDragDrop`         | Drag-and-drop reordering                     |
| `useScrollVisibility` | Scroll-based element visibility detection    |
| `useParallax`         | Pointer/scroll-driven parallax transforms    |
| `useMediaPlayback`    | Reactive media playback state and controls   |
| `useReducedMotion`    | Detects `prefers-reduced-motion` media query |
| `usePlatform`         | Platform detection — returns `{ isMac }`     |

## Theming

Rig is unstyled by default. For a ready-made theme, import one — the Hex theme layer ships
inside the package, so there is nothing extra to install:

```ts
// Pick a theme — each is a single minified CSS bundle
import '@amulet-laboratories/rig/hex/cobalt'
import '@amulet-laboratories/rig/hex/garden'
import '@amulet-laboratories/rig/hex/spacewizard'
// …and 24 more
```

Each theme also ships as uncompiled source at `hex/<theme>/source`, for builds that run it
through their own Tailwind pass:

```css
@import '@amulet-laboratories/rig/hex/slate/source';
```

**27 themes** ship with Hex: beacon, brass, cardinal, citron, clover, cobalt, copper, cypress, damson, fern, forge, garden, greyline, harbor, hearth, iris, juniper, lagoon, ochre, orchid, quartz, roast, sienna, slate, spacewizard, vesper, voltaic. Each is a self-contained CSS bundle (typically 80–130 KB minified) targeting Rig's `data-rig-*` attributes. Switch themes by changing one import — every component re-skins on the next paint.

All tokens are overridable per-element or globally. CTA variants for example expose `--rig-button-cta-bg / -fg / -border / -shadow` so consumer sites can drop in their own brand color without overriding the selector.

## Styling

Components render semantic HTML with data attributes. Style them with CSS targeting those attributes:

```css
[data-rig-button] {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

[data-rig-button][data-variant='primary'] {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

[data-rig-button][data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Data Attribute Conventions

- **Root element:** `data-rig-{component-name}` (e.g., `data-rig-button`, `data-rig-tree`)
- **State:** `data-state`, `data-variant`, `data-disabled`, `data-loading`, `data-selected`, `data-highlighted`
- **Structural:** `data-depth`, `data-leaf`, `data-align`, `data-sort-direction`

## CLI

```bash
rig build-theme            # compile public/theme.css for the site in cwd
rig build-theme --site ../Beanwoven.com
```

`build-theme` compiles `hex/<theme>` + the opt-in `hex/shared/site` layer + the
site's `assets/css/site.css` + `rig/styles` into a single `public/theme.css`,
reading the theme codename from the site's `assets/css/main.css`. It is a
maintainer tool — `theme.css` is committed and is the only stylesheet the
consuming site loads.

It needs the PostCSS toolchain in the site, which rig deliberately does not
depend on:

```bash
pnpm add -D postcss postcss-import @tailwindcss/postcss cssnano
```

It will fall back to a copy found elsewhere and warn if it does. Take the
warning seriously: which copy of Tailwind runs changes what gets emitted.

## Development

```bash
pnpm install          # Install all workspace dependencies
pnpm build            # Vite library build (ESM + CJS + .d.ts) + all Hex CSS themes
pnpm build:hex        # Just the Hex CSS themes
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm check            # Lint + format + type-check
pnpm story:dev        # Histoire component stories dev server
```

`pnpm build` builds both halves of the package, because both are published: `dist/` from
Vite and `hex/dist/` from `hex/build.mjs`. Both are gitignored build output.

## License

[MIT](LICENSE)
