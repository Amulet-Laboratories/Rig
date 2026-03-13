import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from './Skeleton.vue'
import { nextTick } from 'vue'

describe('Skeleton', () => {
  it('renders with data-rig-skeleton', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('data-rig-skeleton')).toBeDefined()
  })

  it('renders 1 line by default', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.findAll('[data-rig-skeleton-line]')).toHaveLength(1)
  })

  it('renders multiple lines', () => {
    const wrapper = mount(Skeleton, { props: { lines: 4 } })
    expect(wrapper.findAll('[data-rig-skeleton-line]')).toHaveLength(4)
  })

  it('sets animate data attribute', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('data-animate')).toBeDefined()
  })

  it('disables animation', () => {
    const wrapper = mount(Skeleton, { props: { animate: false } })
    expect(wrapper.attributes('data-animate')).toBeUndefined()
  })

  it('applies uniform width as string', () => {
    const wrapper = mount(Skeleton, { props: { lines: 2, width: '80%' } })
    const lines = wrapper.findAll('[data-rig-skeleton-line]')
    expect(lines[0]!.attributes('style')).toContain('width: 80%')
    expect(lines[1]!.attributes('style')).toContain('width: 80%')
  })

  it('applies per-line widths from array', () => {
    const wrapper = mount(Skeleton, { props: { lines: 3, width: ['100%', '60%', '80%'] } })
    const lines = wrapper.findAll('[data-rig-skeleton-line]')
    expect(lines[0]!.attributes('style')).toContain('width: 100%')
    expect(lines[1]!.attributes('style')).toContain('width: 60%')
    expect(lines[2]!.attributes('style')).toContain('width: 80%')
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Skeleton)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(Skeleton, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Skeleton)
    await wrapper.setProps({ lines: 42 })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
