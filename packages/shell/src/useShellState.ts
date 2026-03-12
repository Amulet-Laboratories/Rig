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
  const openTabs = ref<TabItem[]>([])
  const activeTabId = ref<ID | null>(null)
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
  const panelVisible = usePersistedState(`${ns}:panel-visible`, false)
  const panelHeight = usePersistedState(`${ns}:panel-height`, config.panelHeight ?? 200)
  const activePanelTab = usePersistedState<string>(`${ns}:panel-tab`, 'output')

  // ─── Auxiliary panel (chat, AI, etc.) ───
  const auxOpen = usePersistedState(`${ns}:aux-open`, false)
  const auxWidth = usePersistedState(`${ns}:aux-width`, config.auxWidth ?? 320)

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
    const tab = openTabs.value[0]
    if (tab?.dirty) dirtyTabs.value.add(tab.id)
  }

  function closeAllTabs() {
    openTabs.value = []
    activeTabId.value = null
    previewTabId.value = null
    dirtyTabs.value.clear()
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
    closeAllTabs,
    reorderTabs,
    markDirty,
    markClean,

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
 * With `{ provide: true }`: creates state and provides it via injection.
 * Without: injects from parent, falling back to a standalone instance.
 */
export function useShellState(
  options?: { provide?: boolean } & ShellConfig,
): ShellState {
  if (options?.provide) {
    const state = createShellState(options)
    provide(ShellKey, state)
    return state
  }

  const injected = inject(ShellKey, null)
  if (injected) return injected

  return createShellState(options)
}
