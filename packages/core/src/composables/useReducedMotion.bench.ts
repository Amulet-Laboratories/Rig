import { describe, bench } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  bench('invoke useReducedMotion', () => {
    useReducedMotion()
  })
})
