# Changelog

All notable changes to `@amulet-laboratories/rig` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
