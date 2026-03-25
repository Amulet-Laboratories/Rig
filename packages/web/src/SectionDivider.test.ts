import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionDivider from './SectionDivider.vue'

describe('SectionDivider', () => {
  it('renders with data-rig-section-divider', () => {
    const wrapper = mount(SectionDivider)
    expect(wrapper.find('[data-rig-section-divider]').exists()).toBe(true)
  })

  it('defaults variant to organic', () => {
    const wrapper = mount(SectionDivider)
    expect(wrapper.find('[data-rig-section-divider]').attributes('data-variant')).toBe('organic')
  })

  it('accepts wave variant', () => {
    const wrapper = mount(SectionDivider, { props: { variant: 'wave' } })
    expect(wrapper.find('[data-rig-section-divider]').attributes('data-variant')).toBe('wave')
  })

  it('accepts angular variant', () => {
    const wrapper = mount(SectionDivider, { props: { variant: 'angular' } })
    expect(wrapper.find('[data-rig-section-divider]').attributes('data-variant')).toBe('angular')
  })

  it('sets data-flip when flip is true', () => {
    const wrapper = mount(SectionDivider, { props: { flip: true } })
    expect(wrapper.find('[data-rig-section-divider]').attributes('data-flip')).toBeDefined()
  })

  it('does not set data-flip when flip is false', () => {
    const wrapper = mount(SectionDivider, { props: { flip: false } })
    expect(wrapper.find('[data-rig-section-divider]').attributes('data-flip')).toBeUndefined()
  })

  it('is aria-hidden', () => {
    const wrapper = mount(SectionDivider)
    expect(wrapper.find('[data-rig-section-divider]').attributes('aria-hidden')).toBe('true')
  })

  it('renders SVG with viewBox', () => {
    const wrapper = mount(SectionDivider)
    const svg = wrapper.find('[data-rig-section-divider-svg]')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox') ?? svg.attributes('viewbox')).toBe('0 0 1440 80')
  })

  it('renders default path', () => {
    const wrapper = mount(SectionDivider)
    expect(wrapper.find('[data-rig-section-divider-path]').exists()).toBe(true)
  })

  it('renders custom slot content instead of default path', () => {
    const wrapper = mount(SectionDivider, {
      slots: { default: '<circle cx="50" cy="50" r="40" />' },
    })
    expect(wrapper.find('[data-rig-section-divider-path]').exists()).toBe(false)
    expect(wrapper.find('circle').exists()).toBe(true)
  })
})
