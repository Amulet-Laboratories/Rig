/**
 * Preferences — fixture data
 * Settings page with form groups, toggles, nested options
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type SettingType =
  | 'toggle'
  | 'select'
  | 'text'
  | 'number'
  | 'radio'
  | 'color'

export interface Setting {
  id: string
  label: string
  description: string
  type: SettingType
  value: unknown
  options?: { id: string; label: string }[] // for select/radio
  min?: number
  max?: number
  tags?: string[]
  modified?: boolean   // indicates user has changed from default
}

export interface SettingGroup {
  id: string
  label: string
  icon: string
  description: string
  settings: Setting[]
}

export interface SettingSection {
  id: string
  label: string
  icon: string
  groups: SettingGroup[]
}

// ---------------------------------------------------------------------------
// Settings data
// ---------------------------------------------------------------------------
export const sections: SettingSection[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: 'codicon:symbol-color',
    groups: [
      {
        id: 'theme',
        label: 'Theme',
        icon: 'codicon:color-mode',
        description: 'Customise the look and feel of the application.',
        settings: [
          {
            id: 'color-theme',
            label: 'Color Theme',
            description: 'Controls the active color theme.',
            type: 'select',
            value: 'obelisk',
            options: [
              { id: 'obelisk', label: 'Obelisk (Dark)' },
              { id: 'calcite', label: 'Calcite (Light)' },
              { id: 'obsidian', label: 'Obsidian (High Contrast)' },
              { id: 'vscode', label: 'VS Code Dark Modern' },
            ],
            modified: true,
          },
          {
            id: 'icon-theme',
            label: 'Icon Theme',
            description: 'Controls the icon theme used in the sidebar and explorer.',
            type: 'select',
            value: 'seti',
            options: [
              { id: 'seti', label: 'Seti' },
              { id: 'material', label: 'Material' },
              { id: 'minimal', label: 'Minimal' },
            ],
          },
          {
            id: 'custom-title-bar',
            label: 'Custom Title Bar',
            description: 'Use a custom title bar instead of the system one.',
            type: 'toggle',
            value: true,
          },
          {
            id: 'menu-bar-visibility',
            label: 'Menu Bar Visibility',
            description: 'Controls the visibility of the menu bar.',
            type: 'select',
            value: 'classic',
            options: [
              { id: 'classic', label: 'Classic' },
              { id: 'toggle', label: 'Toggle' },
              { id: 'hidden', label: 'Hidden' },
            ],
          },
        ],
      },
      {
        id: 'layout',
        label: 'Layout',
        icon: 'codicon:layout',
        description: 'Configure the window layout and panel arrangement.',
        settings: [
          {
            id: 'sidebar-position',
            label: 'Sidebar Position',
            description: 'Controls the position of the sidebar.',
            type: 'radio',
            value: 'left',
            options: [
              { id: 'left', label: 'Left' },
              { id: 'right', label: 'Right' },
            ],
          },
          {
            id: 'panel-position',
            label: 'Panel Position',
            description: 'Controls where the bottom panel appears.',
            type: 'radio',
            value: 'bottom',
            options: [
              { id: 'bottom', label: 'Bottom' },
              { id: 'right', label: 'Right' },
            ],
          },
          {
            id: 'activity-bar',
            label: 'Show Activity Bar',
            description: 'Display the activity bar on the side.',
            type: 'toggle',
            value: true,
          },
          {
            id: 'status-bar',
            label: 'Show Status Bar',
            description: 'Display the status bar at the bottom.',
            type: 'toggle',
            value: true,
          },
          {
            id: 'minimap',
            label: 'Show Minimap',
            description: 'Display a minimap of the editor content.',
            type: 'toggle',
            value: true,
            modified: true,
          },
        ],
      },
    ],
  },
  {
    id: 'editor',
    label: 'Editor',
    icon: 'codicon:edit',
    groups: [
      {
        id: 'font',
        label: 'Font',
        icon: 'codicon:text-size',
        description: 'Configure editor font settings.',
        settings: [
          {
            id: 'font-family',
            label: 'Font Family',
            description: 'Controls the font family used in the editor.',
            type: 'text',
            value: 'JetBrains Mono, monospace',
            modified: true,
          },
          {
            id: 'font-size',
            label: 'Font Size',
            description: 'Controls the font size in pixels.',
            type: 'number',
            value: 14,
            min: 8,
            max: 36,
          },
          {
            id: 'line-height',
            label: 'Line Height',
            description: 'Controls the line height. Use 0 for automatic.',
            type: 'number',
            value: 1.6,
            min: 0,
            max: 3,
          },
          {
            id: 'font-ligatures',
            label: 'Font Ligatures',
            description: 'Enable font ligatures for supported fonts.',
            type: 'toggle',
            value: true,
          },
        ],
      },
      {
        id: 'behavior',
        label: 'Behavior',
        icon: 'codicon:settings-gear',
        description: 'Configure editor behavior and features.',
        settings: [
          {
            id: 'word-wrap',
            label: 'Word Wrap',
            description: 'Controls how lines should wrap.',
            type: 'select',
            value: 'off',
            options: [
              { id: 'off', label: 'Off' },
              { id: 'on', label: 'On' },
              { id: 'wordWrapColumn', label: 'Word Wrap Column' },
              { id: 'bounded', label: 'Bounded' },
            ],
          },
          {
            id: 'auto-save',
            label: 'Auto Save',
            description: 'Automatically save files after a delay.',
            type: 'select',
            value: 'afterDelay',
            options: [
              { id: 'off', label: 'Off' },
              { id: 'afterDelay', label: 'After Delay' },
              { id: 'onFocusChange', label: 'On Focus Change' },
              { id: 'onWindowChange', label: 'On Window Change' },
            ],
            modified: true,
          },
          {
            id: 'tab-size',
            label: 'Tab Size',
            description: 'The number of spaces a tab is equal to.',
            type: 'number',
            value: 2,
            min: 1,
            max: 8,
          },
          {
            id: 'insert-spaces',
            label: 'Insert Spaces',
            description: 'Insert spaces when pressing Tab.',
            type: 'toggle',
            value: true,
          },
          {
            id: 'format-on-save',
            label: 'Format on Save',
            description: 'Automatically format files when saving.',
            type: 'toggle',
            value: true,
            modified: true,
          },
          {
            id: 'bracket-pairs',
            label: 'Bracket Pair Colorisation',
            description: 'Enable bracket pair colorisation.',
            type: 'toggle',
            value: true,
          },
        ],
      },
    ],
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: 'codicon:terminal',
    groups: [
      {
        id: 'terminal-general',
        label: 'General',
        icon: 'codicon:terminal',
        description: 'Configure the integrated terminal.',
        settings: [
          {
            id: 'terminal-shell',
            label: 'Default Shell',
            description: 'The default shell profile to use.',
            type: 'select',
            value: 'zsh',
            options: [
              { id: 'bash', label: 'Bash' },
              { id: 'zsh', label: 'Zsh' },
              { id: 'fish', label: 'Fish' },
              { id: 'pwsh', label: 'PowerShell' },
            ],
          },
          {
            id: 'terminal-font-size',
            label: 'Font Size',
            description: 'Terminal font size in pixels.',
            type: 'number',
            value: 13,
            min: 8,
            max: 28,
          },
          {
            id: 'terminal-cursor',
            label: 'Cursor Style',
            description: 'Controls the cursor style in the terminal.',
            type: 'select',
            value: 'block',
            options: [
              { id: 'block', label: 'Block' },
              { id: 'line', label: 'Line' },
              { id: 'underline', label: 'Underline' },
            ],
          },
          {
            id: 'terminal-scroll-back',
            label: 'Scrollback Lines',
            description: 'Maximum number of lines in the scrollback buffer.',
            type: 'number',
            value: 1000,
            min: 100,
            max: 100000,
          },
          {
            id: 'terminal-copy-on-select',
            label: 'Copy on Selection',
            description: 'Automatically copy selected text to clipboard.',
            type: 'toggle',
            value: false,
          },
        ],
      },
    ],
  },
  {
    id: 'extensions',
    label: 'Extensions',
    icon: 'codicon:extensions',
    groups: [
      {
        id: 'ext-general',
        label: 'General',
        icon: 'codicon:extensions',
        description: 'Manage extension behavior and auto-update.',
        settings: [
          {
            id: 'auto-update',
            label: 'Auto Update Extensions',
            description: 'Automatically update extensions when new versions are available.',
            type: 'toggle',
            value: true,
          },
          {
            id: 'auto-check-updates',
            label: 'Auto Check for Updates',
            description: 'Periodically check for extension updates.',
            type: 'toggle',
            value: true,
          },
          {
            id: 'confirm-sync',
            label: 'Confirm Sync',
            description: 'Ask for confirmation when syncing extension data.',
            type: 'toggle',
            value: false,
            modified: true,
          },
        ],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getAllSettings(): Setting[] {
  return sections.flatMap((s) => s.groups.flatMap((g) => g.settings))
}

export function getModifiedSettings(): Setting[] {
  return getAllSettings().filter((s) => s.modified)
}

export function searchSettings(query: string): Setting[] {
  const q = query.toLowerCase()
  return getAllSettings().filter(
    (s) =>
      s.label.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q),
  )
}

export function getTotalCount(): number {
  return getAllSettings().length
}

export function getModifiedCount(): number {
  return getModifiedSettings().length
}
