import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuList from './MenuList.vue'

const items = [
  { id: '1', name: 'Pale Ale', description: 'Citrus-forward', price: '$7', note: 'seasonal' },
  { id: '2', name: 'Stout', description: 'Rich and dark', price: '$8' },
  { id: '3', name: 'Water', description: 'Still or sparkling' },
]

describe('MenuList', () => {
  it('renders with data-rig-menu-list', () => {
    const wrapper = mount(MenuList, { props: { items } })
    expect(wrapper.find('[data-rig-menu-list]').exists()).toBe(true)
  })

  it('renders correct number of items', () => {
    const wrapper = mount(MenuList, { props: { items } })
    expect(wrapper.findAll('[data-rig-menu-list-item]')).toHaveLength(3)
  })

  it('renders item names', () => {
    const wrapper = mount(MenuList, { props: { items } })
    const names = wrapper.findAll('[data-rig-menu-list-name]')
    expect(names[0]!.text()).toContain('Pale Ale')
    expect(names[1]!.text()).toContain('Stout')
  })

  it('renders descriptions', () => {
    const wrapper = mount(MenuList, { props: { items } })
    const descs = wrapper.findAll('[data-rig-menu-list-description]')
    expect(descs[0]!.text()).toBe('Citrus-forward')
  })

  it('renders prices', () => {
    const wrapper = mount(MenuList, { props: { items } })
    const prices = wrapper.findAll('[data-rig-menu-list-price]')
    expect(prices[0]!.text()).toBe('$7')
    expect(prices[1]!.text()).toBe('$8')
  })

  it('auto-detects priced when items have prices', () => {
    const wrapper = mount(MenuList, { props: { items, priced: true } })
    expect(wrapper.find('[data-rig-menu-list]').html()).toContain('data-priced')
  })

  it('renders note when provided', () => {
    const wrapper = mount(MenuList, { props: { items } })
    const notes = wrapper.findAll('[data-rig-menu-list-note]')
    expect(notes).toHaveLength(1)
    expect(notes[0]!.text()).toBe('seasonal')
  })

  it('hides description when not provided', () => {
    const noDesc = [{ id: '1', name: 'Bread', price: '$3' }]
    const wrapper = mount(MenuList, { props: { items: noDesc } })
    expect(wrapper.find('[data-rig-menu-list-description]').exists()).toBe(false)
  })

  it('handles items without price', () => {
    const free = [{ id: '1', name: 'Bread' }]
    const wrapper = mount(MenuList, { props: { items: free } })
    expect(wrapper.find('[data-rig-menu-list-price]').exists()).toBe(false)
  })
})
