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

  // Flush a pending write when the scope goes away, rather than letting the
  // timer outlive the component that owns it. Two reasons:
  //
  // - Correctness: toggle something and navigate away inside the debounce window
  //   and the write is simply lost.
  // - Isolation: the timer fires 100ms later regardless of who is around by
  //   then. In tests that means one test's write lands in the middle of the
  //   next one — which is half of why workbench-flows was flaky.
  //
  // Flush rather than cancel: the last value is the one worth keeping.
  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (!writeTimer) return
      clearTimeout(writeTimer)
      writeTimer = null
      try {
        store?.setItem(key, JSON.stringify(state.value))
      } catch {
        // Storage full or unavailable
      }
    })
  }

  // Cross-tab sync — only registered within a component/effect scope so the
  // listener is always cleaned up. Outside a scope (e.g. a Pinia store) the
  // listener would leak permanently, so we skip it there intentionally.
  if (typeof window !== 'undefined' && getCurrentScope()) {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || !e.newValue) return
      try {
        state.value = JSON.parse(e.newValue) as T
      } catch {
        // Ignore
      }
    }
    window.addEventListener('storage', onStorage)
    onScopeDispose(() => window.removeEventListener('storage', onStorage))
  }

  return state
}
