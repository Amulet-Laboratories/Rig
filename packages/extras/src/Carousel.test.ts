import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Carousel from './Carousel.vue'

describe('Carousel', () => {
  const items = ['Slide A', 'Slide B', 'Slide C']

  it('renders with data-rig-carousel', () => {
    const wrapper = mount(Carousel, { props: { items } })
    expect(wrapper.find('[data-rig-carousel]').exists()).toBe(true)
  })

  it('has carousel region role', () => {
    const wrapper = mount(Carousel, { props: { items } })
    expect(wrapper.find('[data-rig-carousel]').attributes('role')).toBe('region')
    expect(wrapper.find('[data-rig-carousel]').attributes('aria-roledescription')).toBe('carousel')
  })

  it('renders all slides', () => {
    const wrapper = mount(Carousel, { props: { items } })
    expect(wrapper.findAll('[data-rig-carousel-slide]')).toHaveLength(3)
  })

  it('marks active slide', () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 1 } })
    const slides = wrapper.findAll('[data-rig-carousel-slide]')
    expect(slides[1]!.attributes('data-active')).toBeDefined()
    expect(slides[0]!.attributes('data-active')).toBeUndefined()
  })

  it('sets aria-hidden on inactive slides', () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 0 } })
    const slides = wrapper.findAll('[data-rig-carousel-slide]')
    expect(slides[0]!.attributes('aria-hidden')).toBe('false')
    expect(slides[1]!.attributes('aria-hidden')).toBe('true')
  })

  it('emits update:modelValue on next click', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 0 } })
    await wrapper.find('[data-rig-carousel-next]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('emits update:modelValue on prev click', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 1 } })
    await wrapper.find('[data-rig-carousel-prev]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('disables prev at first slide without loop', () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 0 } })
    expect(wrapper.find('[data-rig-carousel-prev]').attributes('disabled')).toBeDefined()
  })

  it('disables next at last slide without loop', () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 2 } })
    expect(wrapper.find('[data-rig-carousel-next]').attributes('disabled')).toBeDefined()
  })

  it('loops from last to first with loop prop', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 2, loop: true } })
    await wrapper.find('[data-rig-carousel-next]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('loops from first to last with loop prop', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 0, loop: true } })
    await wrapper.find('[data-rig-carousel-prev]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('navigates with indicator click', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 0 } })
    const indicators = wrapper.findAll('[data-rig-carousel-indicator]')
    await indicators[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('renders indicator for each slide', () => {
    const wrapper = mount(Carousel, { props: { items } })
    expect(wrapper.findAll('[data-rig-carousel-indicator]')).toHaveLength(3)
  })

  it('marks active indicator', () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 1 } })
    const indicators = wrapper.findAll('[data-rig-carousel-indicator]')
    expect(indicators[1]!.attributes('aria-selected')).toBe('true')
    expect(indicators[0]!.attributes('aria-selected')).toBe('false')
  })

  it('navigates with ArrowRight', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 0 } })
    await wrapper.find('[data-rig-carousel]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('navigates with ArrowLeft', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 1 } })
    await wrapper.find('[data-rig-carousel]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('navigates to first with Home', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 2 } })
    await wrapper.find('[data-rig-carousel]').trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('navigates to last with End', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 0 } })
    await wrapper.find('[data-rig-carousel]').trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('accepts custom aria-label', () => {
    const wrapper = mount(Carousel, { props: { items, ariaLabel: 'Gallery' } })
    expect(wrapper.find('[data-rig-carousel]').attributes('aria-label')).toBe('Gallery')
  })

  it('autoplays with interval', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Carousel, {
      props: { items, modelValue: 0, autoplay: true, interval: 1000 },
    })
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    vi.useRealTimers()
  })

  it('stops autoplay on mouseenter', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Carousel, {
      props: { items, modelValue: 0, autoplay: true, interval: 1000 },
    })
    await wrapper.find('[data-rig-carousel]').trigger('mouseenter')
    vi.advanceTimersByTime(2000)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    vi.useRealTimers()
  })

  it('does not emit when already at same index', async () => {
    const wrapper = mount(Carousel, { props: { items, modelValue: 0 } })
    const indicators = wrapper.findAll('[data-rig-carousel-indicator]')
    await indicators[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
