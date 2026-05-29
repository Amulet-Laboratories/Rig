import type { ID } from './common'

/** An executable action (menu item, command, toolbar button) */
export interface Action {
  id: ID
  /** Display label. Optional when `separator` is true. */
  label?: string
  icon?: string
  keybinding?: string
  disabled?: boolean
  /** Render this item as a visual separator rule (omits label, renders as <hr>) */
  separator?: boolean
  /** Badge text or count to display on the action (e.g. notification count) */
  badge?: string | number
  handler?: () => void
}

/** An editor tab or panel tab */
export interface TabItem<T = unknown> {
  id: ID
  label: string
  icon?: string
  dirty?: boolean
  pinned?: boolean
  closable?: boolean
  data?: T
}

/** A status bar entry */
export interface StatusBarItem {
  id: ID
  content?: string
  priority: number
  align: 'left' | 'right'
  /** Tooltip text on hover */
  tooltip?: string
  /** Command ID or handler for click interaction */
  command?: string | (() => void)
}

/** A column definition for table components */
export interface ColumnDef {
  id: string
  label: string
  width?: number
  minWidth?: number
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

/** Sort state for tables */
export interface SortState {
  column: string
  direction: 'asc' | 'desc'
}

/** A toast notification item */
export interface ToastItem {
  id: ID
  message: string
  severity: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  dismissible?: boolean
}
