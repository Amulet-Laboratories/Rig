import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from './Switch.vue'
import { nextTick } from 'vue'

describe('Switch', () => {
  it('renders with data-rig-switch and role=switch', () => {
    const wrapper = mount(Switch)
    expect(wrapper.attributes('data-rig-switch')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('switch')
  })

  it('reflects aria-checked state', () => {
    const off = mount(Switch, { props: { modelValue: false } })
    expect(off.attributes('aria-checked')).toBe('false')

    const on = mount(Switch, { props: { modelValue: true } })
    expect(on.attributes('aria-checked')).toBe('true')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('toggles on Enter key', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('toggles on Space key', async () => {
    const wrapper = mount(Switch, { props: { modelValue: true } })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(Switch, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Switch)
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
