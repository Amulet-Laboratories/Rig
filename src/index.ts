// Core — types, injection keys, composables, primitives
export * from '@core/index'

// Layout — ShellGrid, SplitView, Panel, Modal
export * from '@layout/index'

// Navigation — ActivityBar, SideBar, View, PanelBar, StatusBar, Breadcrumbs
export * from '@nav/index'

// Editor — EditorWorkbench, EditorTab
export * from '@editor/index'

// Lists — List, TreeView, Table
export * from '@lists/index'

// Menus — ContextMenu, CommandPalette, ActionBar, KeyboardHint
export * from '@menus/index'

// Extras — Toast, EmptyState
export * from '@extras/index'

// Shell — IdeShell, useShellState
export * from '@shell/index'

// Data — Sparkline, MiniBar, StatCard, BarChart, LineChart, AreaChart, ScatterPlot, Heatmap, RadarChart, Treemap, SankeyDiagram
export * from '@data/index'

// Spatial — MapCanvas, GlobeView, ScatterPlot3D, GraphNetwork, PointCloud
//
// NOT re-exported here, deliberately. `@spatial` statically imports `d3`, which
// is declared an *optional* peer — and a re-export from this barrel made that
// claim false: Node resolves the import when the barrel is evaluated, so any
// consumer who had not installed d3 got
//
//     Cannot find package 'd3' imported from …/useForceGraph-*.js
//
// on their first server render, from a page with no graph on it. Tree-shaking
// does not help; it runs in the bundler, and SSR evaluates real ESM.
//
// Import these from the subpath instead, which is what it is for:
//
//     import { GraphNetwork } from '@amulet-laboratories/rig/spatial'

// Temporal — TimelineScrubber, AnimatedChart, PlaybackControls, TemporalHeatmap, ParticleField
export * from '@temporal/index'

// Web — SiteShell, SiteNav, Hero, Section, StatRow, CTABanner, Testimonial, SiteFooter
export * from '@web/index'
