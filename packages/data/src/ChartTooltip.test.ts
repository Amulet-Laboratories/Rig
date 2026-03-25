import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChartTooltip from './ChartTooltip.vue'

describe('ChartTooltip', () => {
  it('renders when show is true', () => {
    const wrapper = mount(ChartTooltip, { props: { show: true, x: 10, y: 20 } })
    expect(wrapper.find('[data-rig-chart-tooltip]').exists()).toBe(true)
  })

  it('does not render when show is false', () => {
    const wrapper = mount(ChartTooltip, { props: { show: false } })
    expect(wrapper.find('[data-rig-chart-tooltip]').exists()).toBe(false)
  })

  it('positions with left and top style', () => {
    const wrapper = mount(ChartTooltip, { props: { show: true, x: 50, y: 100 } })
    const el = wrapper.find('[data-rig-chart-tooltip]')
    expect(el.attributes('style')).toContain('left: 50px')
    expect(el.attributes('style')).toContain('top: 100px')
  })

  it('has role tooltip', () => {
    const wrapper = mount(ChartTooltip, { props: { show: true } })
    expect(wrapper.find('[data-rig-chart-tooltip]').attributes('role')).toBe('tooltip')
  })

  it('renders slot content', () => {
    const wrapper = mount(ChartTooltip, {
      props: { show: true },
      slots: { default: '<span class="tip">$42</span>' },
    })
    expect(wrapper.find('.tip').text()).toBe('$42')
  })

  it('reacts to show toggle', async () => {
    const wrapper = mount(ChartTooltip, { props: { show: false } })
    expect(wrapper.find('[data-rig-chart-tooltip]').exists()).toBe(false)
    await wrapper.setProps({ show: true })
    expect(wrapper.find('[data-rig-chart-tooltip]').exists()).toBe(true)
  })
})
