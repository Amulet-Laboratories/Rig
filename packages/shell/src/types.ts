import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { ID, TabItem } from '@core/types'

// ── Shell activity views ──

export type ActivityView = string

// ── Shell panel descriptor ──

export interface PanelDescriptor {
  id: string
  label: string
  icon?: string
}

// ── Shell configuration ──

export interface ShellConfig {
  /** Namespace for persisted state keys (default: 'rig-shell') */
  namespace?: string
  /** Initial sidebar width in px (default: 260) */
  sidebarWidth?: number
  /** Initial panel height in px (default: 200) */
  panelHeight?: number
  /** Initial chat/auxiliary panel width in px (default: 320) */
  auxWidth?: number
  /** Default activity view ID (default: 'explorer') */
  defaultActivity?: string
  /** Called when active tab changes — use for URL sync */
  onActiveTabChange?: (tab: TabItem | null) => void

  /** Seed the open tabs on first render (not persisted) */
  initialTabs?: TabItem[]
  /** Seed the active tab ID on first render (not persisted) */
  initialActiveTabId?: ID | null
  /** Override the persisted panel-visible default */
  initialPanelVisible?: boolean
  /** Override the persisted panel-tab default */
  initialPanelTab?: string
}

// ── Shell state interface ──

export interface ShellState {
  // Tabs
  openTabs: Ref<TabItem[]>
  activeTabId: Ref<ID | null>
  activeTab: ComputedRef<TabItem | undefined>
  previewTabId: Ref<ID | null>
  dirtyTabs: Ref<Set<ID>>
  dirtyTabCount: ComputedRef<number>
  openTab: (tab: TabItem, opts?: { preview?: boolean }) => void
  closeTab: (id: ID) => void
  closeOtherTabs: (id: ID) => void
  closeTabsToRight: (id: ID) => void
  closeAllTabs: () => void
  reorderTabs: (payload: { from: number; to: number }) => void
  markDirty: (id: ID) => void
  markClean: (id: ID) => void

  // Item operations — convenience layer over openTab/markDirty
  openItem: (
    id: ID,
    label: string,
    data?: unknown,
    opts?: { preview?: boolean; edit?: boolean },
  ) => void

  // Editing state
  editingTabs: Ref<Set<ID>>
  setEditing: (id: ID, editing: boolean) => void
  isEditing: (id: ID) => boolean

  // Active tab data accessor
  activeTabData: ComputedRef<unknown>

  // Activity bar
  activeActivity: Ref<string>

  // Sidebar
  sidebarVisible: Ref<boolean>
  sidebarWidth: Ref<number>
  toggleSidebar: () => void

  // Bottom panel
  panelVisible: Ref<boolean>
  panelHeight: Ref<number>
  activePanelTab: Ref<string>
  togglePanel: () => void

  // Auxiliary panel (chat, AI, etc.)
  auxOpen: Ref<boolean>
  auxWidth: Ref<number>
  toggleAux: () => void

  // Settings
  settingsOpen: Ref<boolean>
  openSettings: () => void

  // Shell grid
  shellSizes: ComputedRef<{ sideWidth: number; panelHeight: number }>
  onShellResize: (sizes: { sideWidth: number; panelHeight: number }) => void
}

// ── Injection key ──

export const ShellKey: InjectionKey<ShellState> = Symbol('rig-shell')
