import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VirtualGrid from './VirtualGrid.vue'

interface Thing {
  id: string
  name: string
}

const items: Thing[] = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i}`,
  name: `Thing ${i}`,
}))

// jsdom never measures: container width 600, height 300. minColumnWidth 140
// → 4 columns; square cells → row height 144.
function make(props: Record<string, unknown> = {}) {
  return mount(VirtualGrid<Thing>, {
    props: { items, ariaLabel: 'Things', ...props },
    slots: {
      item: `<template #item="{ item }"><span class="nm">{{ item.name }}</span></template>`,
    },
  })
}

describe('VirtualGrid', () => {
  it('renders with data-rig-virtual-grid and listbox role', () => {
    const wrapper = make()
    expect(wrapper.attributes('data-rig-virtual-grid')).toBe('')
    expect(wrapper.attributes('role')).toBe('listbox')
    expect(wrapper.attributes('aria-label')).toBe('Things')
  })

  it('exposes the grid geometry as custom properties', () => {
    const wrapper = make()
    const style = wrapper.attributes('style')!
    expect(style).toContain('--rig-virtual-grid-columns: 4')
    expect(style).toContain('--rig-virtual-grid-gap: 8px')
    expect(style).toContain('--rig-virtual-grid-row-height: 144px')
  })

  it('renders rows of cells with the item slot', () => {
    const wrapper = make()
    expect(wrapper.findAll('[data-rig-virtual-grid-row]').length).toBeGreaterThan(0)
    expect(wrapper.findAll('[data-rig-virtual-grid-cell]')).toHaveLength(12)
    expect(wrapper.find('.nm').text()).toBe('Thing 0')
  })

  it('shows the empty slot when there are no items', () => {
    const wrapper = mount(VirtualGrid, {
      props: { items: [] },
      slots: { empty: 'Nothing here' },
    })
    expect(wrapper.find('[data-rig-virtual-grid-empty]').text()).toBe('Nothing here')
  })

  it('click sets the active model to the item key', async () => {
    const wrapper = make()
    await wrapper.findAll('[data-rig-virtual-grid-cell]')[3]!.trigger('click')
    expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['t3'])
  })

  it('marks the active cell and points aria-activedescendant at it', async () => {
    const wrapper = make({ active: 't2' })
    await wrapper.vm.$nextTick()
    const cell = wrapper.findAll('[data-rig-virtual-grid-cell]')[2]!
    expect(cell.attributes('data-active')).not.toBeUndefined()
    expect(wrapper.attributes('aria-activedescendant')).toBe(cell.attributes('id'))
  })

  it('ctrl-click toggles selection when selectable', async () => {
    const wrapper = make({ selectable: true })
    await wrapper.findAll('[data-rig-virtual-grid-cell]')[1]!.trigger('click', { ctrlKey: true })
    expect(wrapper.emitted('update:selection')?.at(-1)).toEqual([['t1']])
    expect(wrapper.emitted('select')?.at(-1)).toEqual([
      { item: items[1], index: 1, selected: true },
    ])
  })

  it('plain click does not select', async () => {
    const wrapper = make({ selectable: true })
    await wrapper.findAll('[data-rig-virtual-grid-cell]')[1]!.trigger('click')
    expect(wrapper.emitted('update:selection')).toBeUndefined()
  })

  it('shift-click selects the range from the anchor', async () => {
    const wrapper = make({ selectable: true })
    const cells = wrapper.findAll('[data-rig-virtual-grid-cell]')
    await cells[2]!.trigger('click')
    await cells[5]!.trigger('click', { shiftKey: true })
    expect(wrapper.emitted('update:selection')?.at(-1)).toEqual([['t2', 't3', 't4', 't5']])
  })

  it('marks selected cells', () => {
    const wrapper = make({ selectable: true, selection: ['t0', 't2'] })
    const cells = wrapper.findAll('[data-rig-virtual-grid-cell]')
    expect(cells[0]!.attributes('data-selected')).not.toBeUndefined()
    expect(cells[0]!.attributes('aria-selected')).toBe('true')
    expect(cells[1]!.attributes('data-selected')).toBeUndefined()
    expect(cells[2]!.attributes('data-selected')).not.toBeUndefined()
  })

  it('arrow keys move the active cell in grid geometry', async () => {
    const wrapper = make({ active: 't0' })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['t1'])
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    // 4 columns → down from index 1 is index 5
    expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['t5'])
    await wrapper.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['t11'])
    await wrapper.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['t0'])
  })

  it('Enter activates the active item', async () => {
    const wrapper = make({ active: 't7' })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('activate')?.at(-1)).toEqual([{ item: items[7], index: 7 }])
  })

  it('double-click activates', async () => {
    const wrapper = make()
    await wrapper.findAll('[data-rig-virtual-grid-cell]')[4]!.trigger('dblclick')
    expect(wrapper.emitted('activate')?.at(-1)).toEqual([{ item: items[4], index: 4 }])
  })

  it('Space toggles selection of the active cell when selectable', async () => {
    const wrapper = make({ selectable: true, active: 't3' })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:selection')?.at(-1)).toEqual([['t3']])
    expect(wrapper.emitted('select')?.at(-1)).toEqual([
      { item: items[3], index: 3, selected: true },
    ])
  })

  it('Escape clears the selection', async () => {
    const wrapper = make({ selectable: true, selection: ['t1', 't2'] })
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:selection')?.at(-1)).toEqual([[]])
  })

  it('emits contextmenu with the item and event', async () => {
    const wrapper = make()
    await wrapper.findAll('[data-rig-virtual-grid-cell]')[6]!.trigger('contextmenu')
    const payload = wrapper.emitted('contextmenu')?.at(-1)?.[0] as { item: Thing }
    expect(payload.item).toEqual(items[6])
  })

  it('emits visible-range for the rendered window', async () => {
    const many = Array.from({ length: 100 }, (_, i) => ({ id: `m${i}`, name: `M${i}` }))
    const wrapper = mount(VirtualGrid<Thing>, {
      props: { items: many, columns: 4, rowHeight: 100, overscan: 0 },
    })
    await wrapper.vm.$nextTick()
    const first = wrapper.emitted('visible-range')?.[0]?.[0] as { start: number; end: number }
    expect(first.start).toBe(0)
    expect(first.end).toBeGreaterThan(0)
    expect(first.end).toBeLessThan(99)
  })

  it('itemKey accepts a function', async () => {
    const wrapper = mount(VirtualGrid<Thing>, {
      props: { items, itemKey: (t: Thing) => t.name },
    })
    await wrapper.findAll('[data-rig-virtual-grid-cell]')[0]!.trigger('click')
    expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['Thing 0'])
  })
})
