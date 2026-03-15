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
    const selected = wrapper.findAll('[data-rig-list-item]')[1]!
    expect(selected.attributes('data-selected')).toBeDefined()
    expect(selected.attributes('aria-selected')).toBe('true')
  })

  it('emits update:selected on click', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.findAll('[data-rig-list-item]')[1]!.trigger('click')
    expect(wrapper.emitted('update:selected')?.[0]).toEqual(['b'])
  })

  it('does not select disabled items', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.findAll('[data-rig-list-item]')[2]!.trigger('click')
    expect(wrapper.emitted('update:selected')).toBeUndefined()
  })

  it('emits activate on double-click', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.findAll('[data-rig-list-item]')[0]!.trigger('dblclick')
    expect(wrapper.emitted('activate')?.[0]?.[0]).toEqual(items[0])
  })

  it('supports roving tabindex', () => {
    const wrapper = mount(List, { props: { items } })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[0]!.attributes('tabindex')).toBe('0')
    expect(listItems[1]!.attributes('tabindex')).toBe('-1')
  })

  it('moves focus on ArrowDown', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[1]!.attributes('data-highlighted')).toBeDefined()
  })

  it('renders description when provided', () => {
    const wrapper = mount(List, { props: { items } })
    expect(wrapper.find('[data-rig-list-item-description]').text()).toBe('Fourth letter')
  })

  it('marks disabled items', () => {
    const wrapper = mount(List, { props: { items } })
    const disabled = wrapper.findAll('[data-rig-list-item]')[2]!
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

  it('manages focus correctly', async () => {
    const wrapper = mount(List, { props: { items }, attachTo: document.body })
    const firstItem = wrapper.findAll('[data-rig-list-item]')[0]!
    expect(firstItem.attributes('tabindex')).toBe('0')
    ;(firstItem.element as HTMLElement).focus()
    expect(document.activeElement).toBe(firstItem.element)
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(List, { props: { items } })
    expect(wrapper.attributes('aria-multiselectable')).toBeUndefined()
    await wrapper.setProps({ multiSelect: true })
    expect(wrapper.attributes('aria-multiselectable')).toBe('true')
  })

  it('multi-select replaces selection when clicking without Ctrl', async () => {
    const wrapper = mount(List, {
      props: { items, multiSelect: true, selected: ['a', 'b'] },
    })
    await wrapper.findAll('[data-rig-list-item]')[1]!.trigger('click')
    expect(wrapper.emitted('update:selected')?.[0]).toEqual([['b']])
  })

  it('multi-select toggles item on with Ctrl+click', async () => {
    const wrapper = mount(List, {
      props: { items, multiSelect: true, selected: ['a'] },
    })
    await wrapper.findAll('[data-rig-list-item]')[1]!.trigger('click', { ctrlKey: true })
    expect(wrapper.emitted('update:selected')?.[0]).toEqual([['a', 'b']])
  })

  it('multi-select toggles item off with Ctrl+click', async () => {
    const wrapper = mount(List, {
      props: { items, multiSelect: true, selected: ['a', 'b'] },
    })
    await wrapper.findAll('[data-rig-list-item]')[1]!.trigger('click', { ctrlKey: true })
    expect(wrapper.emitted('update:selected')?.[0]).toEqual([['a']])
  })

  it('marks multiple items as selected when selected is an array', () => {
    const wrapper = mount(List, {
      props: { items, multiSelect: true, selected: ['a', 'd'] },
    })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[0]!.attributes('aria-selected')).toBe('true')
    expect(listItems[1]!.attributes('aria-selected')).toBe('false')
    expect(listItems[3]!.attributes('aria-selected')).toBe('true')
  })

  it('moves focus on ArrowUp', async () => {
    const wrapper = mount(List, { props: { items }, attachTo: document.body })
    // Move down first, then up
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[0]!.attributes('data-highlighted')).toBeDefined()
    wrapper.unmount()
  })

  it('ArrowUp does not go below index 0', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[0]!.attributes('data-highlighted')).toBeDefined()
  })

  it('ArrowDown does not go past last item', async () => {
    const wrapper = mount(List, { props: { items } })
    // Press ArrowDown more times than items exist
    for (let i = 0; i < 10; i++) {
      await wrapper.trigger('keydown', { key: 'ArrowDown' })
    }
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[3]!.attributes('data-highlighted')).toBeDefined()
    expect(listItems[3]!.attributes('tabindex')).toBe('0')
  })

  it('Home key moves focus to first item', async () => {
    const wrapper = mount(List, { props: { items }, attachTo: document.body })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'Home' })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[0]!.attributes('data-highlighted')).toBeDefined()
    expect(listItems[0]!.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('End key moves focus to last item', async () => {
    const wrapper = mount(List, { props: { items }, attachTo: document.body })
    await wrapper.trigger('keydown', { key: 'End' })
    const listItems = wrapper.findAll('[data-rig-list-item]')
    expect(listItems[3]!.attributes('data-highlighted')).toBeDefined()
    expect(listItems[3]!.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('Enter key emits activate for focused item', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('activate')?.[0]?.[0]).toEqual(items[0])
  })

  it('Enter key does not activate disabled focused item', async () => {
    const wrapper = mount(List, { props: { items } })
    // Move to index 2 (disabled item)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('activate')).toBeUndefined()
  })

  it('Space key emits update:selected for focused item', async () => {
    const wrapper = mount(List, { props: { items } })
    // Move to index 1 (Beta)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:selected')?.[0]).toEqual(['b'])
  })

  it('Space key does not select disabled focused item', async () => {
    const wrapper = mount(List, { props: { items } })
    // Move to index 2 (disabled)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:selected')).toBeUndefined()
  })

  it('does not activate disabled items on double-click', async () => {
    const wrapper = mount(List, { props: { items } })
    await wrapper.findAll('[data-rig-list-item]')[2]!.trigger('dblclick')
    expect(wrapper.emitted('activate')).toBeUndefined()
  })

  it('emits contextmenu with item and event on right-click', async () => {
    const wrapper = mount(List, { props: { items }, attachTo: document.body })
    await wrapper.findAll('[data-rig-list-item]')[0]!.trigger('contextmenu')
    const emitted = wrapper.emitted('contextmenu')
    expect(emitted).toHaveLength(1)
    expect(emitted![0]![0]).toMatchObject({ item: items[0] })
    wrapper.unmount()
  })

  it('renders custom slot content', () => {
    const wrapper = mount(List, {
      props: { items },
      slots: {
        item: `<template #item="{ item }"><span class="custom">{{ item.label }}</span></template>`,
      },
    })
    // When a custom slot is provided, the default label span should not render
    expect(wrapper.find('[data-rig-list-item-label]').exists()).toBe(false)
    const customs = wrapper.findAll('.custom')
    expect(customs).toHaveLength(4)
    expect(customs[0]!.text()).toBe('Alpha')
  })
})
