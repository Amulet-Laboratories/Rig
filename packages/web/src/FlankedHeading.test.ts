import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FlankedHeading from './FlankedHeading.vue'

describe('FlankedHeading', () => {
  it('renders with data-rig-flanked-heading', () => {
    const wrapper = mount(FlankedHeading, { slots: { default: '<h2>Title</h2>' } })
    expect(wrapper.find('[data-rig-flanked-heading]').exists()).toBe(true)
  })

  it('renders default slot content', () => {
    const wrapper = mount(FlankedHeading, {
      slots: { default: '<h2>Section Title</h2>' },
    })
    expect(wrapper.find('h2').text()).toBe('Section Title')
  })

  it('renders left and right ornaments', () => {
    const wrapper = mount(FlankedHeading, { slots: { default: '<h2>Title</h2>' } })
    const ornaments = wrapper.findAll('[data-rig-flanked-heading-ornament]')
    expect(ornaments).toHaveLength(2)
    expect(ornaments[0]!.attributes('data-side')).toBe('left')
    expect(ornaments[1]!.attributes('data-side')).toBe('right')
  })

  it('renders left and right rules', () => {
    const wrapper = mount(FlankedHeading, { slots: { default: '<h2>Title</h2>' } })
    const rules = wrapper.findAll('[data-rig-flanked-heading-rule]')
    expect(rules).toHaveLength(2)
    expect(rules[0]!.attributes('data-side')).toBe('left')
    expect(rules[1]!.attributes('data-side')).toBe('right')
  })

  it('ornaments are aria-hidden', () => {
    const wrapper = mount(FlankedHeading, { slots: { default: '<h2>Title</h2>' } })
    const ornaments = wrapper.findAll('[data-rig-flanked-heading-ornament]')
    expect(ornaments[0]!.attributes('aria-hidden')).toBe('true')
    expect(ornaments[1]!.attributes('aria-hidden')).toBe('true')
  })

  it('renders default SVG flourishes', () => {
    const wrapper = mount(FlankedHeading, { slots: { default: '<h2>Title</h2>' } })
    expect(wrapper.findAll('[data-rig-flanked-heading-svg]')).toHaveLength(2)
  })

  it('renders custom ornament-left slot', () => {
    const wrapper = mount(FlankedHeading, {
      slots: {
        default: '<h2>Title</h2>',
        'ornament-left': '<span class="custom-left">*</span>',
      },
    })
    expect(wrapper.find('.custom-left').exists()).toBe(true)
    expect(wrapper.findAll('[data-rig-flanked-heading-svg]')).toHaveLength(1)
  })

  it('renders custom ornament-right slot', () => {
    const wrapper = mount(FlankedHeading, {
      slots: {
        default: '<h2>Title</h2>',
        'ornament-right': '<span class="custom-right">*</span>',
      },
    })
    expect(wrapper.find('.custom-right').exists()).toBe(true)
    expect(wrapper.findAll('[data-rig-flanked-heading-svg]')).toHaveLength(1)
  })
})
