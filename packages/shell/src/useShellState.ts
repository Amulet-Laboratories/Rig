/**
 * useShellState — Portable IDE shell state composable.
 *
 * Manages tabs (with preview/dirty/reorder), sidebar, bottom panel,
 * auxiliary panel, activity bar, and settings view. Framework for a
 * VSCode-style workbench without any domain-specific logic.
 *
 * Consumers extend by adding domain-specific methods that delegate
 * to openTab(), closeTab(), etc.
 *
 * @example
 * ```ts
 * const shell = useShellState({ provide: true })
 * // ...or inject in child components:
 * const shell = useShellState()
 * ```
 */

import { ref, computed, inject, provide, watch } from 'vue'
import { usePersistedState } from '@core/composables'
import type { ID, TabItem } from '@core/types'
import type { ShellState, ShellConfig } from './types'
import { ShellKey } from './types'

function createShellState(config: ShellConfig = {}): ShellState {
  const ns = config.namespace ?? 'rig-shell'

  // ─── Tab state ───
  const openTabs = ref<TabItem[]>(config.initialTabs ?? [])
  const activeTabId = ref<ID | null>(config.initialActiveTabId ?? null)
  const previewTabId = ref<ID | null>(null)
  const dirtyTabs = ref<Set<ID>>(new Set())

  // ─── Activity bar ───
  const activeActivity = usePersistedState<string>(
    `${ns}:activity`,
    config.defaultActivity ?? 'explorer',
  )

  // ─── Sidebar ───
  const sidebarVisible = usePersistedState(`${ns}:sidebar-visible`, true)
  const sidebarWidth = usePersistedState(`${ns}:sidebar-width`, config.sidebarWidth ?? 260)

  // ─── Bottom panel ───
  const panelVisible = usePersistedState(`${ns}:panel-visible`, config.initialPanelVisible ?? false)
  const panelHeight = usePersistedState(`${ns}:panel-height`, config.panelHeight ?? 200)
  const activePanelTab = usePersistedState<string>(
    `${ns}:panel-tab`,
    config.initialPanelTab ?? 'output',
  )

  // ─── Auxiliary panel (chat, AI, etc.) ───
  const auxOpen = usePersistedState(`${ns}:aux-open`, false)
  const auxWidth = usePersistedState(`${ns}:aux-width`, config.auxWidth ?? 320)

  // Clamp persisted aux width to sane range
  if (auxWidth.value < 200 || auxWidth.value > 800) {
    auxWidth.value = config.auxWidth ?? 320
  }

  // ─── Settings ───
  const settingsOpen = ref(false)

  // ─── Shell sizes (for ShellGrid v-model) ───
  const shellSizes = computed(() => ({
    sideWidth: sidebarVisible.value ? sidebarWidth.value : 0,
    panelHeight: panelVisible.value ? panelHeight.value : 0,
  }))

  function onShellResize(sizes: { sideWidth: number; panelHeight: number }) {
    if (sizes.sideWidth > 0) sidebarWidth.value = sizes.sideWidth
    if (sizes.panelHeight > 0) panelHeight.value = sizes.panelHeight
  }

  // ─── Computed ───
  const activeTab = computed(() => openTabs.value.find((t) => t.id === activeTabId.value))
  const dirtyTabCount = computed(() => openTabs.value.filter((t) => t.dirty).length)

  // ─── Tab operations ───

  function openTab(tab: TabItem, opts?: { preview?: boolean }) {
    settingsOpen.value = false

    const existing = openTabs.value.find((t) => t.id === tab.id)
    if (existing) {
      activeTabId.value = tab.id
      // Un-preview when explicitly opening
      if (previewTabId.value === tab.id && !opts?.preview) {
        previewTabId.value = null
      }
      return
    }

    // Replace existing preview tab
    if (opts?.preview && previewTabId.value) {
      const previewIdx = openTabs.value.findIndex((t) => t.id === previewTabId.value)
      if (previewIdx >= 0) {
        openTabs.value.splice(previewIdx, 1, tab)
      } else {
        openTabs.value.push(tab)
      }
      previewTabId.value = tab.id
    } else if (opts?.preview) {
      openTabs.value.push(tab)
      previewTabId.value = tab.id
    } else {
      openTabs.value.push(tab)
      previewTabId.value = null
    }

    activeTabId.value = tab.id
  }

  function closeTab(id: ID) {
    const idx = openTabs.value.findIndex((t) => t.id === id)
    if (idx === -1) return

    openTabs.value.splice(idx, 1)
    dirtyTabs.value.delete(id)
    editingTabs.value.delete(id)
    if (previewTabId.value === id) previewTabId.value = null

    if (activeTabId.value === id) {
      const next = openTabs.value[idx] ?? openTabs.value[idx - 1] ?? null
      activeTabId.value = next?.id ?? null
    }
  }

  function closeOtherTabs(id: ID) {
    openTabs.value = openTabs.value.filter((t) => t.id === id)
    activeTabId.value = id
    dirtyTabs.value.clear()
    const wasEditing = editingTabs.value.has(id)
    editingTabs.value.clear()
    if (wasEditing) editingTabs.value.add(id)
    const tab = openTabs.value[0]
    if (tab?.dirty) dirtyTabs.value.add(tab.id)
  }

  function closeTabsToRight(id: ID) {
    const idx = openTabs.value.findIndex((t) => t.id === id)
    if (idx === -1) return
    const removed = openTabs.value.splice(idx + 1)
    for (const t of removed) {
      dirtyTabs.value.delete(t.id)
      editingTabs.value.delete(t.id)
      if (previewTabId.value === t.id) previewTabId.value = null
    }
    if (activeTabId.value && !openTabs.value.find((t) => t.id === activeTabId.value)) {
      activeTabId.value = id
    }
  }

  function closeAllTabs() {
    openTabs.value = []
    activeTabId.value = null
    previewTabId.value = null
    dirtyTabs.value.clear()
    editingTabs.value.clear()
  }

  function reorderTabs(payload: { from: number; to: number }) {
    const tab = openTabs.value.splice(payload.from, 1)[0]
    if (tab) openTabs.value.splice(payload.to, 0, tab)
  }

  function markDirty(id: ID) {
    dirtyTabs.value.add(id)
    const tab = openTabs.value.find((t) => t.id === id)
    if (tab) tab.dirty = true
  }

  function markClean(id: ID) {
    dirtyTabs.value.delete(id)
    const tab = openTabs.value.find((t) => t.id === id)
    if (tab) tab.dirty = false
  }

  // ─── Item operations (convenience layer) ───

  function openItem(
    id: ID,
    label: string,
    data?: unknown,
    opts?: { preview?: boolean; edit?: boolean },
  ) {
    const existing = openTabs.value.find((t) => t.id === id)
    if (existing) {
      activeTabId.value = id
      if (opts?.edit) {
        editingTabs.value.add(id)
        markDirty(id)
      }
      return
    }

    const tab: TabItem = {
      id,
      label,
      dirty: opts?.edit ?? false,
      closable: true,
      data,
    }

    openTab(tab, { preview: opts?.preview })
    if (opts?.edit) {
      editingTabs.value.add(id)
      markDirty(id)
    }
  }

  // ─── Editing state ───

  const editingTabs = ref<Set<ID>>(new Set())

  function setEditing(id: ID, editing: boolean) {
    if (editing) {
      editingTabs.value.add(id)
      markDirty(id)
    } else {
      editingTabs.value.delete(id)
    }
  }

  function isEditing(id: ID): boolean {
    return editingTabs.value.has(id)
  }

  // ─── Active tab data ───

  const activeTabData = computed<unknown>(() => activeTab.value?.data ?? null)

  // ─── Toggles ───

  function toggleSidebar() {
    sidebarVisible.value = !sidebarVisible.value
  }

  function togglePanel() {
    panelVisible.value = !panelVisible.value
  }

  function toggleAux() {
    auxOpen.value = !auxOpen.value
  }

  function openSettings() {
    settingsOpen.value = true
    activeTabId.value = null
  }

  // ─── Active tab change callback (for URL sync etc.) ───
  if (config.onActiveTabChange) {
    watch(activeTab, (tab) => {
      config.onActiveTabChange!(tab ?? null)
    })
  }

  return {
    // Tabs
    openTabs,
    activeTabId,
    activeTab,
    previewTabId,
    dirtyTabs,
    dirtyTabCount,
    openTab,
    closeTab,
    closeOtherTabs,
    closeTabsToRight,
    closeAllTabs,
    reorderTabs,
    markDirty,
    markClean,

    // Item operations
    openItem,

    // Editing
    editingTabs,
    setEditing,
    isEditing,

    // Active tab data
    activeTabData,

    // Activity bar
    activeActivity,

    // Sidebar
    sidebarVisible,
    sidebarWidth,
    toggleSidebar,

    // Bottom panel
    panelVisible,
    panelHeight,
    activePanelTab,
    togglePanel,

    // Auxiliary panel
    auxOpen,
    auxWidth,
    toggleAux,

    // Settings
    settingsOpen,
    openSettings,

    // Shell grid
    shellSizes,
    onShellResize,
  }
}

/**
 * Access the IDE shell state.
 *
 * With `{ provide: true }`: injects existing shell if available, otherwise
 * creates state from config and provides it. This lets a parent component
 * own the shell while still allowing IdeShell to re-provide it downward.
 *
 * Without: injects from parent, falling back to a standalone instance.
 */
export function useShellState(options?: { provide?: boolean } & ShellConfig): ShellState {
  if (options?.provide) {
    const existing = inject(ShellKey, null)
    const state = existing ?? createShellState(options)
    provide(ShellKey, state)
    return state
  }

  const injected = inject(ShellKey, null)
  if (injected) return injected

  return createShellState(options)
}
