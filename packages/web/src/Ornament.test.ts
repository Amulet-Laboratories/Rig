import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Ornament from './Ornament.vue'

describe('Ornament', () => {
  it('renders with data-rig-ornament', () => {
    const wrapper = mount(Ornament)
    expect(wrapper.find('[data-rig-ornament]').exists()).toBe(true)
  })

  it('defaults to flourish variant', () => {
    const wrapper = mount(Ornament)
    expect(wrapper.find('[data-rig-ornament]').attributes('data-variant')).toBe('flourish')
  })

  it('defaults to md size', () => {
    const wrapper = mount(Ornament)
    expect(wrapper.find('[data-rig-ornament]').attributes('data-size')).toBe('md')
  })

  it('is aria-hidden', () => {
    const wrapper = mount(Ornament)
    expect(wrapper.find('[data-rig-ornament]').attributes('aria-hidden')).toBe('true')
  })

  it('renders flourish SVG by default', () => {
    const wrapper = mount(Ornament)
    expect(wrapper.find('[data-rig-ornament-svg]').exists()).toBe(true)
    expect(wrapper.find('path').exists()).toBe(true)
  })

  it('accepts rule variant', () => {
    const wrapper = mount(Ornament, { props: { variant: 'rule' } })
    expect(wrapper.find('[data-rig-ornament]').attributes('data-variant')).toBe('rule')
    expect(wrapper.find('line').exists()).toBe(true)
  })

  it('accepts diamond variant', () => {
    const wrapper = mount(Ornament, { props: { variant: 'diamond' } })
    expect(wrapper.find('[data-rig-ornament]').attributes('data-variant')).toBe('diamond')
  })

  it('accepts dots variant', () => {
    const wrapper = mount(Ornament, { props: { variant: 'dots' } })
    expect(wrapper.find('[data-rig-ornament]').attributes('data-variant')).toBe('dots')
    expect(wrapper.findAll('circle')).toHaveLength(3)
  })

  it('accepts sm size', () => {
    const wrapper = mount(Ornament, { props: { size: 'sm' } })
    expect(wrapper.find('[data-rig-ornament]').attributes('data-size')).toBe('sm')
  })

  it('accepts lg size', () => {
    const wrapper = mount(Ornament, { props: { size: 'lg' } })
    expect(wrapper.find('[data-rig-ornament]').attributes('data-size')).toBe('lg')
  })

  it('renders custom slot content instead of default SVG', () => {
    const wrapper = mount(Ornament, {
      slots: { default: '<span class="custom">custom ornament</span>' },
    })
    expect(wrapper.find('.custom').exists()).toBe(true)
    expect(wrapper.find('[data-rig-ornament-svg]').exists()).toBe(false)
  })
})
