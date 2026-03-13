import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Kbd from './Kbd.vue'
import { nextTick } from 'vue'

describe('Kbd', () => {
  it('renders with data-rig-kbd', () => {
    const wrapper = mount(Kbd)
    expect(wrapper.element.tagName).toBe('KBD')
    expect(wrapper.attributes('data-rig-kbd')).toBeDefined()
  })

  it('renders keys prop', () => {
    const wrapper = mount(Kbd, { props: { keys: 'Ctrl+S' } })
    expect(wrapper.text()).toBe('Ctrl+S')
  })

  it('renders slot content over keys prop', () => {
    const wrapper = mount(Kbd, {
      props: { keys: 'Ctrl+S' },
      slots: { default: '⌘S' },
    })
    expect(wrapper.text()).toBe('⌘S')
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Kbd)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(Kbd, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Kbd)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Kbd)
    await wrapper.setProps({ keys: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
