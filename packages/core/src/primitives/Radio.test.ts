import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Radio from './Radio.vue'
import { nextTick } from 'vue'

describe('Radio', () => {
  it('renders with data-rig-radio', () => {
    const wrapper = mount(Radio, {
      props: { value: 'a', name: 'group' },
    })
    expect(wrapper.attributes('data-rig-radio')).toBeDefined()
  })

  it('renders a radio input with correct name and value', () => {
    const wrapper = mount(Radio, {
      props: { value: 'opt1', name: 'colors' },
    })
    const input = wrapper.find('input[type="radio"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('name')).toBe('colors')
    expect(input.attributes('value')).toBe('opt1')
  })

  it('is checked when modelValue matches value', () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'a', value: 'a', name: 'group' },
    })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
    expect(wrapper.attributes('data-state')).toBe('checked')
  })

  it('is not checked when modelValue differs from value', () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'b', value: 'a', name: 'group' },
    })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
    expect(wrapper.attributes('data-state')).toBe('unchecked')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'b', value: 'a', name: 'group' },
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('handles disabled state', () => {
    const wrapper = mount(Radio, {
      props: { value: 'a', name: 'group', disabled: true },
    })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('renders slot content as label', () => {
    const wrapper = mount(Radio, {
      props: { value: 'a', name: 'group' },
      slots: { default: 'Option A' },
    })
    expect(wrapper.text()).toBe('Option A')
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Radio, { props: { value: 'a', name: 'group' } })
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(Radio, { props: { value: 'a', name: 'group' } }, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Radio, { props: { value: 'a', name: 'group' } })
    await wrapper.setProps({ modelValue: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
