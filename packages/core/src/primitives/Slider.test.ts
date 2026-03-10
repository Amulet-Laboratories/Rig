import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Slider from './Slider.vue'

describe('Slider', () => {
  it('renders with data-rig-slider', () => {
    const wrapper = mount(Slider, { props: { modelValue: 0 } })
    expect(wrapper.attributes('data-rig-slider')).toBeDefined()
  })

  it('contains a range input', () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    const input = wrapper.find('input[type="range"]')
    expect(input.exists()).toBe(true)
  })

  it('passes min, max, step to the input', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 5, min: 0, max: 10, step: 0.5 },
    })
    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBe('10')
    expect(input.attributes('step')).toBe('0.5')
  })

  it('exposes --rig-slider-percent CSS variable', () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, min: 0, max: 100 } })
    expect(wrapper.attributes('style')).toContain('--rig-slider-percent: 50%')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 0 } })
    const input = wrapper.find('input')
    await input.setValue(42)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
  })

  it('sets data-orientation', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0, orientation: 'vertical' },
    })
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(Slider, { props: { modelValue: 0, disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
