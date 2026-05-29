import { describe, bench } from 'vitest'
import { usePersistedState } from './usePersistedState'

describe('usePersistedState', () => {
  bench('invoke usePersistedState', () => {
    usePersistedState('bench-key', { count: 0 })
  })
})
