import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityBar from './ActivityBar.vue'
import type { Action } from '@core/types'

const items: Action[] = [
  { id: 'files', label: 'Files' },
  { id: 'search', label: 'Search' },
  { id: 'git', label: 'Git' },
]

describe('ActivityBar', () => {
  it('renders with data-rig-activity-bar and toolbar role', () => {
    const wrapper = mount(ActivityBar, { props: { items } })
    expect(wrapper.attributes('data-rig-activity-bar')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('toolbar')
  })

  it('renders all items', () => {
    const wrapper = mount(ActivityBar, { props: { items } })
    expect(wrapper.findAll('[data-rig-activity-bar-item]')).toHaveLength(3)
  })

  it('marks active item', () => {
    const wrapper = mount(ActivityBar, {
      props: { items, activeId: 'search' },
    })
    const active = wrapper.findAll('[data-rig-activity-bar-item]')[1]
    expect(active.attributes('data-state')).toBe('active')
  })

  it('emits select and update:activeId on click', async () => {
    const wrapper = mount(ActivityBar, { props: { items } })
    await wrapper.findAll('[data-rig-activity-bar-item]')[1].trigger('click')
    expect(wrapper.emitted('update:activeId')?.[0]).toEqual(['search'])
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(items[1])
  })

  it('supports roving tabindex', () => {
    const wrapper = mount(ActivityBar, { props: { items } })
    const buttons = wrapper.findAll('[data-rig-activity-bar-item]')
    expect(buttons[0].attributes('tabindex')).toBe('0')
    expect(buttons[1].attributes('tabindex')).toBe('-1')
    expect(buttons[2].attributes('tabindex')).toBe('-1')
  })

  it('moves focus on ArrowDown (vertical)', async () => {
    const wrapper = mount(ActivityBar, {
      props: { items, orientation: 'vertical' },
    })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    // Focus index should advance
    const buttons = wrapper.findAll('[data-rig-activity-bar-item]')
    expect(buttons[1].attributes('tabindex')).toBe('0')
  })
})
