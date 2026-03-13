import { describe, bench } from 'vitest'
import { useCommandRegistry } from './useCommandRegistry'

describe('useCommandRegistry', () => {
  bench('invoke useCommandRegistry', () => {
    useCommandRegistry()
  })
})
