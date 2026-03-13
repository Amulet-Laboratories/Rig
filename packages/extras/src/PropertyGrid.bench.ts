import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import PropertyGrid from './PropertyGrid.vue'

describe('PropertyGrid mount', () => {
  bench('default mount', () => {
    const w = mount(PropertyGrid, { props: { items: [{ key: 'Name', value: 'Test' }] } })
    w.unmount()
  })
})
