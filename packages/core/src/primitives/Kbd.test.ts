import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Kbd from './Kbd.vue'

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
})
