import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input', () => {
  it('renders with data-rig-input', () => {
    const wrapper = mount(Input)
    expect(wrapper.attributes('data-rig-input')).toBeDefined()
  })

  it('binds modelValue to input', () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } })
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('emits enter on Enter key', async () => {
    const wrapper = mount(Input)
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('enter')).toHaveLength(1)
  })

  it('shows clear button when clearable and has value', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'text', clearable: true },
    })
    expect(wrapper.find('[data-rig-input-clear]').exists()).toBe(true)
  })

  it('hides clear button when value is empty', () => {
    const wrapper = mount(Input, {
      props: { modelValue: '', clearable: true },
    })
    expect(wrapper.find('[data-rig-input-clear]').exists()).toBe(false)
  })

  it('emits clear and empty value on clear click', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'text', clearable: true },
    })
    await wrapper.find('[data-rig-input-clear]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('handles disabled state', () => {
    const wrapper = mount(Input, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
