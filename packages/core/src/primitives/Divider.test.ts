import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from './Divider.vue'

describe('Divider', () => {
  it('renders with data-rig-divider and role separator', () => {
    const wrapper = mount(Divider)
    expect(wrapper.attributes('data-rig-divider')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('separator')
  })

  it('defaults to horizontal orientation', () => {
    const wrapper = mount(Divider)
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.attributes('data-vertical')).toBeUndefined()
  })

  it('supports vertical orientation', () => {
    const wrapper = mount(Divider, { props: { vertical: true } })
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.attributes('data-vertical')).toBeDefined()
  })

  it('renders label text', () => {
    const wrapper = mount(Divider, { props: { label: 'OR' } })
    expect(wrapper.find('[data-rig-divider-label]').text()).toBe('OR')
  })

  it('renders slot content as label', () => {
    const wrapper = mount(Divider, { slots: { default: 'Section' } })
    expect(wrapper.find('[data-rig-divider-label]').text()).toBe('Section')
  })

  it('hides label span when no label or slot', () => {
    const wrapper = mount(Divider)
    expect(wrapper.find('[data-rig-divider-label]').exists()).toBe(false)
  })
})
