/**
 * usePaneState — Multi-pane editor group management composable.
 *
 * Manages up to 4 independent editor pane groups arranged in a 2×2 grid:
 *   tl (top-left)  | tr (top-right)
 *   bl (bottom-left)| br (bottom-right)
 *
 * The `tl` pane is always present. Secondary panes are created on demand via
 * splitRight/splitDown and auto-close when their last tab is removed.
 *
 * Split = Move: the source tab is removed from its original pane and placed
 * in the new pane.
 *
 * @example
 * ```ts
 * // In a parent component:
 * const panes = usePaneState({ provide: true })
 *
 * // In a child component:
 * const panes = usePaneState()
 * ```
 */

import {
  ref,
  shallowRef,
  computed,
  inject,
  provide,
  type Ref,
  type ComputedRef,
  type InjectionKey,
} from 'vue'
import type { ID, TabItem } from '@core/types'

// ── Pane identifiers ──

export type PaneId = 'tl' | 'tr' | 'bl' | 'br'

// ── Per-pane reactive tab group ──

export interface PaneGroup {
  readonly id: PaneId
  tabs: Ref<TabItem[]>
  activeTabId: Ref<ID | null>
  previewTabId: Ref<ID | null>
  dirtyTabs: Ref<Set<ID>>
  editingTabs: Ref<Set<ID>>
}

// ── Layout snapshot consumed by SplitEditorArea ──

export interface PaneLayout {
  /** tr pane is open */
  hasRight: boolean
  /** bl pane is open */
  hasBottom: boolean
  /** br pane is open */
  hasBottomRight: boolean
}

// ── Configuration ──

export interface PaneStateConfig {
  /** Namespace for persisted state keys (unused directly here but forwarded for future use) */
  namespace?: string
  /** Initial left-column width in px (default: 500) */
  initialColumnSplit?: number
  /** Initial top-row height in px (default: 400) */
  initialRowSplit?: number
}

// ── Full pane state interface ──

export interface PaneState {
  /** All currently open pane groups (tl is always present) */
  activePanes: ComputedRef<ReadonlyMap<PaneId, PaneGroup>>

  /** Which pane the user last interacted with */
  focusedPaneId: Ref<PaneId>

  /** The currently focused PaneGroup (always defined — falls back to tl) */
  focusedPane: ComputedRef<PaneGroup>

  /** Derived layout flags used by SplitEditorArea to choose render config */
  layout: ComputedRef<PaneLayout>

  /**
   * Sizes for the outer horizontal split [left px, right px].
   * Bind to `SplitView` v-model:sizes for the column split.
   */
  columnSizes: Ref<[number, number]>

  /**
   * Sizes for the vertical splits [top px, bottom px].
   * Shared across left and right columns (uniform row heights).
   */
  rowSizes: Ref<[number, number]>

  // ── Pane lifecycle ──
  /** Create (if absent) a secondary pane and open a tab in it */
  openPane: (paneId: Exclude<PaneId, 'tl'>, tab: TabItem) => void
  /** Remove a secondary pane. Cascades: closing tr/bl also removes br. */
  closePane: (paneId: Exclude<PaneId, 'tl'>) => void
  /** Set the focused pane (does nothing if pane is not open) */
  focusPane: (paneId: PaneId) => void

  // ── Per-pane tab operations ──
  openTabInPane: (paneId: PaneId, tab: TabItem, opts?: { preview?: boolean }) => void
  closeTabInPane: (paneId: PaneId, tabId: ID) => void
  setActivePaneTab: (paneId: PaneId, tabId: ID) => void
  reorderPaneTabs: (paneId: PaneId, payload: { from: number; to: number }) => void
  markPaneDirty: (paneId: PaneId, tabId: ID) => void
  markPaneClean: (paneId: PaneId, tabId: ID) => void
  setPaneEditing: (paneId: PaneId, tabId: ID, editing: boolean) => void
  isPaneEditing: (paneId: PaneId, tabId: ID) => boolean

  // ── Split operations (move tab to a new pane) ──
  /**
   * Move `tabId` from `fromPaneId` to the pane to its right.
   * - tl|bl → tr
   * - tr → br (degrades to tr if bottom row absent)
   * - br → no-op
   */
  splitRight: (fromPaneId: PaneId, tabId: ID) => void
  /**
   * Move `tabId` from `fromPaneId` to the pane below it.
   * - tl → bl
   * - tr → br (degrades to bl if bl absent)
   * - bl|br → no-op
   */
  splitDown: (fromPaneId: PaneId, tabId: ID) => void

  // ── Utility ──
  /** Find which pane currently holds the given tab ID */
  findTabPane: (tabId: ID) => PaneId | null
  /** Return true if the given pane is currently open */
  isPaneOpen: (paneId: PaneId) => boolean
}

// ── Injection key ──

export const PaneKey: InjectionKey<PaneState> = Symbol('rig-panes')

// ── Internal helper: create a blank PaneGroup ──

function createPaneGroup(id: PaneId): PaneGroup {
  return {
    id,
    tabs: ref<TabItem[]>([]),
    activeTabId: ref<ID | null>(null),
    previewTabId: ref<ID | null>(null),
    dirtyTabs: ref(new Set<ID>()),
    editingTabs: ref(new Set<ID>()),
  }
}

// ── Factory ──

function createPaneState(config: PaneStateConfig = {}): PaneState {
  const tlGroup = createPaneGroup('tl')

  // Use shallowRef so Vue does NOT deep-convert the Map via reactive().
  // Deep conversion would auto-unwrap nested Refs on PaneGroup objects, breaking
  // all .tabs.value / .activeTabId.value accesses. Replacing the Map reference
  // (via replacePaneMap) still triggers reactivity correctly.
  const paneMap = shallowRef<Map<PaneId, PaneGroup>>(new Map([['tl', tlGroup]]))

  const focusedPaneId = ref<PaneId>('tl')

  const activePanes = computed(() => paneMap.value as ReadonlyMap<PaneId, PaneGroup>)

  const focusedPane = computed<PaneGroup>(() => {
    return paneMap.value.get(focusedPaneId.value) ?? tlGroup
  })

  const layout = computed<PaneLayout>(() => ({
    hasRight: paneMap.value.has('tr'),
    hasBottom: paneMap.value.has('bl'),
    hasBottomRight: paneMap.value.has('br'),
  }))

  const columnSizes = ref<[number, number]>([
    config.initialColumnSplit ?? 500,
    config.initialColumnSplit ?? 500,
  ])

  const rowSizes = ref<[number, number]>([
    config.initialRowSplit ?? 400,
    config.initialRowSplit ?? 400,
  ])

  // ── Helpers ──

  function getGroup(paneId: PaneId): PaneGroup | undefined {
    return paneMap.value.get(paneId)
  }

  function replacePaneMap(next: Map<PaneId, PaneGroup>): void {
    paneMap.value = next
  }

  // ── Pane lifecycle ──

  function openPane(paneId: Exclude<PaneId, 'tl'>, tab: TabItem): void {
    if (!paneMap.value.has(paneId)) {
      const next = new Map(paneMap.value)
      next.set(paneId, createPaneGroup(paneId))
      replacePaneMap(next)
    }
    openTabInPane(paneId, tab)
    focusedPaneId.value = paneId
  }

  function closePane(paneId: Exclude<PaneId, 'tl'>): void {
    if (!paneMap.value.has(paneId)) return

    const next = new Map(paneMap.value)
    next.delete(paneId)

    // Cascade: tr/bl closure removes br (orphan prevention)
    if ((paneId === 'tr' || paneId === 'bl') && next.has('br')) {
      next.delete('br')
      if (focusedPaneId.value === 'br') focusedPaneId.value = 'tl'
    }

    replacePaneMap(next)

    if (focusedPaneId.value === paneId) {
      focusedPaneId.value = 'tl'
    }
  }

  function focusPane(paneId: PaneId): void {
    if (paneMap.value.has(paneId)) {
      focusedPaneId.value = paneId
    }
  }

  // ── Per-pane tab operations ──

  function openTabInPane(paneId: PaneId, tab: TabItem, opts?: { preview?: boolean }): void {
    const group = getGroup(paneId)
    if (!group) return

    const existing = group.tabs.value.find((t) => t.id === tab.id)
    if (existing) {
      group.activeTabId.value = tab.id
      if (group.previewTabId.value === tab.id && !opts?.preview) {
        group.previewTabId.value = null
      }
      return
    }

    if (opts?.preview && group.previewTabId.value) {
      const idx = group.tabs.value.findIndex((t) => t.id === group.previewTabId.value)
      if (idx >= 0) {
        group.tabs.value.splice(idx, 1, tab)
      } else {
        group.tabs.value.unshift(tab)
      }
      group.previewTabId.value = tab.id
    } else if (opts?.preview) {
      group.tabs.value.unshift(tab)
      group.previewTabId.value = tab.id
    } else {
      group.tabs.value.unshift(tab)
      if (!opts?.preview) group.previewTabId.value = null
    }

    group.activeTabId.value = tab.id
  }

  function closeTabInPane(paneId: PaneId, tabId: ID): void {
    const group = getGroup(paneId)
    if (!group) return

    const idx = group.tabs.value.findIndex((t) => t.id === tabId)
    if (idx === -1) return

    group.tabs.value.splice(idx, 1)
    group.dirtyTabs.value.delete(tabId)
    group.editingTabs.value.delete(tabId)
    if (group.previewTabId.value === tabId) group.previewTabId.value = null

    if (group.activeTabId.value === tabId) {
      const next = group.tabs.value[idx] ?? group.tabs.value[idx - 1] ?? null
      group.activeTabId.value = next?.id ?? null
    }

    // Auto-close secondary pane when its last tab is removed
    if (paneId !== 'tl' && group.tabs.value.length === 0) {
      closePane(paneId as Exclude<PaneId, 'tl'>)
    }
  }

  function setActivePaneTab(paneId: PaneId, tabId: ID): void {
    const group = getGroup(paneId)
    if (group) group.activeTabId.value = tabId
  }

  function reorderPaneTabs(paneId: PaneId, payload: { from: number; to: number }): void {
    const group = getGroup(paneId)
    if (!group) return
    const tabs = group.tabs.value
    if (payload.from < 0 || payload.from >= tabs.length) return
    const adjusted = Math.min(
      payload.from < payload.to ? payload.to - 1 : payload.to,
      tabs.length - 1,
    )
    const tab = tabs.splice(payload.from, 1)[0]
    if (tab) tabs.splice(adjusted, 0, tab)
  }

  function markPaneDirty(paneId: PaneId, tabId: ID): void {
    const group = getGroup(paneId)
    if (!group) return
    group.dirtyTabs.value.add(tabId)
    const tab = group.tabs.value.find((t) => t.id === tabId)
    if (tab) tab.dirty = true
  }

  function markPaneClean(paneId: PaneId, tabId: ID): void {
    const group = getGroup(paneId)
    if (!group) return
    group.dirtyTabs.value.delete(tabId)
    const tab = group.tabs.value.find((t) => t.id === tabId)
    if (tab) tab.dirty = false
  }

  function setPaneEditing(paneId: PaneId, tabId: ID, editing: boolean): void {
    const group = getGroup(paneId)
    if (!group) return
    if (editing) {
      group.editingTabs.value.add(tabId)
      markPaneDirty(paneId, tabId)
    } else {
      group.editingTabs.value.delete(tabId)
    }
  }

  function isPaneEditing(paneId: PaneId, tabId: ID): boolean {
    return getGroup(paneId)?.editingTabs.value.has(tabId) ?? false
  }

  // ── Split operations (move) ──

  function extractTab(fromPaneId: PaneId, tabId: ID): TabItem | null {
    const group = getGroup(fromPaneId)
    if (!group) return null
    const tab = group.tabs.value.find((t) => t.id === tabId)
    if (!tab) return null
    closeTabInPane(fromPaneId, tabId)
    return tab
  }

  function splitRight(fromPaneId: PaneId, tabId: ID): void {
    if (fromPaneId === 'br') return // no-op

    const tab = extractTab(fromPaneId, tabId)
    if (!tab) return

    let target: Exclude<PaneId, 'tl'>
    if (fromPaneId === 'tl' || fromPaneId === 'bl') {
      target = 'tr'
    } else {
      // fromPaneId === 'tr'
      if (layout.value.hasBottom) {
        target = 'br'
      } else {
        // Degrade: no bottom row, open in tr (already exists)
        target = 'tr'
      }
    }

    openPane(target, tab)
  }

  function splitDown(fromPaneId: PaneId, tabId: ID): void {
    if (fromPaneId === 'bl' || fromPaneId === 'br') return // no-op

    const tab = extractTab(fromPaneId, tabId)
    if (!tab) return

    let target: Exclude<PaneId, 'tl'>
    if (fromPaneId === 'tl') {
      target = 'bl'
    } else {
      // fromPaneId === 'tr'
      if (layout.value.hasBottom) {
        target = 'br'
      } else {
        // No bl yet — create bl instead of br (keeps grid coherent)
        target = 'bl'
      }
    }

    openPane(target, tab)
  }

  // ── Utility ──

  function findTabPane(tabId: ID): PaneId | null {
    for (const [paneId, group] of paneMap.value) {
      if (group.tabs.value.some((t) => t.id === tabId)) return paneId
    }
    return null
  }

  function isPaneOpen(paneId: PaneId): boolean {
    return paneMap.value.has(paneId)
  }

  return {
    activePanes,
    focusedPaneId,
    focusedPane,
    layout,
    columnSizes,
    rowSizes,
    openPane,
    closePane,
    focusPane,
    openTabInPane,
    closeTabInPane,
    setActivePaneTab,
    reorderPaneTabs,
    markPaneDirty,
    markPaneClean,
    setPaneEditing,
    isPaneEditing,
    splitRight,
    splitDown,
    findTabPane,
    isPaneOpen,
  }
}

/**
 * Access the pane state.
 *
 * With `{ provide: true }`: creates the state and provides it via `PaneKey`.
 * Without options: injects from the nearest provider, or creates a standalone instance.
 */
export function usePaneState(options?: { provide?: boolean } & PaneStateConfig): PaneState {
  if (options?.provide) {
    const existing = inject(PaneKey, null)
    const state = existing ?? createPaneState(options)
    provide(PaneKey, state)
    return state
  }

  const injected = inject(PaneKey, null)
  if (injected) return injected
  return createPaneState(options)
}
