/**
 * Menu bar, command palette, and context menu item fixtures for IDE showcases.
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
      { id: 'new-file', label: 'New File', keybinding: 'Ctrl+N' },
      { id: 'new-window', label: 'New Window', keybinding: 'Ctrl+Shift+N' },
      { id: 'open-file', label: 'Open File...', keybinding: 'Ctrl+O' },
      { id: 'open-folder', label: 'Open Folder...' },
      { id: 'save', label: 'Save', keybinding: 'Ctrl+S' },
      { id: 'save-as', label: 'Save As...', keybinding: 'Ctrl+Shift+S' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', keybinding: 'Ctrl+Z' },
      { id: 'redo', label: 'Redo', keybinding: 'Ctrl+Shift+Z' },
      { id: 'cut', label: 'Cut', keybinding: 'Ctrl+X' },
      { id: 'copy', label: 'Copy', keybinding: 'Ctrl+C' },
      { id: 'paste', label: 'Paste', keybinding: 'Ctrl+V' },
      { id: 'find', label: 'Find', keybinding: 'Ctrl+F' },
      { id: 'replace', label: 'Replace', keybinding: 'Ctrl+H' },
    ],
  },
  {
    id: 'selection',
    label: 'Selection',
    items: [
      { id: 'select-all', label: 'Select All', keybinding: 'Ctrl+A' },
      { id: 'expand-selection', label: 'Expand Selection', keybinding: 'Alt+Shift+Right' },
      { id: 'shrink-selection', label: 'Shrink Selection', keybinding: 'Alt+Shift+Left' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'command-palette', label: 'Command Palette...', keybinding: 'Ctrl+Shift+P' },
      { id: 'toggle-sidebar', label: 'Toggle Sidebar', keybinding: 'Ctrl+B' },
      { id: 'toggle-panel', label: 'Toggle Panel', keybinding: 'Ctrl+J' },
      { id: 'toggle-terminal', label: 'Toggle Terminal', keybinding: 'Ctrl+`' },
      { id: 'zen-mode', label: 'Zen Mode', keybinding: 'Ctrl+K Z' },
    ],
  },
  {
    id: 'go',
    label: 'Go',
    items: [
      { id: 'go-to-file', label: 'Go to File...', keybinding: 'Ctrl+P' },
      { id: 'go-to-symbol', label: 'Go to Symbol...', keybinding: 'Ctrl+Shift+O' },
      { id: 'go-to-line', label: 'Go to Line...', keybinding: 'Ctrl+G' },
      { id: 'go-back', label: 'Go Back', keybinding: 'Alt+Left' },
      { id: 'go-forward', label: 'Go Forward', keybinding: 'Alt+Right' },
    ],
  },
  {
    id: 'terminal',
    label: 'Terminal',
    items: [
      { id: 'new-terminal', label: 'New Terminal', keybinding: 'Ctrl+Shift+`' },
      { id: 'split-terminal', label: 'Split Terminal' },
      { id: 'kill-terminal', label: 'Kill Terminal' },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      { id: 'about', label: 'About' },
      { id: 'docs', label: 'Documentation' },
      { id: 'release-notes', label: 'Release Notes' },
      { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', keybinding: 'Ctrl+K Ctrl+S' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Command Palette
// ---------------------------------------------------------------------------
export const commandPaletteItems: ListItem[] = [
  { id: 'cmd-open-file', label: 'Open File...', description: 'Ctrl+O' },
  { id: 'cmd-save', label: 'Save', description: 'Ctrl+S' },
  { id: 'cmd-save-all', label: 'Save All', description: 'Ctrl+K S' },
  { id: 'cmd-close-tab', label: 'Close Editor', description: 'Ctrl+W' },
  { id: 'cmd-toggle-sidebar', label: 'Toggle Sidebar Visibility', description: 'Ctrl+B' },
  { id: 'cmd-toggle-panel', label: 'Toggle Panel', description: 'Ctrl+J' },
  { id: 'cmd-toggle-terminal', label: 'Toggle Terminal', description: 'Ctrl+`' },
  { id: 'cmd-format', label: 'Format Document', description: 'Shift+Alt+F' },
  { id: 'cmd-go-to-line', label: 'Go to Line...', description: 'Ctrl+G' },
  { id: 'cmd-go-to-symbol', label: 'Go to Symbol...', description: 'Ctrl+Shift+O' },
  { id: 'cmd-change-theme', label: 'Preferences: Color Theme' },
  { id: 'cmd-settings', label: 'Preferences: Open Settings', description: 'Ctrl+,' },
  { id: 'cmd-keyboard-shortcuts', label: 'Preferences: Open Keyboard Shortcuts', description: 'Ctrl+K Ctrl+S' },
  { id: 'cmd-new-terminal', label: 'Terminal: Create New Terminal', description: 'Ctrl+Shift+`' },
  { id: 'cmd-git-commit', label: 'Git: Commit', description: '' },
  { id: 'cmd-git-push', label: 'Git: Push', description: '' },
  { id: 'cmd-reload', label: 'Developer: Reload Window' },
]

// ---------------------------------------------------------------------------
// Context Menus
// ---------------------------------------------------------------------------
export const editorCtxItems: Action[] = [
  { id: 'ctx-cut', label: 'Cut', keybinding: 'Ctrl+X' },
  { id: 'ctx-copy', label: 'Copy', keybinding: 'Ctrl+C' },
  { id: 'ctx-paste', label: 'Paste', keybinding: 'Ctrl+V' },
  { id: 'ctx-rename', label: 'Rename Symbol', keybinding: 'F2' },
  { id: 'ctx-format', label: 'Format Document', keybinding: 'Shift+Alt+F' },
  { id: 'ctx-go-def', label: 'Go to Definition', keybinding: 'F12' },
  { id: 'ctx-peek', label: 'Peek Definition', keybinding: 'Alt+F12' },
  { id: 'ctx-refs', label: 'Find All References', keybinding: 'Shift+F12' },
]

export const accountsCtxItems: Action[] = [
  { id: 'acct-signin', label: 'Sign in with GitHub', icon: 'codicon:github' },
  { id: 'acct-signin-ms', label: 'Sign in with Microsoft', icon: 'codicon:azure' },
  { id: 'acct-manage', label: 'Manage Trusted Extensions' },
]

export const settingsCtxItems: Action[] = [
  { id: 'set-settings', label: 'Settings', keybinding: 'Ctrl+,' },
  { id: 'set-extensions', label: 'Extensions', keybinding: 'Ctrl+Shift+X' },
  { id: 'set-keybindings', label: 'Keyboard Shortcuts', keybinding: 'Ctrl+K Ctrl+S' },
  { id: 'set-snippets', label: 'Configure User Snippets' },
  { id: 'set-themes', label: 'Color Theme', keybinding: 'Ctrl+K Ctrl+T' },
  { id: 'set-profiles', label: 'Profiles (Default)' },
]

export const fileCtxItems: Action[] = [
  { id: 'file-open', label: 'Open' },
  { id: 'file-open-side', label: 'Open to the Side' },
  { id: 'file-reveal', label: 'Reveal in File Explorer' },
  { id: 'file-copy-path', label: 'Copy Path', keybinding: 'Ctrl+Shift+C' },
  { id: 'file-copy-rel', label: 'Copy Relative Path', keybinding: 'Ctrl+K Ctrl+Shift+C' },
  { id: 'file-rename', label: 'Rename', keybinding: 'F2' },
  { id: 'file-delete', label: 'Delete' },
]

export const folderCtxItems: Action[] = [
  { id: 'folder-new-file', label: 'New File...' },
  { id: 'folder-new-folder', label: 'New Folder...' },
  { id: 'folder-reveal', label: 'Reveal in File Explorer' },
  { id: 'folder-copy-path', label: 'Copy Path', keybinding: 'Ctrl+Shift+C' },
  { id: 'folder-copy-rel', label: 'Copy Relative Path', keybinding: 'Ctrl+K Ctrl+Shift+C' },
  { id: 'folder-find', label: 'Find in Folder...', keybinding: 'Ctrl+Shift+F' },
]
