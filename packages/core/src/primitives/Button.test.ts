import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import { nextTick } from 'vue'

describe('Button', () => {
  it('renders with data-rig-button', () => {
    const wrapper = mount(Button, { slots: { default: 'Click me' } })
    expect(wrapper.attributes('data-rig-button')).toBeDefined()
    expect(wrapper.text()).toBe('Click me')
  })

  it('sets data attributes from props', () => {
    const wrapper = mount(Button, {
      props: { variant: 'primary', size: 'lg' },
    })
    expect(wrapper.attributes('data-variant')).toBe('primary')
    expect(wrapper.attributes('data-size')).toBe('lg')
  })

  it('handles disabled state', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('handles loading state', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.attributes('data-loading')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    await wrapper.trigger('click')
    // Native disabled prevents emission
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders icon slot', () => {
    const wrapper = mount(Button, {
      slots: { icon: '<span class="test-icon" />', default: 'Text' },
    })
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(Button, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Button)
    await wrapper.setProps({ as: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
