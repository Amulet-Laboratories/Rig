import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatRow from './StatRow.vue'

const stats = [
  { value: '128', label: 'Components' },
  { value: '12', label: 'Packages' },
  { value: '16', label: 'Themes', change: '+4' },
]

describe('StatRow', () => {
  it('renders with data-rig-stat-row', () => {
    const wrapper = mount(StatRow, { props: { stats } })
    expect(wrapper.find('[data-rig-stat-row]').exists()).toBe(true)
  })

  it('defaults variant to bordered', () => {
    const wrapper = mount(StatRow, { props: { stats } })
    expect(wrapper.find('[data-rig-stat-row]').attributes('data-variant')).toBe('bordered')
  })

  it('accepts card variant', () => {
    const wrapper = mount(StatRow, { props: { stats, variant: 'card' } })
    expect(wrapper.find('[data-rig-stat-row]').attributes('data-variant')).toBe('card')
  })

  it('accepts filled variant', () => {
    const wrapper = mount(StatRow, { props: { stats, variant: 'filled' } })
    expect(wrapper.find('[data-rig-stat-row]').attributes('data-variant')).toBe('filled')
  })

  it('renders all stat items', () => {
    const wrapper = mount(StatRow, { props: { stats } })
    expect(wrapper.findAll('[data-rig-stat-row-item]')).toHaveLength(3)
  })

  it('renders stat value and label', () => {
    const wrapper = mount(StatRow, { props: { stats } })
    const items = wrapper.findAll('[data-rig-stat-row-item]')
    expect(items[0].find('[data-rig-stat-row-value]').text()).toBe('128')
    expect(items[0].find('[data-rig-stat-row-label]').text()).toBe('Components')
  })

  it('renders change when present', () => {
    const wrapper = mount(StatRow, { props: { stats } })
    const items = wrapper.findAll('[data-rig-stat-row-item]')
    expect(items[2].find('[data-rig-stat-row-change]').text()).toBe('+4')
  })

  it('hides change when not present', () => {
    const wrapper = mount(StatRow, { props: { stats } })
    const items = wrapper.findAll('[data-rig-stat-row-item]')
    expect(items[0].find('[data-rig-stat-row-change]').exists()).toBe(false)
  })

  it('renders section element', () => {
    const wrapper = mount(StatRow, { props: { stats } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
