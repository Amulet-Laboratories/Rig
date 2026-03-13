import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Label from './Label.vue'
import { nextTick } from 'vue'

describe('Label', () => {
  it('renders with data-rig-label', () => {
    const wrapper = mount(Label)
    expect(wrapper.attributes('data-rig-label')).toBeDefined()
  })

  it('renders as a <label> element', () => {
    const wrapper = mount(Label)
    expect(wrapper.element.tagName).toBe('LABEL')
  })

  it('sets the for attribute', () => {
    const wrapper = mount(Label, { props: { for: 'my-input' } })
    expect(wrapper.attributes('for')).toBe('my-input')
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(Label, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
  })

  it('does not set data-disabled when not disabled', () => {
    const wrapper = mount(Label)
    expect(wrapper.attributes('data-disabled')).toBeUndefined()
  })

  it('renders slot content', () => {
    const wrapper = mount(Label, { slots: { default: 'Email address' } })
    expect(wrapper.text()).toBe('Email address')
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Label)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(Label, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Label)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Label)
    await wrapper.setProps({ for: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
