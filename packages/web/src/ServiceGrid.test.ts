import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceGrid from './ServiceGrid.vue'

const items = [
  { id: '1', title: 'Web Design', description: 'Beautiful sites' },
  { id: '2', title: 'Software', description: 'Custom tools' },
  { id: '3', title: 'Support', description: 'Ongoing help' },
]

describe('ServiceGrid', () => {
  it('renders with data-rig-service-grid', () => {
    const wrapper = mount(ServiceGrid, { props: { items } })
    expect(wrapper.find('[data-rig-service-grid]').exists()).toBe(true)
  })

  it('defaults to grid layout with 3 columns', () => {
    const wrapper = mount(ServiceGrid, { props: { items } })
    const el = wrapper.find('[data-rig-service-grid]')
    expect(el.attributes('data-layout')).toBe('grid')
    expect(el.attributes('data-columns')).toBe('3')
  })

  it('renders correct number of items', () => {
    const wrapper = mount(ServiceGrid, { props: { items } })
    expect(wrapper.findAll('[data-rig-service-grid-item]')).toHaveLength(3)
  })

  it('renders titles', () => {
    const wrapper = mount(ServiceGrid, { props: { items } })
    const titles = wrapper.findAll('[data-rig-service-grid-title]')
    expect(titles[0]!.text()).toBe('Web Design')
    expect(titles[1]!.text()).toBe('Software')
  })

  it('renders descriptions', () => {
    const wrapper = mount(ServiceGrid, { props: { items } })
    const descs = wrapper.findAll('[data-rig-service-grid-description]')
    expect(descs[0]!.text()).toBe('Beautiful sites')
  })

  it('accepts list layout', () => {
    const wrapper = mount(ServiceGrid, { props: { items, layout: 'list' } })
    expect(wrapper.find('[data-rig-service-grid]').attributes('data-layout')).toBe('list')
  })

  it('renders numbers in numbered layout', () => {
    const wrapper = mount(ServiceGrid, { props: { items, layout: 'numbered' } })
    const numbers = wrapper.findAll('[data-rig-service-grid-number]')
    expect(numbers).toHaveLength(3)
    expect(numbers[0]!.text()).toBe('01')
    expect(numbers[2]!.text()).toBe('03')
  })

  it('does not render numbers in grid layout', () => {
    const wrapper = mount(ServiceGrid, { props: { items } })
    expect(wrapper.find('[data-rig-service-grid-number]').exists()).toBe(false)
  })

  it('accepts custom columns', () => {
    const wrapper = mount(ServiceGrid, { props: { items, columns: 4 } })
    expect(wrapper.find('[data-rig-service-grid]').attributes('data-columns')).toBe('4')
  })

  it('hides description when not provided', () => {
    const noDesc = [{ id: '1', title: 'Only title' }]
    const wrapper = mount(ServiceGrid, { props: { items: noDesc } })
    expect(wrapper.find('[data-rig-service-grid-description]').exists()).toBe(false)
  })
})
