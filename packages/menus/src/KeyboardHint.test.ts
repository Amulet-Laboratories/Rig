import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KeyboardHint from './KeyboardHint.vue'

function factory(shortcut: string) {
  return mount(KeyboardHint, {
    props: { shortcut },
  })
}

describe('KeyboardHint', () => {
  it('renders root kbd element', () => {
    const wrapper = factory('Ctrl+S')
    expect(wrapper.find('[data-rig-keyboard-hint]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-keyboard-hint]').element.tagName).toBe('KBD')
  })

  it('splits shortcut into individual kbd elements', () => {
    const wrapper = factory('Ctrl+Shift+P')
    const keys = wrapper.findAll('[data-rig-keyboard-hint-key]')
    expect(keys.length).toBe(3)
    expect(keys[0]!.text()).toBe('Ctrl')
    expect(keys[1]!.text()).toBe('Shift')
    expect(keys[2]!.text()).toBe('P')
  })

  it('renders single key shortcuts', () => {
    const wrapper = factory('Escape')
    const keys = wrapper.findAll('[data-rig-keyboard-hint-key]')
    expect(keys.length).toBe(1)
    expect(keys[0]!.text()).toBe('Escape')
  })

  it('renders all kbd sub-elements as KBD tags', () => {
    const wrapper = factory('Alt+F4')
    const keys = wrapper.findAll('[data-rig-keyboard-hint-key]')
    keys.forEach((key) => {
      expect(key.element.tagName).toBe('KBD')
    })
  })

  it('handles multi-part shortcuts', () => {
    const wrapper = factory('Ctrl+Alt+Delete')
    const keys = wrapper.findAll('[data-rig-keyboard-hint-key]')
    expect(keys.length).toBe(3)
    expect(keys[0]!.text()).toBe('Ctrl')
    expect(keys[1]!.text()).toBe('Alt')
    expect(keys[2]!.text()).toBe('Delete')
  })
})
