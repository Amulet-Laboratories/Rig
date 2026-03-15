import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import DataGrid from './DataGrid.vue'

describe('DataGrid mount', () => {
  bench('default mount', () => {
    const w = mount(DataGrid)
    w.unmount()
  })
})
