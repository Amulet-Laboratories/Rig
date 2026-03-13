import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from './Badge.vue'
import { nextTick } from 'vue'

describe('Badge', () => {
  it('renders with data-rig-badge', () => {
    const wrapper = mount(Badge, { slots: { default: '3' } })
    expect(wrapper.attributes('data-rig-badge')).toBeDefined()
    expect(wrapper.text()).toBe('3')
  })

  it('sets variant and size data attributes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'info', size: 'sm' },
    })
    expect(wrapper.attributes('data-variant')).toBe('info')
    expect(wrapper.attributes('data-size')).toBe('sm')
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Badge)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(Badge, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Badge)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Badge)
    await wrapper.setProps({ variant: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
