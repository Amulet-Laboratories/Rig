import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Resizer from './Resizer.vue'

describe('Resizer', () => {
  it('renders with data-rig-resizer and separator role', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('data-rig-resizer')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('separator')
  })

  it('sets orientation attributes', () => {
    const h = mount(Resizer, { props: { orientation: 'horizontal' } })
    expect(h.attributes('data-orientation')).toBe('horizontal')
    expect(h.attributes('aria-orientation')).toBe('horizontal')

    const v = mount(Resizer, { props: { orientation: 'vertical' } })
    expect(v.attributes('data-orientation')).toBe('vertical')
  })

  it('defaults to horizontal', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('is focusable', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('emits drag on ArrowRight key for horizontal orientation', async () => {
    const wrapper = mount(Resizer, { props: { orientation: 'horizontal' } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('dragstart')).toHaveLength(1)
    expect(wrapper.emitted('drag')?.[0]).toEqual([{ delta: 10, position: 0 }])
    expect(wrapper.emitted('dragend')).toHaveLength(1)
  })

  it('emits drag on ArrowLeft key for horizontal orientation', async () => {
    const wrapper = mount(Resizer, { props: { orientation: 'horizontal' } })
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('drag')?.[0]).toEqual([{ delta: -10, position: 0 }])
  })

  it('emits drag on ArrowDown key for vertical orientation', async () => {
    const wrapper = mount(Resizer, { props: { orientation: 'vertical' } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('drag')?.[0]).toEqual([{ delta: 10, position: 0 }])
  })

  it('ignores ArrowDown for horizontal orientation', async () => {
    const wrapper = mount(Resizer, { props: { orientation: 'horizontal' } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('drag')).toBeUndefined()
  })
})
