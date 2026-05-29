import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Rating from './Rating.vue'

describe('Rating', () => {
  it('renders with data-rig-rating', () => {
    const wrapper = mount(Rating)
    expect(wrapper.attributes('data-rig-rating')).not.toBeUndefined()
  })

  it('renders correct number of stars', () => {
    const wrapper = mount(Rating, { props: { max: 5 } })
    const stars = wrapper.findAll('[data-rig-rating-star]')
    expect(stars).toHaveLength(5)
  })

  it('renders custom number of stars', () => {
    const wrapper = mount(Rating, { props: { max: 10 } })
    const stars = wrapper.findAll('[data-rig-rating-star]')
    expect(stars).toHaveLength(10)
  })

  it('marks filled stars based on modelValue', () => {
    const wrapper = mount(Rating, { props: { modelValue: 3, max: 5 } })
    const stars = wrapper.findAll('[data-rig-rating-star]')
    expect(stars[0]!.attributes('data-filled')).not.toBeUndefined()
    expect(stars[1]!.attributes('data-filled')).not.toBeUndefined()
    expect(stars[2]!.attributes('data-filled')).not.toBeUndefined()
    expect(stars[3]!.attributes('data-filled')).toBeUndefined()
    expect(stars[4]!.attributes('data-filled')).toBeUndefined()
  })

  it('emits update:modelValue on star click', async () => {
    const wrapper = mount(Rating, { props: { modelValue: 0, max: 5 } })
    const stars = wrapper.findAll('[data-rig-rating-star]')
    await stars[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('emits update:modelValue on ArrowRight', async () => {
    const wrapper = mount(Rating, {
      props: { modelValue: 2, max: 5 },
      attachTo: document.body,
    })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    wrapper.unmount()
  })

  it('emits update:modelValue on ArrowLeft', async () => {
    const wrapper = mount(Rating, {
      props: { modelValue: 3, max: 5 },
      attachTo: document.body,
    })
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    wrapper.unmount()
  })

  it('clamps ArrowRight at max', async () => {
    const wrapper = mount(Rating, {
      props: { modelValue: 5, max: 5 },
      attachTo: document.body,
    })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
    wrapper.unmount()
  })

  it('clamps ArrowLeft at 0', async () => {
    const wrapper = mount(Rating, {
      props: { modelValue: 0, max: 5 },
      attachTo: document.body,
    })
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
    wrapper.unmount()
  })

  it('has role="slider"', () => {
    const wrapper = mount(Rating)
    expect(wrapper.attributes('role')).toBe('slider')
  })

  it('sets aria-valuenow to modelValue', () => {
    const wrapper = mount(Rating, { props: { modelValue: 3, max: 5 } })
    expect(wrapper.attributes('aria-valuenow')).toBe('3')
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    const wrapper = mount(Rating, { props: { max: 5 } })
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('5')
  })

  it('sets aria-label', () => {
    const wrapper = mount(Rating, { props: { ariaLabel: 'Product rating' } })
    expect(wrapper.attributes('aria-label')).toBe('Product rating')
  })

  it('handles disabled state', () => {
    const wrapper = mount(Rating, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).not.toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('does not emit on click when disabled', async () => {
    const wrapper = mount(Rating, { props: { modelValue: 0, max: 5, disabled: true } })
    const stars = wrapper.findAll('[data-rig-rating-star]')
    await stars[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not emit on keydown when disabled', async () => {
    const wrapper = mount(Rating, {
      props: { modelValue: 2, max: 5, disabled: true },
      attachTo: document.body,
    })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('handles readonly state', () => {
    const wrapper = mount(Rating, { props: { readonly: true } })
    expect(wrapper.attributes('data-readonly')).not.toBeUndefined()
  })

  it('does not emit on click when readonly', async () => {
    const wrapper = mount(Rating, { props: { modelValue: 3, max: 5, readonly: true } })
    const stars = wrapper.findAll('[data-rig-rating-star]')
    await stars[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not emit on keydown when readonly', async () => {
    const wrapper = mount(Rating, {
      props: { modelValue: 2, max: 5, readonly: true },
      attachTo: document.body,
    })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('is focusable when not disabled', () => {
    const wrapper = mount(Rating)
    expect(wrapper.attributes('tabindex')).toBe('0')
  })
})
