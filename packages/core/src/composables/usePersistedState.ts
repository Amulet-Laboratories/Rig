import { ref, watch, getCurrentScope, onScopeDispose, type Ref } from 'vue'

/**
 * Reactive state that persists to Storage (localStorage by default).
 * Debounces writes by 100ms. Listens for cross-tab `storage` events.
 */
export function usePersistedState<T>(key: string, initial: T, storage?: Storage): Ref<T> {
  const store = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined)
  const state = ref<T>(initial) as Ref<T>

  // Hydrate from storage
  if (store) {
    try {
      const raw = store.getItem(key)
      if (raw !== null) {
        state.value = JSON.parse(raw) as T
      }
    } catch {
      // Ignore parse errors, keep initial
    }
  }

  // Debounced write
  let writeTimer: ReturnType<typeof setTimeout> | null = null

  watch(
    state,
    (val) => {
      if (!store) return
      if (writeTimer) clearTimeout(writeTimer)
      writeTimer = setTimeout(() => {
        try {
          store.setItem(key, JSON.stringify(val))
        } catch {
          // Storage full or unavailable
        }
      }, 100)
    },
    { deep: true },
  )

  // Cross-tab sync
  if (typeof window !== 'undefined') {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || !e.newValue) return
      try {
        state.value = JSON.parse(e.newValue) as T
      } catch {
        // Ignore
      }
    }
    window.addEventListener('storage', onStorage)
    if (getCurrentScope()) {
      onScopeDispose(() => window.removeEventListener('storage', onStorage))
    }
  }

  return state
}
