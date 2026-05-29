import { describe, bench } from 'vitest'
import { useVirtualList } from './useVirtualList'

const items = () => Array.from({ length: 100 }, (_, i) => ({ id: `item-${i}`, label: `Item ${i}` }))

describe('useVirtualList', () => {
  bench('invoke useVirtualList', () => {
    useVirtualList(items, { itemHeight: 28 })
  })
})
