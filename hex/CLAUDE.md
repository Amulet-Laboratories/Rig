# Hex — Development Guide

## What is Hex?

Hex is the visual layer for Rig. It ships pure CSS that styles Rig's headless `data-rig-*` selectors across multiple curated themes. Each theme is a single CSS bundle. Consumers hot-swap themes by loading a different CSS file.

## Composition Boundary

Hex is the ONLY place visual styling decisions are made. Consumer sites should never need `style=` attributes or arbitrary Tailwind values to use Rig components correctly.

**If a consumer site needs an inline style to make a component look right, the fix belongs in Hex — not in the site.** This means:

- Every background, color, border, and font decision lives in Hex token definitions or component CSS
- Component sub-parts (utility bars, footer columns, accent bars) get their visual treatment from `[data-rig-*]` selectors in Hex, not from consumer-side `style=`
- Theme-specific overrides (e.g., undertow's footer using card bg instead of primary) are expressed as CSS custom property overrides in the theme's `tokens.css`, not in consumer markup
- Scoped theme tokens (`[data-hex-theme="name"]`) live in Hex and are imported once at the site level — never per-page or per-component

## Architecture

```
src/
  index.css                          default entry (imports themes/cobalt/index.css)
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
      prose.css                      markdown/prose typography (data-rig-prose)
      web.css                        marketing-web (Hero, Section, SiteNav, PricingCard,
                                     SectionDivider, FlankedHeading, ContactForm, …)
      content.css                    authority-site content layer (ProductCard, ArticleHeader,
                                     Callout, FAQ, affiliate, TOC, related, network footer, …)
  themes/
    {name}/                          one directory per theme — 27 total (default: cobalt)
      index.css                      entry: tailwindcss + tokens + base + components + domains
      tokens.css                     @theme + :root tokens
      base.css                       html/body reset, scrollbar, focus, selection
      components.css                 imports shared/components/* + @reference tokens
      domains.css                    domain accents + responsive breakpoints
  scoped/                            scoped-theme variants ([data-hex-theme="name"] scope)
```

## Themes

**27 curated themes**, one directory each under `src/themes/`. The default (the
`.` / `dist/hex.css` bundle, and `src/index.css`) is **cobalt**. Each theme is a
single self-contained CSS bundle; consumers hot-swap by loading a different file.

Roster (see [README.md](./README.md) for one-line palette summaries):
`cobalt` · `garden` · `spacewizard` · `greyline` · `cypress` · `iris` ·
`lagoon` · `ochre` · `orchid` · `vesper` · `harbor` · `copper` · `cardinal` ·
`clover` · `sienna` · `hearth` · `juniper` · `forge` · `citron` · `voltaic` ·
`quartz` · `fern` · `roast` · `damson` · `brass` · `slate` · `beacon`

The `themes` array in `build.mjs` is the source of truth for what gets built;
`package.json` `exports` mirrors it (`./{name}` → built `dist/{name}.css`,
`./{name}/source` → `src/themes/{name}/index.css`).

```js
// Import a theme (built bundle or raw source)
import '@amulet-laboratories/hex' // default (cobalt), built
import '@amulet-laboratories/hex/garden' // a specific theme, built
import '@amulet-laboratories/hex/garden/source' // raw source (for Vite/Tailwind pipelines)
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

- `dist/hex.css` — default bundle (cobalt)
- `dist/{name}.css` — one minified bundle per theme (27 total: `cobalt`, `garden`, `roast`, `damson`, …)
- `dist/scoped.css` — scoped-theme bundle (`[data-hex-theme="name"]`)

`dist/` is gitignored and rebuilt from source; the `prepare` script runs
`build.mjs` on install and before publish, so the built CSS always exists for
consumers (this is what lets sibling repos read `../Rig/hex/dist/*.css` without a
manual build step).
