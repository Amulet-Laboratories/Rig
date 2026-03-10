import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import List from './List.vue'
import type { ListItem } from '@core/types'

const items: ListItem[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma', disabled: true },
  { id: 'd', label: 'Delta', description: 'Fourth letter' },
]

describe('List', () => {
  it('renders with data-rig-list and listbox role', () => {
    const wrapper = mount(List, { props: { items } })
    expect(wrapper.attributes('data-rig-list')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('listbox')
  })

  it('renders all items', () => {
    const wrapper = mount(List, { props: { items } })
    expect(wrapper.findAll('[data-rig-list-item]')).toHaveLength(4)
  })

  it('marks selected item', () => {
    const wrapper = mount(List, { props: { items, selected: 'b' } })
    const selected = wrapper.findAll('[data-rig-list-item]')[1]
    expect(selected.attributes('data-selected')).toBeDefined()
    expect(selected.attributes('aria-selected')).toBe('true')
  })

  it('emits update:selected on click', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.findAll('[data-rig-list-item]')[1].trigger('click')
    expect(wrapper.emitted('update:selected')?.[0]).toEqual(['b'])
  })

  it('does not select disabled items', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.findAll('[data-rig-list-item]')[2].trigger('click')
    expect(wrapper.emitted('update:selected')).toBeUndefined()
  })

  it('emits activate on double-click', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.findAll('[data-rig-list-item]')[0].trigger('dblclick')
    expect(wrapper.emitted('activate')?.[0]?.[0]).toEqual(items[0])
  })

  it('supports roving tabindex', () => {
    const wrapper = mount(List, { props: { items } })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[0].attributes('tabindex')).toBe('0')
    expect(listItems[1].attributes('tabindex')).toBe('-1')
  })

  it('moves focus on ArrowDown', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[1].attributes('data-highlighted')).toBeDefined()
  })

  it('renders description when provided', () => {
    const wrapper = mount(List, { props: { items } })
    expect(wrapper.find('[data-rig-list-item-description]').text()).toBe('Fourth letter')
  })

  it('marks disabled items', () => {
    const wrapper = mount(List, { props: { items } })
    const disabled = wrapper.findAll('[data-rig-list-item]')[2]
    expect(disabled.attributes('data-disabled')).toBeDefined()
  })

  it('sets data-virtual attribute when virtual=true', () => {
    const wrapper = mount(List, { props: { items, virtual: true } })
    expect(wrapper.attributes('data-virtual')).toBeDefined()
  })

  it('does not set data-virtual when virtual=false', () => {
    const wrapper = mount(List, { props: { items, virtual: false } })
    expect(wrapper.attributes('data-virtual')).toBeUndefined()
  })

  it('renders items in virtual mode', () => {
    // In jsdom containerHeight=0 so virtualState falls back to overscan logic;
    // all items are still rendered because 4 items fit within the overscan window.
    const wrapper = mount(List, { props: { items, virtual: true, itemHeight: 24 } })
    expect(wrapper.findAll('[data-rig-list-item]').length).toBeGreaterThan(0)
  })
})
