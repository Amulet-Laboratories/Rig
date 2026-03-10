import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Toggle from './Toggle.vue'

describe('Toggle', () => {
  it('renders with data-rig-toggle', () => {
    const wrapper = mount(Toggle)
    expect(wrapper.attributes('data-rig-toggle')).toBeDefined()
  })

  it('renders as a <button>', () => {
    const wrapper = mount(Toggle)
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('reflects off state when not pressed', () => {
    const wrapper = mount(Toggle, { props: { pressed: false } })
    expect(wrapper.attributes('data-state')).toBe('off')
    expect(wrapper.attributes('aria-pressed')).toBe('false')
  })

  it('reflects on state when pressed', () => {
    const wrapper = mount(Toggle, { props: { pressed: true } })
    expect(wrapper.attributes('data-state')).toBe('on')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('emits update:pressed with toggled value on click', async () => {
    const wrapper = mount(Toggle, { props: { pressed: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:pressed')?.[0]).toEqual([true])
  })

  it('emits false when currently pressed', async () => {
    const wrapper = mount(Toggle, { props: { pressed: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:pressed')?.[0]).toEqual([false])
  })

  it('handles disabled state', () => {
    const wrapper = mount(Toggle, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('renders slot content', () => {
    const wrapper = mount(Toggle, { slots: { default: 'Bold' } })
    expect(wrapper.text()).toBe('Bold')
  })
})
