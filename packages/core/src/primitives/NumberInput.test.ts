import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberInput from './NumberInput.vue'

describe('NumberInput', () => {
  it('renders with data-rig-number-input', () => {
    const wrapper = mount(NumberInput)
    expect(wrapper.find('[data-rig-number-input]').exists()).toBe(true)
  })

  it('renders spinbutton role on input', () => {
    const wrapper = mount(NumberInput)
    expect(wrapper.find('input').attributes('role')).toBe('spinbutton')
  })

  it('displays the model value', () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5 } })
    expect(wrapper.find('input').element.value).toBe('5')
  })

  it('emits update:modelValue on increment click', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5, step: 1 } })
    await wrapper.find('[data-rig-number-input-increment]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('emits update:modelValue on decrement click', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5, step: 1 } })
    await wrapper.find('[data-rig-number-input-decrement]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('respects step prop', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 10, step: 5 } })
    await wrapper.find('[data-rig-number-input-increment]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([15])
  })

  it('clamps direct input to max', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5, max: 10 } })
    const input = wrapper.find('input')
    Object.defineProperty(input.element, 'value', { value: '99', writable: true })
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('clamps direct input to min', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5, min: 0 } })
    const input = wrapper.find('input')
    Object.defineProperty(input.element, 'value', { value: '-5', writable: true })
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('disables increment at max', () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 10, max: 10 } })
    expect(wrapper.find('[data-rig-number-input-increment]').attributes('disabled')).toBeDefined()
  })

  it('disables decrement at min', () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 0, min: 0 } })
    expect(wrapper.find('[data-rig-number-input-decrement]').attributes('disabled')).toBeDefined()
  })

  it('does not increment when disabled', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5, disabled: true } })
    await wrapper.find('[data-rig-number-input-increment]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(NumberInput, { props: { disabled: true } })
    expect(wrapper.find('[data-rig-number-input]').attributes('data-disabled')).toBeDefined()
  })

  it('increments on ArrowUp', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5 } })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('decrements on ArrowDown', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5 } })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('goes to min on Home', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5, min: 0 } })
    await wrapper.find('input').trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('goes to max on End', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5, max: 100 } })
    await wrapper.find('input').trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([100])
  })

  it('does not emit Home when min is -Infinity', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5 } })
    await wrapper.find('input').trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not emit End when max is Infinity', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5 } })
    await wrapper.find('input').trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('sets aria-valuenow', () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 7 } })
    expect(wrapper.find('input').attributes('aria-valuenow')).toBe('7')
  })

  it('sets aria-valuemin when min is finite', () => {
    const wrapper = mount(NumberInput, { props: { min: 0 } })
    expect(wrapper.find('input').attributes('aria-valuemin')).toBe('0')
  })

  it('omits aria-valuemin when min is -Infinity', () => {
    const wrapper = mount(NumberInput)
    expect(wrapper.find('input').attributes('aria-valuemin')).toBeUndefined()
  })

  it('sets aria-valuemax when max is finite', () => {
    const wrapper = mount(NumberInput, { props: { max: 100 } })
    expect(wrapper.find('input').attributes('aria-valuemax')).toBe('100')
  })

  it('sets aria-label', () => {
    const wrapper = mount(NumberInput, { props: { ariaLabel: 'Quantity' } })
    expect(wrapper.find('input').attributes('aria-label')).toBe('Quantity')
  })

  it('parses input value', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 0, min: 0, max: 100 } })
    const input = wrapper.find('input')
    Object.defineProperty(input.element, 'value', { value: '42', writable: true })
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
  })

  it('ignores NaN input', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5 } })
    const input = wrapper.find('input')
    Object.defineProperty(input.element, 'value', { value: 'abc', writable: true })
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
