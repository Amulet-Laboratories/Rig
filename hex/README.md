# Hex

> Multi-theme CSS layer for [Rig](https://github.com/Amulet-Laboratories/rig) — 27 curated palettes targeting `data-rig-*` selectors.

Pure CSS — no JavaScript, no runtime. Hex styles Rig's headless components with a token-based contract. Swap themes by changing one import.

## Status — shipped inside Rig, not installed separately

**As of 2026-07-28.** Hex is no longer published on its own. As of `rig@3.0.0` it ships
inside `@amulet-laboratories/rig` under the `hex/` subpath, and
`@amulet-laboratories/hex` is deprecated on npm at its final version, 0.8.0.

The fold itself changed nothing about the themes — same names, same tokens, same selectors.
Only the specifier moved. See [../MIGRATION.md](../MIGRATION.md).

The same release does carry real theme changes, made alongside it: the site layer was
extracted (see below), `beacon` and `voltaic` were repaired, and `forge` and `voltaic` were
re-cut. Those are listed in [CHANGELOG.md](CHANGELOG.md).

This directory remains the source of record for the theme layer, and is still where theme
work happens; it is simply built and published as part of Rig now.

## Install

```bash
pnpm add @amulet-laboratories/rig
```

Then import a theme by its subpath — `@amulet-laboratories/rig/hex/<theme>` for the
compiled bundle, or `@amulet-laboratories/rig/hex/<theme>/source` for the uncompiled
source.

## Themes

Twenty-seven themes ship in a single package. Each is a self-contained CSS bundle (~80–130 KB minified). Import the one you want — every Rig component re-skins to the new tokens on the next paint.

| Theme         | Mode  | Feel                                   |
| ------------- | ----- | -------------------------------------- |
| `beacon`      | Dark  | LCARS — peach on pure black            |
| `brass`       | Light | Warm metallic neutrals                 |
| `cardinal`    | Dark  | Saturated red on near-black            |
| `citron`      | Light | High-contrast yellow-green             |
| `clover`      | Light | Sage green on cream                    |
| `cobalt`      | Dark  | VSCode Dark Modern — mapped 1:1        |
| `copper`      | Dark  | Burnt orange on charcoal               |
| `cypress`     | Light | Coastal-soft, ocean greens + sand      |
| `damson`      | Dark  | Deep plum on dusk                      |
| `fern`        | Light | Forested mid-tones                     |
| `forge`       | Dark  | Cockpit CRT — magenta phosphor         |
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
| `voltaic`     | Dark  | Arc chartreuse on graphite             |

## Usage

Import a single theme bundle (tokens + base + component styles):

```ts
import '@amulet-laboratories/rig/hex/cobalt'
import '@amulet-laboratories/rig/hex/garden'
import '@amulet-laboratories/rig/hex/spacewizard'
```

Source files (uncompiled) are available at `{theme}/source` for custom PostCSS / Tailwind v4 builds:

```ts
import '@amulet-laboratories/rig/hex/cobalt/source'
```

Building a custom theme outside this package? Import the shared component CSS individually:

```ts
import '@amulet-laboratories/rig/hex/shared/rig-defaults'
import '@amulet-laboratories/rig/hex/shared/components/core'
import '@amulet-laboratories/rig/hex/shared/components/web'
// …pick whichever Rig sub-packages your app uses
import '@amulet-laboratories/rig/hex/shared/a11y'
```

## Architecture

```
src/
  index.css                     default entry (imports the default theme)
  shared/
    a11y.css                    forced-colors + prefers-contrast overrides
    rig-defaults.css            baseline data-rig-* defaults (theme-agnostic)
    site.css                    OPT-IN content-site layer — see below
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
      domains.css               [data-domain] accent map (most themes)
```

## The site layer

`shared/site.css` is the long-form content-site skin — fluid typography, hero,
cards, prose, newsletter CTA, footer, nav. It is **opt-in**: no theme imports it,
and it is not in any theme bundle. A site imports it explicitly and supplies its
own `[data-category]` accent map plus any of the documented `--site-*` overrides.

It exists because six themes (`slate`, `roast`, `fern`, `quartz`, `damson`,
`brass`) each carried a ~730-line `domains.css` that was really this same site
skin, copied. The six were 96% identical — 4,392 lines where 335 were unique.
Extracting it on 2026-07-28 removed ~13.4 KB from each of those six bundles and
left all 27 themes general-purpose, which is what they claim to be.

```css
@import '@amulet-laboratories/rig/hex/slate/source';
@import '@amulet-laboratories/rig/hex/shared/site';
/* then your own [data-category] map and --site-* overrides */
```

The layer is plain CSS, but compile it with the theme's `tokens.css`
`@reference`'d if you want Tailwind's paired `@supports (color: color-mix(…))`
fallbacks for browsers without `color-mix`.

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
