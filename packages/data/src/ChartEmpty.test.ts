import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChartEmpty from './ChartEmpty.vue'

describe('ChartEmpty', () => {
  it('renders with data-rig-chart-empty', () => {
    const wrapper = mount(ChartEmpty)
    expect(wrapper.find('[data-rig-chart-empty]').exists()).toBe(true)
  })

  it('shows default label', () => {
    const wrapper = mount(ChartEmpty)
    expect(wrapper.find('[data-rig-chart-empty-label]').text()).toBe('No data to visualize')
  })

  it('shows custom label', () => {
    const wrapper = mount(ChartEmpty, { props: { label: 'Empty chart' } })
    expect(wrapper.find('[data-rig-chart-empty-label]').text()).toBe('Empty chart')
  })

  it('shows hint when provided', () => {
    const wrapper = mount(ChartEmpty, { props: { hint: 'Add some entries' } })
    expect(wrapper.find('[data-rig-chart-empty-hint]').text()).toBe('Add some entries')
  })

  it('hides hint when empty', () => {
    const wrapper = mount(ChartEmpty)
    expect(wrapper.find('[data-rig-chart-empty-hint]').exists()).toBe(false)
  })

  it('shows default icon', () => {
    const wrapper = mount(ChartEmpty)
    expect(wrapper.find('[data-rig-chart-empty-icon]').text()).toBe('\u25CB')
  })

  it('shows custom icon', () => {
    const wrapper = mount(ChartEmpty, { props: { icon: '📊' } })
    expect(wrapper.find('[data-rig-chart-empty-icon]').text()).toBe('📊')
  })

  it('has role status', () => {
    const wrapper = mount(ChartEmpty)
    expect(wrapper.find('[data-rig-chart-empty]').attributes('role')).toBe('status')
  })

  it('renders slot content', () => {
    const wrapper = mount(ChartEmpty, {
      slots: { default: '<button>Add Data</button>' },
    })
    expect(wrapper.find('button').text()).toBe('Add Data')
  })
})
