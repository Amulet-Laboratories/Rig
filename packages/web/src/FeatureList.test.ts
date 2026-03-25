import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FeatureList from './FeatureList.vue'

const items = [
  { id: '1', text: 'Free WiFi', detail: 'Available in all rooms' },
  { id: '2', text: 'Pool', detail: 'Heated, open year-round' },
  { id: '3', text: 'Parking' },
]

describe('FeatureList', () => {
  it('renders with data-rig-feature-list', () => {
    const wrapper = mount(FeatureList, { props: { items } })
    expect(wrapper.find('[data-rig-feature-list]').exists()).toBe(true)
  })

  it('defaults to list layout with 2 columns', () => {
    const wrapper = mount(FeatureList, { props: { items } })
    const el = wrapper.find('[data-rig-feature-list]')
    expect(el.attributes('data-layout')).toBe('list')
    expect(el.attributes('data-columns')).toBe('2')
  })

  it('renders correct number of items', () => {
    const wrapper = mount(FeatureList, { props: { items } })
    expect(wrapper.findAll('[data-rig-feature-list-item]')).toHaveLength(3)
  })

  it('renders text content', () => {
    const wrapper = mount(FeatureList, { props: { items } })
    const texts = wrapper.findAll('[data-rig-feature-list-text]')
    expect(texts[0]!.text()).toBe('Free WiFi')
    expect(texts[2]!.text()).toBe('Parking')
  })

  it('renders detail when provided', () => {
    const wrapper = mount(FeatureList, { props: { items } })
    const details = wrapper.findAll('[data-rig-feature-list-detail]')
    expect(details).toHaveLength(2)
    expect(details[0]!.text()).toBe('Available in all rooms')
  })

  it('hides detail when not provided', () => {
    const noDetail = [{ id: '1', text: 'Simple item' }]
    const wrapper = mount(FeatureList, { props: { items: noDetail } })
    expect(wrapper.find('[data-rig-feature-list-detail]').exists()).toBe(false)
  })

  it('accepts grid layout', () => {
    const wrapper = mount(FeatureList, { props: { items, layout: 'grid' } })
    expect(wrapper.find('[data-rig-feature-list]').attributes('data-layout')).toBe('grid')
  })

  it('accepts inline layout', () => {
    const wrapper = mount(FeatureList, { props: { items, layout: 'inline' } })
    expect(wrapper.find('[data-rig-feature-list]').attributes('data-layout')).toBe('inline')
  })

  it('accepts custom columns', () => {
    const wrapper = mount(FeatureList, { props: { items, columns: 3 } })
    expect(wrapper.find('[data-rig-feature-list]').attributes('data-columns')).toBe('3')
  })

  it('does not render icon when slot not provided', () => {
    const wrapper = mount(FeatureList, { props: { items } })
    expect(wrapper.find('[data-rig-feature-list-icon]').exists()).toBe(false)
  })
})
