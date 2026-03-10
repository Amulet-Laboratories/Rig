import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from './Select.vue'
import type { SelectOption } from '../types'

const options: SelectOption[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma', disabled: true },
]

describe('Select', () => {
  it('renders with data-rig-select', () => {
    const wrapper = mount(Select, { props: { options } })
    expect(wrapper.attributes('data-rig-select')).toBeDefined()
  })

  it('renders all options', () => {
    const wrapper = mount(Select, { props: { options } })
    const opts = wrapper.findAll('option')
    expect(opts).toHaveLength(3)
    expect(opts[0].text()).toBe('Alpha')
    expect(opts[1].text()).toBe('Beta')
    expect(opts[2].text()).toBe('Gamma')
  })

  it('renders placeholder when provided', () => {
    const wrapper = mount(Select, {
      props: { options, placeholder: 'Choose...' },
    })
    const placeholderOpt = wrapper.find('option[disabled]')
    expect(placeholderOpt.exists()).toBe(true)
    expect(placeholderOpt.text()).toBe('Choose...')
  })

  it('sets selected value from modelValue', () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: 'b' },
    })
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('b')
  })

  it('emits update:modelValue and change on selection', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: 'a' },
    })
    await wrapper.find('select').setValue('b')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
  })

  it('handles disabled state', () => {
    const wrapper = mount(Select, {
      props: { options, disabled: true },
    })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })

  it('disables individual options', () => {
    const wrapper = mount(Select, { props: { options } })
    const opts = wrapper.findAll('option')
    expect(opts[2].attributes('disabled')).toBeDefined()
  })

  it('sets id on select element', () => {
    const wrapper = mount(Select, {
      props: { options, id: 'my-select' },
    })
    expect(wrapper.find('select').attributes('id')).toBe('my-select')
  })

  it('renders leading and trailing slots', () => {
    const wrapper = mount(Select, {
      props: { options },
      slots: {
        leading: '<span data-leading />',
        trailing: '<span data-trailing />',
      },
    })
    expect(wrapper.find('[data-leading]').exists()).toBe(true)
    expect(wrapper.find('[data-trailing]').exists()).toBe(true)
  })
})
