import { describe, bench } from 'vitest'
import { useKeyboard } from './useKeyboard'

const shortcuts = {
  'Ctrl+S': () => {},
  'Ctrl+Z': () => {},
  Escape: () => {},
}

describe('useKeyboard', () => {
  bench('invoke useKeyboard', () => {
    useKeyboard(shortcuts)
  })
})
