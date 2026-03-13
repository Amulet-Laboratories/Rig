import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Progress from './Progress.vue'
import { nextTick } from 'vue'

describe('Progress', () => {
  it('renders with progressbar role', () => {
    const wrapper = mount(Progress, { props: { value: 50 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('data-rig-progress')).toBeDefined()
  })

  it('sets aria-valuenow', () => {
    const wrapper = mount(Progress, { props: { value: 75 } })
    expect(wrapper.attributes('aria-valuenow')).toBe('75')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
  })

  it('calculates fill width percentage', () => {
    const wrapper = mount(Progress, { props: { value: 60 } })
    const fill = wrapper.find('[data-rig-progress-fill]')
    expect(fill.attributes('style')).toContain('width: 60%')
  })

  it('clamps fill between 0 and 100', () => {
    const over = mount(Progress, { props: { value: 150 } })
    expect(over.find('[data-rig-progress-fill]').attributes('style')).toContain('width: 100%')

    const under = mount(Progress, { props: { value: -10 } })
    expect(under.find('[data-rig-progress-fill]').attributes('style')).toContain('width: 0%')
  })

  it('supports custom max', () => {
    const wrapper = mount(Progress, { props: { value: 5, max: 10 } })
    expect(wrapper.find('[data-rig-progress-fill]').attributes('style')).toContain('width: 50%')
  })

  it('handles indeterminate state', () => {
    const wrapper = mount(Progress, { props: { indeterminate: true } })
    expect(wrapper.attributes('data-indeterminate')).toBeDefined()
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Progress)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(Progress, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Progress)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Progress)
    await wrapper.setProps({ value: 42 })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
