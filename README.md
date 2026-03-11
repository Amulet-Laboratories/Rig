# @amulet-laboratories/rig

Headless, accessible Vue 3 component library. VSCode-style layout primitives, completely unstyled. Consumers supply all styling via CSS custom properties, Tailwind, or slot content.

## Features

- **56 components** across 7 packages — core primitives, layout, navigation, editor, lists, menus, extras
- **Completely unstyled** — semantic HTML with `data-rig-*` attributes for styling hooks
- **Accessible by default** — ARIA roles, keyboard navigation, focus management
- **Slot-driven** — every visual element is customizable through named slots
- **TypeScript strict** — full type safety with exported interfaces
- **Tree-shakeable** — `sideEffects: false`, ESM + CJS outputs

## Install

```bash
pnpm add @amulet-laboratories/rig
```

### Peer Dependencies

```bash
pnpm add vue@^3.5.0
# Optional — required for Popover, ContextMenu, DropdownMenu positioning
pnpm add @floating-ui/vue@^1.0.0
```

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

| Package | Components | Description |
|---------|-----------|-------------|
| **core** | Button, Input, Select, Checkbox, Switch, Radio, RadioGroup, Toggle, ToggleGroup, Slider, Badge, Progress, Card, Divider, Kbd, Label, Icon, IconButton, InlineEditor, Resizer, TagInput, Combobox, Textarea | Primitive form controls and building blocks |
| **layout** | ShellGrid, SplitView, Panel, Modal, Collapsible, Accordion, Popover, ScrollArea, PeekView | Structural containers and overlays |
| **nav** | ActivityBar, SideBar, View, PanelBar, StatusBar, Breadcrumbs, Tabs | Navigation chrome |
| **editor** | EditorWorkbench, EditorTab | Editor workspace layout |
| **lists** | List, TreeView, Table | Data display components |
| **menus** | ContextMenu, CommandPalette, ActionBar, DropdownMenu, Menubar, KeyboardHint | Command and menu components |
| **extras** | Toast, EmptyState, Tooltip, Skeleton, PropertyGrid, NotificationCenter | Utility and feedback components |

## Composables

| Composable | Description |
|-----------|-------------|
| `useKeyboard` | Declarative keyboard shortcut bindings |
| `usePersistedState` | Reactive state with localStorage persistence |
| `useGlobalState` | Provided/injected global application state |
| `useCommandRegistry` | Command palette registry and execution |
| `useTooltip` | Tooltip state management |
| `useVirtualList` | Windowed/virtualized list rendering |

## Styling

Components render semantic HTML with data attributes. Style them with CSS targeting those attributes:

```css
[data-rig-button] {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

[data-rig-button][data-variant="primary"] {
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
pnpm install          # Install dependencies
pnpm build            # Vite library build (ESM + CJS + .d.ts)
pnpm test             # Run all 515 tests
pnpm test:watch       # Watch mode
pnpm typecheck        # vue-tsc --noEmit
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm story:dev        # Histoire dev server
```

## License

[MIT](LICENSE)
