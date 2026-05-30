# Hex

> Multi-theme CSS layer for [Rig](https://github.com/Amulet-Laboratories/rig) — 27 curated palettes targeting `data-rig-*` selectors.

Pure CSS — no JavaScript, no runtime. Hex styles Rig's headless components with a token-based contract. Swap themes by changing one import.

## Install

```bash
pnpm add @amulet-laboratories/hex
```

## Themes

Twenty-seven themes ship in a single package. Each is a self-contained CSS bundle (~80–130 KB minified). Import the one you want — every Rig component re-skins to the new tokens on the next paint.

| Theme         | Mode  | Feel                                   |
| ------------- | ----- | -------------------------------------- |
| `beacon`      | Dark  | Cobalt-adjacent, distinct primary      |
| `brass`       | Light | Warm metallic neutrals                 |
| `cardinal`    | Dark  | Saturated red on near-black            |
| `citron`      | Light | High-contrast yellow-green             |
| `clover`      | Light | Sage green on cream                    |
| `cobalt`      | Dark  | VSCode Dark Modern — mapped 1:1        |
| `copper`      | Dark  | Burnt orange on charcoal               |
| `cypress`     | Light | Coastal-soft, ocean greens + sand      |
| `damson`      | Dark  | Deep plum on dusk                      |
| `fern`        | Light | Forested mid-tones                     |
| `forge`       | Dark  | Iron + ember accent                    |
| `garden`      | Light | Lab default — neutral developer        |
| `greyline`    | Dark  | Achromatic with single accent          |
| `harbor`      | Dark  | Slate + soft teal                      |
| `hearth`      | Dark  | Espresso brown + crema gold            |
| `iris`        | Light | Institutional cool — paper white + ink |
| `juniper`     | Dark  | Forest green on charcoal               |
| `lagoon`      | Dark  | Noir steel — gold accent               |
| `ochre`       | Light | Earth-pigment neutrals                 |
| `orchid`      | Light | Magenta-on-white art aesthetic         |
| `quartz`      | Light | Cool minimal — pale stone              |
| `roast`       | Light | Warm parchment — coffee-shop legible   |
| `sienna`      | Light | Warm community — sienna + slate        |
| `slate`       | Light | Cool grey neutrals                     |
| `spacewizard` | Dark  | Cosmic violet + electric accent        |
| `vesper`      | Dark  | Evening-warm — soft lavender + amber   |
| `voltaic`     | Dark  | Deep navy + phosphor green             |

## Usage

Import a single theme bundle (tokens + base + component styles):

```ts
import '@amulet-laboratories/hex/cobalt'
import '@amulet-laboratories/hex/garden'
import '@amulet-laboratories/hex/spacewizard'
```

Source files (uncompiled) are available at `{theme}/source` for custom PostCSS / Tailwind v4 builds:

```ts
import '@amulet-laboratories/hex/cobalt/source'
```

Building a custom theme outside this package? Import the shared component CSS individually:

```ts
import '@amulet-laboratories/hex/shared/rig-defaults'
import '@amulet-laboratories/hex/shared/components/core'
import '@amulet-laboratories/hex/shared/components/web'
// …pick whichever Rig sub-packages your app uses
import '@amulet-laboratories/hex/shared/a11y'
```

## Architecture

```
src/
  index.css                     default entry (imports the default theme)
  shared/
    a11y.css                    forced-colors + prefers-contrast overrides
    rig-defaults.css            baseline data-rig-* defaults (theme-agnostic)
    components/
      core.css                  Button, Input, Select, Card, Badge, …
      layout.css                ShellGrid, Sidebar, Modal, Popover, …
      nav.css                   ActivityBar, Tabs, Breadcrumbs, …
      editor.css                EditorWorkbench, EditorTab
      lists.css                 List, TreeView, Table, DataGrid
      menus.css                 CommandPalette, ContextMenu, …
      extras.css                Toast, EmptyState, NotificationCenter, …
      shell.css                 IdeShell + ChatPanel, FileBrowser, etc.
      data.css                  Sparkline, MiniBar, StatCard, charts
      spatial.css               GraphNetwork, GlobeView, MapCanvas, …
      temporal.css              TimelineScrubber, AnimatedChart, …
      web.css                   SiteShell, Hero, Section, CTABanner, …
      prose.css                 markdown / longform content styles
      content.css               higher-level content surfaces
  themes/
    {beacon, brass, cardinal, …, voltaic}/
      index.css                 full bundle entry
      tokens.css                @theme block + :root custom properties
      base.css                  html/body, scrollbar, focus, selection
      components.css            barrel importing all shared component CSS
      domains.css               [data-domain] accent map
```

## Styling contract

Hex targets Rig's data-attribute API:

| Selector pattern                | Example                                       |
| ------------------------------- | --------------------------------------------- |
| `[data-rig-{component}]`        | `[data-rig-button]`                           |
| `[data-rig-{component}-{part}]` | `[data-rig-toast-dismiss]`                    |
| `[data-{state}]`                | `[data-variant="primary"]`, `[data-disabled]` |

No class names are assumed or generated. Consumers can layer additional styles on top.

## Design tokens

Each theme defines a shadcn-compatible token contract in `@theme` (Tailwind v4) and `:root` (vanilla CSS):

- **Surface** — `--color-background`, `--color-foreground`, `--color-card`, `--color-popover`, `--color-secondary`, `--color-muted`, `--color-accent` (plus `-foreground` variants)
- **Brand** — `--color-primary`, `--color-primary-foreground`
- **Status** — `--color-success`, `--color-warning`, `--color-info`, `--color-destructive`
- **Borders** — `--color-border`, `--color-input`, `--color-ring`
- **Layout** — `--radius`, `--font-sans`, `--font-mono`, `--font-display`

Component-specific token hooks (e.g. `--rig-button-bg`, `--rig-button-cta-bg`, `--rig-card-accent`) let consumers override one slot without overriding the whole selector.

## Accessibility

- `prefers-reduced-motion: reduce` disables all animations and transitions
- Custom `focus-visible` outlines for keyboard navigation
- `forced-colors` and `prefers-contrast` overrides in `shared/a11y.css`
- Firefox-native scrollbar styling via `scrollbar-width` and `scrollbar-color`

## Build

```bash
pnpm build        # PostCSS (Tailwind v4 + cssnano) → dist/ (minified)
pnpm dev          # Watch mode
pnpm test         # Build + validate output
pnpm lint         # ESLint
pnpm lint:css     # Stylelint
pnpm format       # Prettier
```

## License

MIT
