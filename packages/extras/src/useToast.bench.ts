import { describe, bench } from 'vitest'
import { useToast } from './useToast'

describe('useToast', () => {
  bench('invoke useToast', () => {
    useToast()
  })
})
