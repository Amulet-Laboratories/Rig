# Changelog

All notable changes to `@amulet-laboratories/rig` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.4.1] — 2026-08-02

### Fixed

- **`quartz`, `fern` and `brass` failed WCAG AA on the site nav and on primary buttons.** The failing selectors are Rig's, but the failing values were the themes': `[data-rig-site-nav-link][data-active]` resolves to `--color-primary` on `--color-secondary`, a harder pair than primary on the page background, and it read 2.53–2.84 across the three. White button labels were failing too, at 2.98–3.32, and had not been reported at all. Each primary is darkened by the minimal hue-preserving amount that clears 4.5 with headroom, and each `--rig-button-hover-bg` moves down with it so hover feedback stays darker than the button. `brass`'s `--color-muted-foreground` is untouched — 4.61 already passes. `roast`, `damson` and `slate` were already compliant and are unchanged.

  **This changes the look of three themes.** Consuming sites will see a darker primary in buttons, links, focus rings and the active nav item.

### Added

- **`hex/contrast.test.mjs`** — asserts WCAG AA over the design tokens for the seven themes in production use, on the four pairs the shared CSS actually composes. A contrast ratio is arithmetic over two hex values, so it needs no browser; the failures above survived precisely because contrast was only ever checked by rendering a page and running axe, which reaches one theme, in one colour scheme, on whatever pages get crawled. It also reports — without failing — 13 AA failures across the twenty themes nobody ships, worst being `garden` (1.63) and `beacon` (1.95).

## [3.4.0] — 2026-08-02

### Added

- **Era cursors, window drag and sound complete the museum's material vocabulary.** New tokens: `--m-cursor`, `--m-cursor-text`, `--m-cursor-busy`, `--m-cursor-link`, `--m-cursor-move`, and `--m-drag-outline`. Pre-compositing eras get 1-bit SVG pointers with explicit hotspots, and dragging a window tracks a wireframe outline that only commits on release — as it did when redrawing a window at pointer speed was unaffordable. Additive; every token is read with a fallback, so the 27 palette themes are unaffected.

### Fixed

- **The `citron` theme did not import Hex's `content.css`.** It was the only content-consuming theme missing the barrel, so QuizSort — which uses the content layer exactly as the six affiliate sites do — got no styling for `ProductCard`, `ArticleHeader`, `Callout`, FAQ, TOC or the affiliate blocks. The bundle grows 130.6 KB → 151.3 KB, which is the content skin arriving.

## [3.3.0] — 2026-08-02

### Added

- **The Museum of User Interfaces** — an exhibit at `/hexrig/demos/museum` where eight
  historical interfaces, 1984 to 2025, are rendered from unmodified Rig components and
  operated rather than looked at. See [docs/MUSEUM-ROADMAP.md](docs/MUSEUM-ROADMAP.md).
- **A material token layer for Hex.** Hex's theme tokens answer "what colour is it"; the
  new `--m-*` tokens answer "what is it made of" — bevel, elevation, density, texture,
  motion, control geometry. Scoped to `[data-hex-era]` so several periods can render on one
  page. The 27 palette themes never import it and are unaffected.
- **`ScrollArea` steppers.** Optional arrow buttons with the two-stage auto-repeat every
  platform scrollbar uses, a `step` prop, per-direction glyph slots, and `stepperPlacement`
  for traditions that group both arrows at one end (NeXTSTEP, Mac OS 8) rather than
  splitting them.

### Fixed

- **`ScrollArea`'s thumb could not be dragged.** It responded to keyboard only; there was no
  pointer handling at all, and clicking the trough did nothing. Both now work.
- **Demo deep links served the wrong app.** `netlify.toml` had SPA fallbacks for the story
  site and the landing page but none for `/hexrig/demos/*`, so any direct hit or refresh on
  a demo route fell through to `/hexrig/*` and returned the landing page's `index.html`.
  This affected all 13 example sites and went unnoticed because navigating in from the
  gallery never asks the server.
- **`pnpm lint` reported ~1350 phantom errors locally.** In ESLint flat config a bare
  `dist/` ignores only the root directory, so `demos/dist/` was linted whenever it had been
  built. Invisible in CI, which lints without building.

## [3.2.0] — 2026-07-31

Shipped by tag `v0.9.4`. The change was in the theme layer — contrast-safe accent tokens
separated from the display accent. See [hex/CHANGELOG.md](hex/CHANGELOG.md).

## [3.1.0] — 2026-07-31

Shipped by tag `v0.9.3`. The change was in the Nuxt module — `/best-for` crashed in every
browser on all six content sites. See [nuxt/CHANGELOG.md](nuxt/CHANGELOG.md).

## [3.0.0] — 2026-07-28

Shipped by tag `v0.9.0`.

### Added

- **A `rig` CLI, with one command: `rig build-theme`.** Compiles a site's `public/theme.css` from `hex/<theme>` + the opt-in `hex/shared/site` layer + the site's own `assets/css/site.css` + `rig/styles`. Each of the six affiliate sites carried its own 108-line `scripts/build-theme.mjs` doing this, and every copy resolved Rig and Hex from a **sibling monorepo checkout** — so a site could not rebuild its own stylesheet unless the Rig repo happened to sit beside it on disk. The CLI reads everything from the installed package instead, which works because 3.0.0 ships hex's sources. The PostCSS toolchain stays out of rig's dependencies (dead weight for consumers who never build a theme); the command resolves it from the site, then rig, then hex, and **warns when it falls back** — a fallback copy of Tailwind generated ~1,800 extra utility classes and inflated `theme.css` by 38%, which would otherwise have looked like a legitimate rebuild.

### Fixed

- **The `beacon` and `voltaic` themes shipped with no component styling.** Neither imported a component barrel nor declared the typography tokens the shared component CSS `@apply`s, so both built to ~15 KB against 106–150 KB for a real theme — every `data-rig-*` component unstyled. `beacon` is offered in Obelisk's theme switcher, so selecting it left that app unstyled. Both now build at ~105 KB. See [hex/CHANGELOG.md](hex/CHANGELOG.md).
- **`data-theme='unstyled'` now works in all 27 themes** — it was present in 11 and silently missing from 16.

### Changed

- **BREAKING: the content-site skin left the six affiliate themes.** `slate`, `roast`, `fern`, `quartz`, `damson`, and `brass` each carried a ~730-line `domains.css` that was really the same long-form site skin copied six times (96% identical; 4,392 lines, 335 unique). It is now the opt-in `hex/shared/site` layer and those bundles are ~13.4 KB smaller each. Consumers relying on it must import the layer and supply their own `[data-category]` map — see [MIGRATION.md](MIGRATION.md).
- **BREAKING: `voltaic` and `forge` were re-cut.** `voltaic` was a byte-for-byte duplicate of `spacewizard`; it is now arc chartreuse on graphite. `forge` moved from CRT yellow phosphor (1° from `citron`) to CRT magenta phosphor, filling the palette's largest hue gap. The palette now has no duplicate primaries and a largest gap of 37°, down from 55°.
- **BREAKING: `@amulet-laboratories/hex` is folded into this package.** The 27 Hex themes now ship inside `@amulet-laboratories/rig` under the `hex/` subpath — `@amulet-laboratories/hex/slate` becomes `@amulet-laboratories/rig/hex/slate`, and every other hex subpath keeps its shape under the same prefix. Both the compiled bundles (`hex/dist`) and the uncompiled source (`hex/src`, needed by consumers running their own Tailwind pass) are in the tarball. hex was never a separate project — it has always been a workspace package in this repo — and publishing it separately only meant the two could never move independently. The standalone package is deprecated on npm at its final version, 0.8.0. Migration is a find-and-replace; no theme names, token names, selectors, or compiled bytes changed. See [MIGRATION.md](MIGRATION.md).
- **BREAKING: the npm version line jumps 0.7.0 → 3.0.0.** There is no 1.x or 2.x. `@amulet-laboratories/rig` also exists on GitHub Packages at 2.x (consumed only by `vrd`) on a wholly separate registry and version line; starting the npm line at 3.0.0 puts it clear of that line so no version number is ever ambiguous between the two. Consumers on the GitHub Packages 2.x line are unaffected and should not migrate.
- `sideEffects` changed from `false` to `["*.css"]`. With hex's CSS now inside the package, a blanket `false` would have let bundlers tree-shake theme imports away entirely. JavaScript tree-shaking is unaffected.
- `@amulet-laboratories/rig-nuxt` now requires `@amulet-laboratories/rig >= 3.0.0`, and its stale optional peer entry for `@amulet-laboratories/hex` is removed.
- `create-rig` scaffolds against rig 3.x and defaults to the `cobalt` theme. It previously defaulted to a `vscode` theme that no longer exists, emitting a broken trailing-slash import specifier.

## [0.7.0] — 2026-07-17

Shipped by tag `v0.8.0`.

### Added

- **`@amulet-laboratories/rig-nuxt` (0.6.4) — build-time content guard against self-closing MDC component tags.** MDC (`@nuxtjs/mdc` 0.20–0.22) does not honor `/>` on component tags: `<ProductCardWrapper slug="x" />` parses as an _open_ tag that swallows every following sibling (prose, headings, later cards) as its children, and since these leaf components have no `<slot/>` the swallowed content is discarded at render — so a roundup with N cards rendered only the first. The module now scans `content/**/*.md` in a `build:before` hook and fails the build with a file:line list if any self-closing PascalCase component tag is present, directing authors to the explicit-close form (`<X></X>`). This replaces a per-site `scripts/check-content-components.mjs` that had to be copied into every authority site — the rule now lives once in the library. Lowercase HTML voids (`<br/>`, `<img/>`) are intentionally ignored.

## [0.6.0] — 2026-07-14

### Added

- **Structural styles for the content callout + FAQ** (`src/styles/content.css`, shipped via `@amulet-laboratories/rig/styles`) — `[data-rig-callout*]` and `[data-rig-faq*]` layout/markers, paired with `@amulet-laboratories/rig-nuxt`'s new `QuickAnswer` / `FaqBlock` components and Hex's color skin. Closes two spots where content sites hand-rolled `<style scoped>` because no shared styling existed.
- **`SectionDivider` gains `fill` / `bg` props and `FlankedHeading` gains a `color` prop.** All three drove CSS custom properties (`--section-divider-fill/-bg`, `--flanked-heading-color`) that consumers could only reach via inline `style`. They're now typed props. In the process, two of those vars were dead: `--section-divider-bg` was never applied (now backs the divider's `background`) and the flanked-heading ornament color was hardcoded to `--color-primary` (now reads `--flanked-heading-color`, still defaulting to primary). Wiring lives in Hex `web.css`.
- **`Icon` gains `tone` and `color` props.** `tone` (primary | success | warning | danger | info | muted) maps to a theme color token via CSS; `color` accepts any CSS color as an escape hatch for domain/brand colors and overrides `tone`. Replaces consumers reaching for `style="color: #…"` on an icon. Tone styling ships in Hex (full set) and the scaffold fallback (primary/danger/muted subset).
- **`Button` `size` prop now renders.** Like Input/Select, `Button` already emitted `data-size` (xs–xl) with no CSS behind it, so consumers forced small buttons with `!important` overrides (`!h-6 !px-2 !text-[10px]`). Added the xs/sm/lg/xl scale (padding + font-size, and matching icon-only dimensions) to `src/styles/core.css`; md unchanged.
- **`Input` and `Select` gain a `size` prop.** Both already received `size="sm"` from consumers, but neither declared the prop and no CSS backed it, so it was a silent no-op (the attribute fell through onto the wrapper). `size` (xs–xl; sm/lg rescale font-size + padding, md unchanged) now emits `data-size` and renders. Structural rules ship via `@amulet-laboratories/rig/styles`.
- **`Card` gains `selected`, `layout`, and `columns` props.** `selected` emits `data-selected` for a persistent highlighted/featured state (distinct from `:hover`) — replacing consumers hand-setting `style="border-color: var(--color-primary)"` on a featured card (they were even hand-rolling the `data-selected` attribute themselves). `layout="row"` lays the card's direct children out as a horizontal grid (`columns` sets `grid-template-columns`, e.g. `"1fr auto auto"`), so a card can be a data row without `class="grid grid-cols-[1fr_auto_auto] items-center"`. Structural rules ship via `@amulet-laboratories/rig/styles`; the `selected` border color is a Hex token (see Hex 0.6.x).

### Fixed

- **`useZoom` no longer warns when constructed outside a component `setup()`.** Its `onMounted`/`onUnmounted` registration is now guarded by `getCurrentInstance()`, so calling it in tests or other non-setup contexts is safe (the lifecycle-tied keydown listener still wires up exactly as before inside a component).
- **`Badge`'s `size` prop now renders.** The component always emitted `data-size` (xs|sm|md|lg|xl) but the structural CSS (`src/styles/core.css`, shipped via `@amulet-laboratories/rig/styles`) defined a single fixed size, so every value looked identical and consumers shrank badges with arbitrary utilities like `text-[10px]`. Each size now rescales font-size, padding, and radius together (md unchanged, matching the previous default). The scaffold fallback and Badge story cover the full scale. `variant` already provided the tone/color axis.

### Added

- **`@amulet-laboratories/rig/manifest` export** — a pure-data inventory of the library's auto-importable surface (`components: readonly string[]`, `composables: readonly string[]`, plus `RigComponentName` / `RigComposableName` union types). Generated from the barrel via `pnpm manifest:gen` and pinned by a CI drift guard (`src/manifest.test.ts`), so it can never fall behind the actual exports. `@amulet-laboratories/rig-nuxt` now derives its auto-import list from this instead of a hardcoded array that had drifted ~18 components behind. The manifest is data-only (no Vue/optional-peer imports), so consuming it never pulls `d3`/`markdown-it` into a bundle.

### Security

- **Resolved dependency advisories surfaced by `pnpm audit --prod`.** Tightened the loose `vite` (`^7.3.2` → `>=7.3.5 <8`, kept within the v7 line) and `nuxt` (`>=3.21.6` → `>=3.21.7`) overrides, which had permitted patched-but-vulnerable versions, and added overrides for the transitive `shell-quote` (critical), `tar`, `esbuild`, `js-yaml`, `launch-editor`, `nuxt-og-image`, and `@babel/core` advisories (all in the Nuxt toolchain). The remaining 3 "nuxt <3.21.7" audit findings are a false positive — `pnpm audit` matches our own `@amulet-laboratories/rig-nuxt@0.5.0` workspace package (directory `nuxt/`) against the npm `nuxt` advisories; the real, resolved `nuxt` is 3.21.8, patched against all three. They're pinned in `auditConfig.ignoreGhsas` (GHSA-934w-87qh-qr26, GHSA-c9cv-mq2m-ppp3, GHSA-m3q2-p4fw-w38m).

### CI

- Bumped `.node-version` `22.14.0` → `22.23.1` to satisfy `@babel/generator@8`'s engine floor (`^22.18.0 || >=24.11.0`), which was failing every job at install.

## [0.5.1] — 2026-06-20

### Fixed

- **`SiteNav` collapses to the hamburger below `md` (768px), not `sm` (640px).** A full horizontal nav row with 6+ items overflowed a 640px viewport, pushing the page wider than the screen on consumers with longer navs. Both the links/toggle switch and the mobile-drawer hide now engage at `min-width: 768px`, so the hamburger stays until there is room for the links.

## [0.5.0] — 2026-06-05

### Fixed

- **`Testimonial` accepts `quote` / `name` / `role` props** (rendered as slot fallbacks). Declaring them as props means they are consumed rather than falling through onto the root `<blockquote>` as stray attributes — notably `role`, which a consumer could otherwise set to a non-ARIA string and produce an invalid ARIA role (a critical axe violation). Legitimate `class` / `aria-*` still pass through.
- **Markdown renderer constructed lazily.** `useMarkdown` no longer runs `new MarkdownIt()` at module load, so the module is side-effect free and bundlers tree-shake it — and the externalized `markdown-it` + `dompurify` deps — out of any consumer that never calls `renderMarkdown`.

### Added

- **Subpackage exports.** Consumers can now import from any of the 12 packages directly — `import { Button } from '@amulet-laboratories/rig/core'`, `import { Hero } from '@amulet-laboratories/rig/web'`, etc. — and skip the full 149-component barrel. Entries: `./core`, `./layout`, `./nav`, `./editor`, `./lists`, `./menus`, `./extras`, `./shell`, `./data`, `./spatial`, `./temporal`, `./web`. Each emits its own `.mjs` + `.cjs` + `.d.ts`. The root `.` barrel still works.
- **CTA button token hooks.** New `--rig-button-cta-{bg,fg,border,shadow}` (plus hover + active variants) on the shared button CSS — sites with custom CTA palettes can override the tokens instead of the entire selector. Each falls back to the primary tokens when unset, so existing themes are unaffected.

### Changed

- **`useForceGraph` uses named d3 imports** instead of `import * as d3 from 'd3'`. Restores Rollup tree-shaking on the data + spatial packages — consumers of just primitives no longer pull the full d3 library into their bundle.
- **Build emits per-entry bundles.** `vite.config.ts` is now multi-entry library mode (13 entries). `vite-plugin-dts` switched from `rollupTypes: true` to `insertTypesEntry` so each entry gets its own `.d.ts` without OOMing the bundler.
- **Hex theme content cleanup (27 themes).** Stripped project identifiers from 14 themes (cardinal, clover, copper, cypress, damson, hearth, iris, lagoon, roast, sienna, slate, vesper, voltaic — plus residual descriptive phrases in cypress + vesper). Renamed 17 brand-prefixed CSS variables to use theme names (`--beanwoven-*` → `--roast-*`, `--kbcv-*` → `--cardinal-*`, etc.). Zero source files in any consumer project reference the old names.
- **README:** corrected theme count from 4 (in the example list) to the actual 27, alphabetically enumerated. New "Subpackage imports" section. CTA-token customization documented.
- **Scaffold (`@amulet-laboratories/rig/scaffold`)** keeps its current location with a comment explaining the architectural distinction from Hex themes (scaffold is Rig's fallback so components render before any theme loads; Hex themes are the public art-direction surface).

### Added (Hex)

- **`./shared/*` package exports** so custom themes built outside `Rig/hex/src/themes/` can import the shared component CSS individually (`@amulet-laboratories/hex/shared/rig-defaults`, `/shared/components/core`, etc.). 16 new entries.

## [0.3.0] — 2026-03-25

### Added

- **web** package: ContactForm, FeatureList, FlankedHeading, Gallery, MapPlaceholder, MenuList, Ornament, PricingCard, SectionDivider, ServiceGrid, TeamGrid (11 new components)
- New core components: SectionHeader
- New data components: ChartEmpty, ChartTooltip, StatLine
- New extras components: CrashScreen, ErrorBoundary, ConfirmDialog, LiveRegion
- New nav component: SidebarNavList
- New composables: EventBus, useAnnounce, useColorUtils, useContainerSize, useGlobalTooltip, useMarkdown, useSearchUtils, useSortableOrder, useThrottledRender, useTime, useZoom
- New web composables: useDetailView, useHashRouter, useScrollNav
- New spatial utility: useForceGraph (D3 force-directed graph helpers)
- Histoire stories for all shell views and many web/extras components
- Hex themes: andrewpassanisi, quizbit, forge
- Hex scoped CSS output, scroll animations, and utility classes

### Breaking Changes

- `d3`, `dompurify`, and `markdown-it` moved from bundled `dependencies` to **optional `peerDependencies`**. Consumers using spatial/data/markdown features must install them explicitly:
  ```bash
  pnpm add d3@^7.0.0        # required for GraphNetwork, useForceGraph
  pnpm add dompurify@^3.0.0  # required for useMarkdown
  pnpm add markdown-it@^14.0.0  # required for useMarkdown
  ```

### Fixed

- Externalized d3/dompurify/markdown-it from library bundle — consumers no longer pull ~660KB of unused dependencies
- `useFocusTrap` now properly restores scroll overflow and focus on unmount when trap is active
- All 51 TypeScript strict-mode errors resolved (50 test `noUncheckedIndexedAccess` fixes, 1 production type fix in ContactForm)
- ESLint config now excludes `deploy/` and `landing/` build artifacts (was reporting 6,900+ false errors)
- All remaining lint errors fixed: boolean shorthand in stories, macro ordering in MenuList, string concatenation in tests

### Changed

- Library bundle reduced from 606KB to 600KB (ESM) by externalizing heavy dependencies
- Test count grew from 1,776 to 2,545
- Coverage thresholds enforced at 80/75/80/80 (statements/branches/functions/lines)
- Hex themes expanded with scoped CSS mode and new client themes

## [0.2.0] — 2026-03-15

### Added

- **data** package: Sparkline, MiniBar, StatCard, BarChart, LineChart, AreaChart, ScatterPlot, Heatmap, RadarChart, Treemap, SankeyDiagram (11 components)
- **spatial** package: MapCanvas, GlobeView, ScatterPlot3D, GraphNetwork, PointCloud (5 components)
- **temporal** package: TimelineScrubber, AnimatedChart, PlaybackControls, TemporalHeatmap, ParticleField (5 components)
- New core components: Avatar, AvatarGroup, Dot, PulseIndicator, ProgressRing, RangeSlider, Slider, ToggleGroup
- New layout components: Accordion, Collapsible, Popover, ScrollArea, PeekView, ResizablePanel
- New nav components: Breadcrumbs, Tabs, Timeline, Stepper, DatePicker, DateRangePicker
- New editor components: CodeBlock, DiffViewer, ColorPicker
- New menu components: DropdownMenu, Menubar
- New extras: CalendarGrid, KanbanBoard
- Composables: useVirtualList, useReducedMotion
- Hexrig Lab demo — component explorer, health dashboard, intelligence hub
- Health pipeline: per-component quality scoring, competitive benchmarks, tree-shake analysis
- Playwright E2E tests for demo
- Comparison and cross-comparison benchmark suites

### Breaking Changes

- `@floating-ui/vue` is now a **required** peer dependency (was optional). Install it before upgrading: `pnpm add @floating-ui/vue@^1.0.0`. See [MIGRATION.md](MIGRATION.md) for details.

### Changed

- Demo replaced Histoire stories with custom Hexrig Lab three-section SPA
- Grew from 57 components across 8 packages to 92 components across 11 packages
- Test count grew from 515 to 1,776
- Standardized overlay mount strategy to `v-show` across all overlay components

## [0.1.0] — 2025-06-30

### Added

- Initial release with 57 headless Vue 3 components across 8 packages (core, layout, nav, editor, lists, menus, extras, shell)
- Composables: useShellState, useDragDrop, useToast, useNotifications, usePersistedState, useFocusTrap, useKeyboard, useGlobalState, useCommandRegistry, useTooltip
- 515 unit tests via Vitest
- Single-bundle ESM/CJS build via Vite library mode
- Structural CSS (`./styles`, `./scaffold`) for layout-only styling
