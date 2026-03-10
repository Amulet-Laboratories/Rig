import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Resizer from './Resizer.vue'

describe('Resizer', () => {
  it('renders with data-rig-resizer and separator role', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('data-rig-resizer')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('separator')
  })

  it('sets orientation attributes', () => {
    const h = mount(Resizer, { props: { orientation: 'horizontal' } })
    expect(h.attributes('data-orientation')).toBe('horizontal')
    expect(h.attributes('aria-orientation')).toBe('horizontal')

    const v = mount(Resizer, { props: { orientation: 'vertical' } })
    expect(v.attributes('data-orientation')).toBe('vertical')
  })

  it('defaults to horizontal', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('is focusable', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('tabindex')).toBe('0')
  })
})
