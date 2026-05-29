import { ref, inject, provide } from 'vue'
import type { ID, TabItem } from '../types'
import { GlobalStateKey, type GlobalState } from '../injection-keys'
import { usePersistedState } from './usePersistedState'

function createGlobalState(): GlobalState {
  const openEditors = ref<TabItem[]>([])
  const activeEditorId = ref<ID | null>(null)
  const sidebarVisible = ref(true)
  const panelVisible = ref(true)
  const sizes = usePersistedState('rig-layout-sizes', {
    sideWidth: 260,
    panelHeight: 200,
  })

  function openEditor(tab: TabItem) {
    const existing = openEditors.value.find((t) => t.id === tab.id)
    if (!existing) {
      openEditors.value.push(tab)
    }
    activeEditorId.value = tab.id
  }

  function closeEditor(id: ID) {
    const idx = openEditors.value.findIndex((t) => t.id === id)
    if (idx === -1) return

    openEditors.value.splice(idx, 1)

    if (activeEditorId.value === id) {
      // Activate the next tab, or previous, or null
      const next = openEditors.value[idx] ?? openEditors.value[idx - 1] ?? null
      activeEditorId.value = next?.id ?? null
    }
  }

  function setActiveEditor(id: ID | null) {
    activeEditorId.value = id
  }

  function toggleSidebar() {
    sidebarVisible.value = !sidebarVisible.value
  }

  function togglePanel() {
    panelVisible.value = !panelVisible.value
  }

  return {
    openEditors,
    activeEditorId,
    sidebarVisible,
    panelVisible,
    sizes,
    openEditor,
    closeEditor,
    setActiveEditor,
    toggleSidebar,
    togglePanel,
  }
}

/**
 * Access the global layout state.
 *
 * When called with `{ provide: true }`, creates and provides the state.
 * Otherwise injects the existing state, falling back to a standalone instance.
 */
export function useGlobalState(options?: { provide?: boolean }): GlobalState {
  if (options?.provide) {
    const state = createGlobalState()
    provide(GlobalStateKey, state)
    return state
  }

  const injected = inject(GlobalStateKey, null)
  if (injected) return injected

  // Graceful degradation: standalone instance
  return createGlobalState()
}
