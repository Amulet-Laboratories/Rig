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
import '@amulet-laboratories/hex' // Hexrig dark (default)
import '@amulet-laboratories/hex/vscode' // VSCode dark
import '@amulet-laboratories/hex/spotify' // Spotify dark
import '@amulet-laboratories/hex/gmail' // Gmail light
```

Hex targets Rig's `data-rig-*` attributes using CSS custom properties. All tokens are overridable per-element or globally.

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
