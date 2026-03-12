/**
 * Obelisk — Menubar, command palette, and context menu fixtures.
 */
import type { Action, ListItem } from '@core/types'
import type { MenubarEntry } from '@menus/Menubar.vue'

// ---------------------------------------------------------------------------
// Menubar
// ---------------------------------------------------------------------------
export const menubarItems: MenubarEntry[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new-record', label: 'New Record', keybinding: 'Ctrl+N' },
      { id: 'save', label: 'Save', keybinding: 'Ctrl+S' },
      { id: 'sep-1', label: '---' },
      { id: 'settings', label: 'Settings', keybinding: 'Ctrl+,' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', keybinding: 'Ctrl+Z' },
      { id: 'redo', label: 'Redo', keybinding: 'Ctrl+Shift+Z' },
      { id: 'sep-2', label: '---' },
      { id: 'toggle-edit', label: 'Toggle Edit Mode', keybinding: 'Ctrl+E' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'command-palette', label: 'Command Palette', keybinding: 'Ctrl+Shift+P' },
      { id: 'sep-3', label: '---' },
      { id: 'toggle-sidebar', label: 'Toggle Sidebar', keybinding: 'Ctrl+B' },
      { id: 'toggle-panel', label: 'Toggle Panel', keybinding: 'Ctrl+J' },
      { id: 'toggle-chat', label: 'Toggle Chat', keybinding: 'Ctrl+/' },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      { id: 'shortcuts', label: 'Keyboard Shortcuts', keybinding: '?' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Command Palette
// ---------------------------------------------------------------------------
export const commandPaletteItems: ListItem[] = [
  { id: 'cmd-new-record', label: 'New Record', description: 'Ctrl+N' },
  { id: 'cmd-save', label: 'Save Record', description: 'Ctrl+S' },
  { id: 'cmd-close-tab', label: 'Close Editor', description: 'Ctrl+W' },
  { id: 'cmd-toggle-sidebar', label: 'Toggle Sidebar', description: 'Ctrl+B' },
  { id: 'cmd-toggle-panel', label: 'Toggle Panel', description: 'Ctrl+J' },
  { id: 'cmd-toggle-chat', label: 'Toggle Chat', description: 'Ctrl+/' },
  { id: 'cmd-toggle-edit', label: 'Toggle Edit Mode', description: 'Ctrl+E' },
  { id: 'cmd-switch-domain', label: 'Switch Domain' },
  { id: 'cmd-search-records', label: 'Search Records', description: 'Ctrl+K' },
  { id: 'cmd-undo', label: 'Undo', description: 'Ctrl+Z' },
  { id: 'cmd-redo', label: 'Redo', description: 'Ctrl+Shift+Z' },
  { id: 'cmd-settings', label: 'Open Settings', description: 'Ctrl+,' },
  { id: 'cmd-shortcuts', label: 'Keyboard Shortcuts', description: '?' },
]

// ---------------------------------------------------------------------------
// Context Menus
// ---------------------------------------------------------------------------
export const recordCtxItems: Action[] = [
  { id: 'ctx-open', label: 'Open' },
  { id: 'ctx-open-edit', label: 'Open in Edit Mode', keybinding: 'Ctrl+E' },
  { id: 'ctx-copy-id', label: 'Copy Record ID' },
  { id: 'ctx-find-links', label: 'Find Linked Records' },
  { id: 'ctx-delete', label: 'Delete Record' },
]

export const registryCtxItems: Action[] = [
  { id: 'ctx-new-record', label: 'New Record' },
  { id: 'ctx-collapse-all', label: 'Collapse All' },
  { id: 'ctx-expand-all', label: 'Expand All' },
]

export const tabCtxItems: Action[] = [
  { id: 'tab-close', label: 'Close', keybinding: 'Ctrl+W' },
  { id: 'tab-close-others', label: 'Close Others' },
  { id: 'tab-close-all', label: 'Close All' },
  { id: 'tab-copy-id', label: 'Copy Record ID' },
]
