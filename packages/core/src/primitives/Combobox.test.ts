import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Combobox from './Combobox.vue'

const options = [
  { id: '1', label: 'Apple', description: 'A fruit' },
  { id: '2', label: 'Banana' },
  { id: '3', label: 'Cherry', description: 'Stone fruit' },
]

describe('Combobox', () => {
  it('renders with data-rig-combobox', () => {
    const wrapper = mount(Combobox, { props: { options } })
    expect(wrapper.attributes('data-rig-combobox')).toBeDefined()
  })

  it('shows all options when focused with empty query', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    await wrapper.find('input').trigger('focus')
    const items = wrapper.findAll('[data-rig-combobox-option]')
    expect(items).toHaveLength(3)
  })

  it('filters options by query', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('an')
    const items = wrapper.findAll('[data-rig-combobox-option]')
    expect(items).toHaveLength(1)
    expect(items[0]!.text()).toContain('Banana')
  })

  it('filters by description', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('stone')
    const items = wrapper.findAll('[data-rig-combobox-option]')
    expect(items).toHaveLength(1)
    expect(items[0]!.text()).toContain('Cherry')
  })

  it('selects option on mousedown', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    await wrapper.find('input').trigger('focus')
    const items = wrapper.findAll('[data-rig-combobox-option]')
    await items[1]!.trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2'])
    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]])
  })

  it('displays selected option label in input', async () => {
    const wrapper = mount(Combobox, { props: { options, modelValue: '2' } })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Banana')
  })

  it('shows clear button when clearable and value selected', () => {
    const wrapper = mount(Combobox, {
      props: { options, modelValue: '1', clearable: true },
    })
    expect(wrapper.find('[data-rig-combobox-clear]').exists()).toBe(true)
  })

  it('clears on clear button click', async () => {
    const wrapper = mount(Combobox, {
      props: { options, modelValue: '1', clearable: true },
    })
    await wrapper.find('[data-rig-combobox-clear]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('navigates with arrow keys', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    const highlighted = wrapper.findAll('[data-highlighted]')
    expect(highlighted).toHaveLength(1)
  })

  it('selects on Enter when highlighted', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
  })

  it('sets disabled state', () => {
    const wrapper = mount(Combobox, { props: { options, disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
  })

  it('shows empty state when no matches', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('zzzzz')
    expect(wrapper.find('[data-rig-combobox-empty]').exists()).toBe(true)
  })

  it('closes on Escape', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.find('[data-rig-combobox-list]').exists()).toBe(true)
    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[data-rig-combobox-list]').exists()).toBe(false)
  })

  it('has role combobox on input', () => {
    const wrapper = mount(Combobox, { props: { options } })
    expect(wrapper.find('input').attributes('role')).toBe('combobox')
  })

  it('sets aria-expanded on input', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    expect(wrapper.find('input').attributes('aria-expanded')).toBe('false')
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('input').attributes('aria-expanded')).toBe('true')
  })

  it('has aria-haspopup listbox on input', () => {
    const wrapper = mount(Combobox, { props: { options } })
    expect(wrapper.find('input').attributes('aria-haspopup')).toBe('listbox')
  })

  it('emits select event with option object', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: '1', label: 'Apple' })
  })

  it('forwards id prop to input', () => {
    const wrapper = mount(Combobox, { props: { options, id: 'my-combo' } })
    expect(wrapper.find('input').attributes('id')).toBe('my-combo')
  })

  it('navigates up with ArrowUp', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowUp' })
    const highlighted = wrapper.findAll('[data-highlighted]')
    expect(highlighted).toHaveLength(1)
  })

  it('sets data-state open/closed', async () => {
    const wrapper = mount(Combobox, { props: { options } })
    expect(wrapper.attributes('data-state')).toBe('closed')
    await wrapper.find('input').trigger('focus')
    expect(wrapper.attributes('data-state')).toBe('open')
  })
})
