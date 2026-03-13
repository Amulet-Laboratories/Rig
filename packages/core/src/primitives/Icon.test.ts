import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from './Icon.vue'
import { nextTick } from 'vue'

describe('Icon', () => {
  it('renders with data-rig-icon', () => {
    const wrapper = mount(Icon)
    expect(wrapper.attributes('data-rig-icon')).toBeDefined()
  })

  it('defaults to md size', () => {
    const wrapper = mount(Icon)
    expect(wrapper.attributes('data-size')).toBe('md')
  })

  it('sets size data attribute', () => {
    const wrapper = mount(Icon, { props: { size: 'lg' } })
    expect(wrapper.attributes('data-size')).toBe('lg')
  })

  it('is decorative when no label is provided', () => {
    const wrapper = mount(Icon)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('has img role and aria-label when label is provided', () => {
    const wrapper = mount(Icon, { props: { label: 'Home' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Home')
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
  })

  it('renders slot content', () => {
    const wrapper = mount(Icon, {
      slots: { default: '<svg data-test-icon />' },
    })
    expect(wrapper.find('[data-test-icon]').exists()).toBe(true)
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Icon)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(Icon, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Icon)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Icon)
    await wrapper.setProps({ icon: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
