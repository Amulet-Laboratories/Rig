import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import DataGrid from './DataGrid.vue'
import type { DataGridColumn } from './DataGrid.vue'

const columns: DataGridColumn[] = [
  { key: 'id', label: '#', sortable: true, type: 'number', width: 70 },
  { key: 'name', label: 'Name', sortable: true, filter: 'text' },
  { key: 'kind', label: 'Kind', sortable: true, filter: 'select' },
  { key: 'amount', label: 'Amount', sortable: true, type: 'number' },
]

const KINDS = ['tool', 'site', 'library', 'service']
const rows = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Row ${i}`,
  kind: KINDS[i % KINDS.length]!,
  amount: (i * 37) % 9001,
}))

describe('DataGrid mount', () => {
  bench('default mount', () => {
    const w = mount(DataGrid)
    w.unmount()
  })
})

// 1000 rows is past the point where the render, not the maths, dominates —
// which is the case `virtual` and `pageSize` exist to fix. Keeping all three
// side by side is what makes a regression in either one visible.
describe('DataGrid at 1000 rows', () => {
  bench('mount all rows', () => {
    const w = mount(DataGrid, { props: { columns, rows } })
    w.unmount()
  })

  bench('mount paged (50)', () => {
    const w = mount(DataGrid, { props: { columns, rows, pageSize: 50 } })
    w.unmount()
  })

  bench('mount virtual', () => {
    const w = mount(DataGrid, { props: { columns, rows, virtual: true, rowHeight: 33 } })
    w.unmount()
  })

  bench('mount sorted by number', () => {
    const w = mount(DataGrid, {
      props: { columns, rows, sort: { column: 'amount', direction: 'asc' as const } },
    })
    w.unmount()
  })

  bench('mount filtered', () => {
    const w = mount(DataGrid, {
      props: { columns, rows, filters: { kind: 'tool' }, search: '7' },
    })
    w.unmount()
  })
})
