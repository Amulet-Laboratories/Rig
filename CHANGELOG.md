# Changelog

All notable changes to `@amulet-laboratories/rig` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2025-06-30

### Added

- Initial release with 57 headless Vue 3 components across 8 packages
- **core**: Button, Card, Badge, Collapsible, Tooltip, Dialog, Popover, Select, and more
- **layout**: ShellGrid, SplitPane, resizable panels
- **nav**: ActivityBar, SideBar, StatusBar, Breadcrumb, TabBar
- **editor**: EditorWorkbench, EditorTabs, TextEditor, Welcome
- **lists**: TreeView, TableView, CommandPalette, DataGrid, VirtualList
- **menus**: ContextMenu, MenuBar, ActionBar, Toolbar
- **extras**: Toast, NotificationCenter, SearchBox, FilterBar
- **shell**: IdeShell — full VSCode-style shell composition
- Composables: useShellState, useDragDrop, useToast, useNotifications, usePersistedState
- 580+ unit tests via Vitest
- Histoire stories for all packages
- Demo app with 20 interactive showcases
- Structural CSS (`./styles`, `./scaffold`) for layout-only styling
- Single-bundle ESM/CJS build via Vite library mode
