import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import List from './List.vue'
import type { ID } from '@core/types'

interface ListItem {
  id: ID
  label: string
}

function generateItems(count: number): ListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    label: `Item ${i}`,
  }))
}

describe('List mount', () => {
  bench('10 items', () => {
    const w = mount(List, { props: { items: generateItems(10) } })
    w.unmount()
  })

  bench('100 items', () => {
    const w = mount(List, { props: { items: generateItems(100) } })
    w.unmount()
  })

  bench('1000 items', () => {
    const w = mount(List, { props: { items: generateItems(1000) } })
    w.unmount()
  })
})

describe('List selection update', () => {
  const items = generateItems(500)

  bench('select single item', async () => {
    const w = mount(List, { props: { items, selected: 'item-0' } })
    await w.setProps({ selected: 'item-250' })
    w.unmount()
  })
})
