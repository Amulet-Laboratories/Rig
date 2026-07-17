# Changelog

All notable changes to `@amulet-laboratories/rig` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`@amulet-laboratories/rig-nuxt` (0.6.4) — build-time content guard against self-closing MDC component tags.** MDC (`@nuxtjs/mdc` 0.20–0.22) does not honor `/>` on component tags: `<ProductCardWrapper slug="x" />` parses as an _open_ tag that swallows every following sibling (prose, headings, later cards) as its children, and since these leaf components have no `<slot/>` the swallowed content is discarded at render — so a roundup with N cards rendered only the first. The module now scans `content/**/*.md` in a `build:before` hook and fails the build with a file:line list if any self-closing PascalCase component tag is present, directing authors to the explicit-close form (`<X></X>`). This replaces a per-site `scripts/check-content-components.mjs` that had to be copied into every authority site — the rule now lives once in the library. Lowercase HTML voids (`<br/>`, `<img/>`) are intentionally ignored.

### Security

- **Resolved dependency advisories surfaced by `pnpm audit --prod`.** Tightened the loose `vite` (`^7.3.2` → `>=7.3.5 <8`, kept within the v7 line) and `nuxt` (`>=3.21.6` → `>=3.21.7`) overrides, which had permitted patched-but-vulnerable versions, and added overrides for the transitive `shell-quote` (critical), `tar`, `esbuild`, `js-yaml`, `launch-editor`, `nuxt-og-image`, and `@babel/core` advisories (all in the Nuxt toolchain). The remaining 3 "nuxt <3.21.7" audit findings are a false positive — `pnpm audit` matches our own `@amulet-laboratories/rig-nuxt@0.5.0` workspace package (directory `nuxt/`) against the npm `nuxt` advisories; the real, resolved `nuxt` is 3.21.8, patched against all three. They're pinned in `auditConfig.ignoreGhsas` (GHSA-934w-87qh-qr26, GHSA-c9cv-mq2m-ppp3, GHSA-m3q2-p4fw-w38m).

### CI

- Bumped `.node-version` `22.14.0` → `22.23.1` to satisfy `@babel/generator@8`'s engine floor (`^22.18.0 || >=24.11.0`), which was failing every job at install.

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
