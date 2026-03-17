import { describe, bench } from 'vitest'
import { useScrollVisibility } from './useScrollVisibility'

describe('useScrollVisibility', () => {
  bench('invoke useScrollVisibility', () => {
    useScrollVisibility()
  })
})
