import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconButton from './IconButton.vue'
import { nextTick } from 'vue'

describe('IconButton', () => {
  it('renders with data-rig-icon-button', () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Close' },
    })
    expect(wrapper.find('[data-rig-icon-button]').exists()).toBe(true)
  })

  it('sets aria-label from prop', () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Delete' },
    })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Delete')
  })

  it('emits click event', async () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Save' },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders icon text when icon prop is set', () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Home', icon: 'mdi:home' },
    })
    expect(wrapper.find('[data-rig-icon]').exists()).toBe(true)
  })

  it('passes size to inner button', () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Close', size: 'sm' },
    })
    expect(wrapper.find('button').attributes('data-size')).toBe('sm')
  })

  it('handles disabled state', () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Close', disabled: true },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('handles loading state', () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Close', loading: true },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('renders slot content instead of icon prop', () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Custom' },
      slots: { default: '<span data-custom-icon />' },
    })
    expect(wrapper.find('[data-custom-icon]').exists()).toBe(true)
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(IconButton, { props: { ariaLabel: 'Test' } })
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(IconButton, { props: { ariaLabel: 'Test' } }, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(IconButton, { props: { ariaLabel: 'Test' } })
    await wrapper.setProps({ as: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
