import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { usePersistedState } from './usePersistedState'

function createMockStorage(): Storage {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    get length() {
      return store.size
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
  }
}

describe('usePersistedState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value when storage is empty', () => {
    const storage = createMockStorage()
    const state = usePersistedState('test-key', 42, storage)
    expect(state.value).toBe(42)
  })

  it('hydrates from storage on creation', () => {
    const storage = createMockStorage()
    storage.setItem('test-key', JSON.stringify(100))
    const state = usePersistedState('test-key', 42, storage)
    expect(state.value).toBe(100)
  })

  it('persists changes to storage (debounced)', async () => {
    const storage = createMockStorage()
    const state = usePersistedState('test-key', 42, storage)

    state.value = 99
    await nextTick()

    // Not yet persisted (debounce)
    expect(storage.getItem('test-key')).toBeNull()

    vi.advanceTimersByTime(150)
    expect(storage.getItem('test-key')).toBe(JSON.stringify(99))
  })

  it('handles objects with deep watching', async () => {
    const storage = createMockStorage()
    const state = usePersistedState('obj-key', { a: 1, b: 2 }, storage)

    state.value.a = 10
    await nextTick()
    vi.advanceTimersByTime(150)

    expect(JSON.parse(storage.getItem('obj-key')!)).toEqual({ a: 10, b: 2 })
  })

  it('ignores invalid JSON in storage', () => {
    const storage = createMockStorage()
    storage.setItem('bad-key', 'not-json!')
    const state = usePersistedState('bad-key', 'fallback', storage)
    expect(state.value).toBe('fallback')
  })

  it('survives storage quota exceeded on write', async () => {
    const storage = createMockStorage()
    const original = storage.setItem.bind(storage)
    let shouldThrow = false
    storage.setItem = (key: string, value: string) => {
      if (shouldThrow) throw new DOMException('QuotaExceededError')
      original(key, value)
    }

    const state = usePersistedState('quota-key', 'hello', storage)
    shouldThrow = true
    state.value = 'too-large'
    await nextTick()
    vi.advanceTimersByTime(150)

    // State still reflects the in-memory value even though storage write failed
    expect(state.value).toBe('too-large')
    // Storage still has no persisted value for this key
    expect(storage.getItem('quota-key')).toBeNull()
  })

  it('ignores malformed cross-tab storage events', async () => {
    const storage = createMockStorage()
    const state = usePersistedState('cross-key', { x: 1 }, storage)

    // Dispatch a storage event with invalid JSON
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cross-key',
        newValue: '{not valid json!!!',
      }),
    )
    await nextTick()

    // Value should remain unchanged
    expect(state.value).toEqual({ x: 1 })
  })

  it('uses initial value when no storage is available (SSR)', () => {
    // Pass undefined explicitly to simulate SSR (no localStorage)
    const state = usePersistedState('ssr-key', 'default', undefined as unknown as Storage)
    expect(state.value).toBe('default')

    // Mutations still work in-memory
    state.value = 'updated'
    expect(state.value).toBe('updated')
  })
})
