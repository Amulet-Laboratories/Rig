import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Table from './Table.vue'

describe('Table mount', () => {
  bench('default mount', () => {
    const w = mount(Table, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [{ name: 'Test' }],
        rowKey: 'name',
      },
    })
    w.unmount()
  })
})
