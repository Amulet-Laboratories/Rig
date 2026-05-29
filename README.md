# @amulet-laboratories/rig

Headless, accessible Vue 3 component library. VSCode-style layout primitives, completely unstyled. Consumers supply all styling via CSS custom properties, Tailwind, or slot content.

## Features

- **149 components** across 12 packages — core primitives, layout, navigation, editor, lists, menus, extras, shell, data visualization, spatial, temporal, and marketing-web
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
```

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

The root barrel re-exports every component. For projects that only need a slice — say, primitives + marketing-web bits — import from a subpackage instead. This skips the data / spatial / temporal trees and their optional peer deps (`d3`, `markdown-it`, `dompurify`) entirely.

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

Rig is unstyled by default. For a ready-made theme, install the companion CSS package:

```bash
pnpm add @amulet-laboratories/hex
```

```ts
// Pick a theme — each is a single minified CSS bundle
import '@amulet-laboratories/hex/cobalt'
import '@amulet-laboratories/hex/garden'
import '@amulet-laboratories/hex/spacewizard'
// …and 24 more
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

## Development

```bash
pnpm install          # Install all workspace dependencies
pnpm build            # Vite library build (ESM + CJS + .d.ts)
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm check            # Lint + format + type-check
pnpm story:dev        # Histoire component stories dev server
cd hex && pnpm build  # Build all Hex CSS themes
```

## License

[MIT](LICENSE)
