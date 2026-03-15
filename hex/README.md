# Hex

> Multi-theme CSS layer for [Rig](https://github.com/Amulet-Laboratories/rig) — curated palettes targeting `data-rig-*` selectors

Hex ships pure CSS — no JavaScript, no runtime. It styles Rig's headless components with four curated themes. Swap themes by loading a different CSS file.

## Themes

| Theme | Mode | Background | Primary | Feel |
|-------|------|-----------|---------|------|
| **Hexrig** | Dark | `#121417` slate | `#5ea9a2` teal | Lab default, neutral developer |
| **VSCode** | Dark | `#1f1f1f` gray | `#0078d4` blue | IDE faithful |
| **Spotify** | Dark | `#121212` near-black | `#1db954` green | Music streaming |
| **Gmail** | Light | `#ffffff` white | `#1a73e8` blue | Material |

## Install

```bash
pnpm add @amulet-laboratories/hex
```

## Usage

Import a single theme bundle (tokens + base + component styles):

```ts
import '@amulet-laboratories/hex'             // default (hexrig)
import '@amulet-laboratories/hex/vscode'       // vscode dark
import '@amulet-laboratories/hex/spotify'      // spotify dark
import '@amulet-laboratories/hex/gmail'        // gmail light
```

Or import source files for custom PostCSS builds:

```ts
import '@amulet-laboratories/hex/hexrig/source'
import '@amulet-laboratories/hex/vscode/source'
import '@amulet-laboratories/hex/spotify/source'
import '@amulet-laboratories/hex/gmail/source'
```

## Architecture

```
src/
  index.css                     default entry (imports hexrig)
  shared/
    a11y.css                    forced-colors + prefers-contrast overrides
    components/
      core.css                  Button, Input, Select, Textarea, Checkbox, Switch,
                                Radio, Badge, Progress, Card, Divider, Kbd, TagInput,
                                Combobox, Tooltip, Skeleton, PropertyGrid, InlineEditor
      layout.css                ShellGrid, Sidebar, View, Panel, Modal, Resizer,
                                Accordion, Collapsible, Popover, PeekView, ScrollArea
      nav.css                   ActivityBar, PanelBar, StatusBar, Breadcrumbs, Tabs
      editor.css                EditorWorkbench, EditorTab
      lists.css                 List, TreeView, Table
      menus.css                 CommandPalette, ContextMenu, ActionBar, KeyboardHint,
                                DropdownMenu, Menubar
      extras.css                Toast, EmptyState, NotificationCenter
      shell.css                 IdeShell
      data.css                  Sparkline, MiniBar, StatCard, charts, diagrams
      spatial.css               MapCanvas, GlobeView, ScatterPlot3D, GraphNetwork
      temporal.css              TimelineScrubber, AnimatedChart, PlaybackControls
  themes/
    {hexrig,vscode,spotify,gmail}/
      index.css                 full bundle entry
      tokens.css                @theme block + :root custom properties
      base.css                  html/body, scrollbar, focus, selection, transitions
      components.css            barrel importing all shared component CSS
      domains.css               [data-domain] accent map, responsive, unstyled reset
```

## Styling contract

Hex targets Rig's data-attribute API:

| Selector pattern | Example |
|---|---|
| `[data-rig-{component}]` | `[data-rig-button]` |
| `[data-rig-{component}-{part}]` | `[data-rig-toast-dismiss]` |
| `[data-{state}]` | `[data-variant="primary"]`, `[data-disabled]` |

No class names are assumed or generated. Consumers can layer additional styles on top.

## Design tokens

Each theme defines a shadcn-compatible token contract in `@theme` (Tailwind v4) and `:root` (vanilla CSS):

**Surface:** `--color-background`, `--color-foreground`, `--color-card`, `--color-popover`, `--color-secondary`, `--color-muted`, `--color-accent` (+ foreground variants)

**Brand:** `--color-primary`, `--color-primary-foreground`

**Status:** `--color-success`, `--color-warning`, `--color-info`, `--color-destructive`

**Borders:** `--color-border`, `--color-input`, `--color-ring`

**Layout:** `--radius`, `--font-sans`, `--font-mono`

## Accessibility

- `prefers-reduced-motion: reduce` disables all animations and transitions
- Custom `focus-visible` outlines for keyboard navigation
- `forced-colors` and `prefers-contrast` overrides in `shared/a11y.css`
- Firefox native scrollbar styling via `scrollbar-width` and `scrollbar-color`

## Build

```bash
pnpm build        # PostCSS (Tailwind v4 + cssnano) → dist/ (minified)
pnpm dev          # Watch mode
pnpm test         # Build + validate output (17 tests)
pnpm lint         # ESLint
pnpm lint:css     # Stylelint
pnpm format       # Prettier
```

## License

MIT