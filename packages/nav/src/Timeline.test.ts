import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Timeline from './Timeline.vue'

describe('Timeline', () => {
  const items = [
    { label: 'Step 1', description: 'First step', status: 'completed' as const },
    { label: 'Step 2', status: 'active' as const },
    { label: 'Step 3', status: 'pending' as const },
  ]

  it('renders with data-rig-timeline', () => {
    const wrapper = mount(Timeline, { props: { items } })
    expect(wrapper.attributes('data-rig-timeline')).toBe('')
  })

  it('renders all items', () => {
    const wrapper = mount(Timeline, { props: { items } })
    expect(wrapper.findAll('[data-rig-timeline-item]')).toHaveLength(3)
  })

  it('sets status attribute on items', () => {
    const wrapper = mount(Timeline, { props: { items } })
    const timelineItems = wrapper.findAll('[data-rig-timeline-item]')
    expect(timelineItems[0]!.attributes('data-status')).toBe('completed')
    expect(timelineItems[1]!.attributes('data-status')).toBe('active')
  })

  it('has list role', () => {
    const wrapper = mount(Timeline, { props: { items } })
    expect(wrapper.attributes('role')).toBe('list')
  })

  it('emits select on item click', async () => {
    const wrapper = mount(Timeline, { props: { items } })
    await wrapper.findAll('[data-rig-timeline-item]')[1]!.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([items[1], 1])
  })

  it('supports both orientations', () => {
    const h = mount(Timeline, { props: { items, orientation: 'horizontal' } })
    expect(h.attributes('data-orientation')).toBe('horizontal')
    const v = mount(Timeline, { props: { items, orientation: 'vertical' } })
    expect(v.attributes('data-orientation')).toBe('vertical')
  })

  it('emits select on Enter keypress on an item', async () => {
    const wrapper = mount(Timeline, { props: { items } })
    const timelineItems = wrapper.findAll('[data-rig-timeline-item]')
    await timelineItems[1]!.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]).toEqual([items[1], 1])
  })

  it('can focus a timeline item', () => {
    const wrapper = mount(Timeline, { props: { items }, attachTo: document.body })
    const item = wrapper.find('[data-rig-timeline-item]')
    ;(item.element as HTMLElement).focus()
    expect(document.activeElement).toBe(item.element)
    wrapper.unmount()
  })

  it('updates rendered items when items prop changes', async () => {
    const wrapper = mount(Timeline, { props: { items } })
    expect(wrapper.findAll('[data-rig-timeline-item]')).toHaveLength(3)
    await wrapper.setProps({ items: [{ label: 'Only one' }] })
    expect(wrapper.findAll('[data-rig-timeline-item]')).toHaveLength(1)
    expect(wrapper.find('[data-rig-timeline-label]').text()).toBe('Only one')
  })
})
