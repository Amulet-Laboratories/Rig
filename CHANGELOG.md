# Changelog

All notable changes to `@amulet-laboratories/rig` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
