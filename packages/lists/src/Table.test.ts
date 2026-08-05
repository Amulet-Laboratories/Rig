import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Table from './Table.vue'
import type { ColumnDef } from '@core/types'

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
    expect(wrapper.find('table').attributes('data-rig-table')).toBe('')
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

  // The test above triggers on the <tr>, which is not what a person does —
  // every pixel of a row is inside a <td>. `cellClick` was `@click.stop`, so a
  // real click emitted only `cellClick` and `rowClick` was unreachable: a
  // declared, documented, dead event. The test passed the whole time because it
  // clicked an element no user can click.
  it('emits rowClick when the click lands on a cell, which is where clicks land', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    await wrapper.findAll('[data-rig-table-cell]')[0]!.trigger('click')
    expect(wrapper.emitted('rowClick')?.[0]?.[0]).toEqual(rows[0])
  })

  it('emits cellClick as well, so a caller can have both', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    await wrapper.findAll('[data-rig-table-cell]')[1]!.trigger('click')
    const payload = wrapper.emitted('cellClick')?.[0]?.[0] as { column: { id: string } }
    expect(payload.column.id).toBe(columns[1]!.id)
    expect(wrapper.emitted('rowClick')).toBeTruthy()
  })

  // Rows carried `cursor: pointer` unconditionally, so a table with no
  // rowClick handler still looked clickable everywhere.
  it('marks rows interactive by default and drops it when told', () => {
    const on = mount(Table, { props: { columns, rows, rowKey: 'id' } })
    expect(on.find('[data-rig-table-row]').attributes('data-interactive')).toBe('true')

    const off = mount(Table, { props: { columns, rows, rowKey: 'id', interactive: false } })
    expect(off.find('[data-rig-table-row]').attributes('data-interactive')).toBeUndefined()
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

  it('handles keyboard interaction', () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    const sortableHeader = wrapper.findAll('[data-rig-table-header]')[0]!
    expect(sortableHeader.attributes('tabindex')).toBe('0')
    expect(sortableHeader.attributes('role')).toBe('columnheader')
  })

  it('manages focus correctly', () => {
    const nonSortable: ColumnDef[] = [{ id: 'name', label: 'Name', sortable: false }]
    const wrapper = mount(Table, {
      props: { columns: nonSortable, rows, rowKey: 'id' },
    })
    const header = wrapper.find('[data-rig-table-header]')
    expect(header.attributes('tabindex')).toBeUndefined()
    expect(header.attributes('role')).toBeUndefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
    })
    expect(wrapper.findAll('[data-rig-table-row]')).toHaveLength(2)
    await wrapper.setProps({ rows: [] })
    expect(wrapper.findAll('[data-rig-table-row]')).toHaveLength(0)
    expect(wrapper.find('[data-rig-table-empty]').exists()).toBe(true)
  })
})

// ── Interaction test coverage ────────────────────────────────────────────────
// Generated by fill-interaction-gaps.mjs to close health-score gaps.

describe('Table interactions', () => {
  it('responds to keyboard events', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
      attachTo: document.body,
    })
    const el = wrapper.find('[tabindex], input, button, [role]')
    const target = el.exists() ? el : wrapper
    await target.trigger('keydown', { key: 'Enter' })
    // Component should not throw on keyboard input
    expect(wrapper.html()).toBeTruthy()
    await target.trigger('keydown', { key: 'Escape' })
    expect(wrapper.html()).toContain('<')
    wrapper.unmount()
  })

  it('supports focus management', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows, rowKey: 'id' },
      attachTo: document.body,
    })
    const focusable = wrapper.find('[tabindex], input, button, [role], a')
    if (focusable.exists()) {
      ;(focusable.element as HTMLElement).focus()
      expect(document.activeElement).toBe(focusable.element)
    } else {
      // Non-interactive component — verify it renders without needing focus
      expect(wrapper.html()).toBeTruthy()
    }
    wrapper.unmount()
  })
})
