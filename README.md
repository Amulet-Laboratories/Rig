# @amulet-laboratories/rig

Headless, accessible Vue 3 component library. VSCode-style layout primitives, completely unstyled. Consumers supply all styling via CSS custom properties, Tailwind, or slot content.

## Features

- **92 components** across 11 packages — core primitives, layout, navigation, editor, lists, menus, extras, shell, data visualization, spatial, temporal
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

| Package      | Components                                                                                                                                                                                                                                                                      | Description                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **core**     | Avatar, AvatarGroup, Badge, Button, Card, Checkbox, Combobox, Divider, Dot, Icon, InlineEditor, Input, Kbd, Label, Progress, ProgressRing, PulseIndicator, RadioGroup, RangeSlider, Resizer, Select, Slider, Switch, TagInput, Textarea, ToggleGroup | 26 primitive form controls and building blocks |
| **layout**   | Accordion, Collapsible, Modal, Panel, PeekView, Popover, ResizablePanel, ScrollArea, ShellGrid, SplitView                                                                                                                                                                       | 10 structural containers and overlays          |
| **nav**      | ActivityBar, Breadcrumbs, DatePicker, DateRangePicker, PanelBar, SideBar, StatusBar, Stepper, Tabs, Timeline, View                                                                                                                                                              | 11 navigation chrome components                |
| **editor**   | CodeBlock, ColorPicker, DiffViewer, EditorTab, EditorWorkbench                                                                                                                                                                                                                  | 5 editor workspace components                  |
| **lists**    | DataGrid, List, Table, TreeView                                                                                                                                                                                                                                                 | 4 data display components                      |
| **menus**    | ActionBar, CommandPalette, ContextMenu, DropdownMenu, KeyboardHint, Menubar                                                                                                                                                                                                     | 6 command and menu components                  |
| **extras**   | CalendarGrid, EmptyState, KanbanBoard, NotificationCenter, PropertyGrid, Skeleton, Toast, Tooltip                                                                                                                                                                               | 8 utility and feedback components              |
| **shell**    | IdeShell                                                                                                                                                                                                                                                                        | 1 pre-composed VSCode-style IDE layout         |
| **data**     | AreaChart, BarChart, Heatmap, LineChart, MiniBar, RadarChart, SankeyDiagram, ScatterPlot, Sparkline, StatCard, Treemap                                                                                                                                                          | 11 data visualization components               |
| **spatial**  | GlobeView, GraphNetwork, MapCanvas, PointCloud, ScatterPlot3D                                                                                                                                                                                                                   | 5 spatial visualization components             |
| **temporal** | AnimatedChart, ParticleField, PlaybackControls, TemporalHeatmap, TimelineScrubber                                                                                                                                                                                               | 5 temporal and animation components            |

## Composables

| Composable           | Description                                  |
| -------------------- | -------------------------------------------- |
| `useKeyboard`        | Declarative keyboard shortcut bindings       |
| `usePersistedState`  | Reactive state with localStorage persistence |
| `useGlobalState`     | Provided/injected global application state   |
| `useCommandRegistry` | Command palette registry and execution       |
| `useTooltip`         | Tooltip state management                     |
| `useVirtualList`     | Windowed/virtualized list rendering          |
| `useFocusTrap`       | Focus trap for modals and overlays           |
| `useDragDrop`        | Drag-and-drop reordering                     |

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
pnpm install          # Install dependencies
pnpm build            # Vite library build (ESM + CJS + .d.ts)
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm dev              # Demo dev server + library watch
pnpm check            # Lint + format + type-check
pnpm health           # Full health pipeline
```

## License

[MIT](LICENSE)
