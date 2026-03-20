# Hex — Development Guide

## What is Hex?

Hex is a multi-theme CSS layer for Rig. It ships pure CSS that styles Rig's headless `data-rig-*` selectors with four curated themes — Hexrig, VSCode, Spotify, and Gmail. Each theme is a single CSS bundle. Consumers hot-swap themes by loading a different CSS file.

## Architecture

```
src/
  index.css                          default entry (imports themes/hexrig/index.css)
  shared/
    a11y.css                         forced-colors + prefers-contrast overrides
    components/
      core.css                       Button, Input, Select, Textarea, Checkbox, Switch,
                                     Radio, Badge, Progress, Card, Divider, Kbd, TagInput,
                                     Combobox, Tooltip, Skeleton, PropertyGrid, InlineEditor
      layout.css                     ShellGrid, Sidebar, View, Panel, Modal, Resizer,
                                     Accordion, Collapsible, Popover, PeekView, ScrollArea
      nav.css                        ActivityBar, PanelBar, StatusBar, Breadcrumbs, Tabs
      editor.css                     EditorWorkbench, EditorTab
      lists.css                      List, TreeView, Table
      menus.css                      CommandPalette, ContextMenu, ActionBar, KeyboardHint,
                                     DropdownMenu, Menubar
      extras.css                     Toast, EmptyState, NotificationCenter
      shell.css                      IdeShell
      data.css                       Sparkline, MiniBar, StatCard, BarChart, LineChart,
                                     AreaChart, ScatterPlot, Heatmap, RadarChart, Treemap,
                                     SankeyDiagram
      spatial.css                    MapCanvas, GlobeView, ScatterPlot3D, GraphNetwork,
                                     PointCloud
      temporal.css                   TimelineScrubber, AnimatedChart, PlaybackControls,
                                     TemporalHeatmap, ParticleField
  themes/
    hexrig/                          dark — slate (#121417) & teal (#5ea9a2)
      index.css                      entry: tailwindcss + tokens + base + components + domains
      tokens.css                     @theme + :root tokens
      base.css                       html/body reset, scrollbar, focus, selection
      components.css                 imports shared/components/* + @reference tokens
      domains.css                    domain accents + responsive breakpoints
    vscode/                          dark — gray (#1f1f1f) & blue (#0078d4)
      index.css / tokens.css / base.css / components.css / domains.css
    spotify/                         dark — near-black (#121212) & green (#1db954)
      index.css / tokens.css / base.css / components.css / domains.css
    gmail/                           light — white (#ffffff) & Google blue (#1a73e8)
      index.css / tokens.css / base.css / components.css / domains.css
```

## Themes

| Theme       | Mode  | Background           | Primary                | Feel                           | Sans        | Mono           |
| ----------- | ----- | -------------------- | ---------------------- | ------------------------------ | ----------- | -------------- |
| **Hexrig**  | Dark  | `#121417` slate      | `#5ea9a2` teal         | Lab default, neutral developer | Inter       | JetBrains Mono |
| **VSCode**  | Dark  | `#1f1f1f` dark gray  | `#0078d4` VS Code blue | IDE faithful                   | System      | SF Mono        |
| **Spotify** | Dark  | `#121212` near-black | `#1db954` green        | Music streaming                | Circular    | Fira Code      |
| **Gmail**   | Light | `#ffffff` white      | `#1a73e8` Google blue  | Material                       | Google Sans | Roboto Mono    |

```js
// Import themes
import '@amulet-laboratories/hex' // default (hexrig dark)
import '@amulet-laboratories/hex/vscode' // vscode dark
import '@amulet-laboratories/hex/spotify' // spotify dark
import '@amulet-laboratories/hex/gmail' // gmail light
```

## Token API

### Theme-dependent (~22 per theme, declared in `tokens.css`)

Each theme defines tokens in two blocks — `@theme` (for Tailwind v4 utility generation) and `:root` (for direct `var()` access):

**Surface (12):** `--color-background`, `--color-foreground`, `--color-card`, `--color-card-foreground`, `--color-popover`, `--color-popover-foreground`, `--color-secondary`, `--color-secondary-foreground`, `--color-muted`, `--color-muted-foreground`, `--color-accent`, `--color-accent-foreground`

**Brand (2):** `--color-primary`, `--color-primary-foreground`

**Status (3):** `--color-success`, `--color-warning`, `--color-info`

**Destructive (2):** `--color-destructive`, `--color-destructive-foreground`

**Borders (3):** `--color-border`, `--color-input`, `--color-ring`

**Typography (2):** `--font-sans`, `--font-mono`

**Radius (1):** `--radius`

The `:root` block mirrors each `@theme` token with shorthand names (`--background`, `--foreground`, `--card`, etc.) for use in non-Tailwind CSS via `var(--background)`.

## File-per-package rule

Each file in `src/shared/components/` maps 1:1 to a Rig package. When a new component is added to Rig's `menus` package, its styles go in `components/menus.css`.

## Adding new themes

To add a theme:

1. Create `src/themes/{name}/` with 5 files: `index.css`, `tokens.css`, `base.css`, `components.css`, `domains.css`
2. In `tokens.css`, define the full `@theme` + `:root` token set (copy an existing theme)
3. In `base.css`, set `color-scheme: dark` or `color-scheme: light` matching the theme mode
4. In `components.css`, import `../../shared/components/*.css` + `@reference './tokens.css'`
5. In `index.css`, import `tailwindcss` + tokens + base + components + domains
6. Add exports to `package.json` (default + source paths)
7. Add theme name to the `themes` array in `build.mjs`
8. Run `pnpm build && pnpm test`

## Styling conventions

- **Selector pattern**: `[data-rig-{component}]` for roots, `[data-rig-{component}-{part}]` for sub-parts
- **State selectors**: `[data-variant="..."]`, `[data-state="..."]`, `[data-disabled]`, `[data-active]`, `[data-checked]`
- **Tailwind utilities**: Component CSS uses `@apply bg-background text-foreground` etc., resolved against `@theme` tokens
- **CSS custom properties**: Also accessible as `var(--background)`, `var(--foreground)`, etc. from `:root`
- **No class names**: Never generate or assume class names on Rig components
- **No JavaScript**: Hex is CSS-only — no JS exports

## Domain accent system

Components reference `var(--domain-accent, var(--color-primary))` for contextual accent colors. Consumer apps set `--domain-accent` per `[data-domain]` attribute. Each theme's `domains.css` defines default domain colors.

## Code style

- 2-space indent
- No semicolons in build scripts
- Single quotes in build scripts
- CSS files use standard formatting

## Build

```bash
pnpm build        # PostCSS (Tailwind v4 + cssnano) → dist/ (all themes, minified)
pnpm dev          # watch mode
pnpm test         # build + validate output (17 tests)
pnpm lint         # ESLint
pnpm lint:css     # Stylelint
pnpm format       # Prettier
```

Outputs:

- `dist/hex.css` — default bundle (hexrig)
- `dist/hexrig.css` — hexrig dark
- `dist/vscode.css` — vscode dark
- `dist/spotify.css` — spotify dark
- `dist/gmail.css` — gmail light
