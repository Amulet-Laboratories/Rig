import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from './Checkbox.vue'

describe('Checkbox', () => {
  it('renders with data-rig-checkbox', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.attributes('data-rig-checkbox')).toBeDefined()
  })

  it('reflects checked state via data attribute', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: true } })
    expect(wrapper.attributes('data-state')).toBe('checked')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('handles disabled state', () => {
    const wrapper = mount(Checkbox, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('supports indeterminate state', () => {
    const wrapper = mount(Checkbox, { props: { indeterminate: true } })
    expect(wrapper.attributes('data-indeterminate')).toBeDefined()
  })
})
