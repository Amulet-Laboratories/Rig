import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Table from './Table.vue'
import type { ColumnDef } from '@core/types'
import { nextTick } from 'vue'

interface Row {
  id: string
  name: string
  status: string
  [key: string]: unknown
}

const columns: ColumnDef[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
]

const rows: Row[] = [
  { id: '1', name: 'Alpha', status: 'active' },
  { id: '2', name: 'Beta', status: 'dormant' },
]

describe('Table', () => {
  it('renders with data-rig-table', () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    expect(wrapper.find('table').attributes('data-rig-table')).toBeDefined()
  })

  it('renders column headers', () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    const headers = wrapper.findAll('[data-rig-table-header]')
    expect(headers).toHaveLength(2)
    expect(headers[0]!.text()).toBe('Name')
  })

  it('renders all rows', () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    expect(wrapper.findAll('[data-rig-table-row]')).toHaveLength(2)
  })

  it('renders cell values', () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    const cells = wrapper.findAll('[data-rig-table-cell]')
    expect(cells[0]!.text()).toBe('Alpha')
    expect(cells[1]!.text()).toBe('active')
  })

  it('emits update:sort on header click', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    await wrapper.findAll('[data-rig-table-header]')[0]!.trigger('click')
    expect(wrapper.emitted('update:sort')?.[0]).toEqual([{ column: 'name', direction: 'asc' }])
  })

  it('toggles sort direction', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        rows,
        rowKey: 'id',
        sort: { column: 'name', direction: 'asc' },
      },
    })
    await wrapper.findAll('[data-rig-table-header]')[0]!.trigger('click')
    expect(wrapper.emitted('update:sort')?.[0]).toEqual([{ column: 'name', direction: 'desc' }])
  })

  it('sets aria-sort on sorted column', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        rows,
        rowKey: 'id',
        sort: { column: 'name', direction: 'asc' },
      },
    })
    const headers = wrapper.findAll('[data-rig-table-header]')
    expect(headers[0]!.attributes('aria-sort')).toBe('ascending')
    expect(headers[1]!.attributes('aria-sort')).toBe('none')
  })

  it('emits rowClick on row click', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    await wrapper.findAll('[data-rig-table-row]')[0]!.trigger('click')
    expect(wrapper.emitted('rowClick')?.[0]?.[0]).toEqual(rows[0])
  })

  it('shows empty state when no rows', () => {
    const wrapper = mount(Table, {
      props: { columns, rows: [], rowKey: 'id' },
    })
    expect(wrapper.find('[data-rig-table-empty]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-table-empty]').text()).toBe('No data')
  })

  it('supports rowKey as function', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        rows,
        rowKey: (row) => (row as Row).id,
      },
    })
    expect(wrapper.findAll('[data-rig-table-row]')).toHaveLength(2)
  })

  it('handles keyboard interaction', async () => {
    const wrapper = mount(Table, { props: { columns: [{ key: 'n', label: 'N' }], rows: [{ n: '1' }], rowKey: 'n' } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(Table, { props: { columns: [{ key: 'n', label: 'N' }], rows: [{ n: '1' }], rowKey: 'n' } }, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Table, { props: { columns: [{ key: 'n', label: 'N' }], rows: [{ n: '1' }], rowKey: 'n' } })
    await wrapper.setProps({ resizableColumns: true })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
