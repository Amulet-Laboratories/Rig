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
    const active = wrapper.findAll('[data-rig-activity-bar-item]')[1]!
    expect(active.attributes('data-state')).toBe('active')
  })

  it('emits select and update:activeId on click', async () => {
    const wrapper = mount(ActivityBar, { props: { items } })
    await wrapper.findAll('[data-rig-activity-bar-item]')[1]!.trigger('click')
    expect(wrapper.emitted('update:activeId')?.[0]).toEqual(['search'])
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(items[1])
  })

  it('supports roving tabindex', () => {
    const wrapper = mount(ActivityBar, { props: { items } })
    const buttons = wrapper.findAll('[data-rig-activity-bar-item]')
    expect(buttons[0]!.attributes('tabindex')).toBe('0')
    expect(buttons[1]!.attributes('tabindex')).toBe('-1')
    expect(buttons[2]!.attributes('tabindex')).toBe('-1')
  })

  it('moves focus on ArrowDown (vertical)', async () => {
    const wrapper = mount(ActivityBar, {
      props: { items, orientation: 'vertical' },
    })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    // Focus index should advance
    const buttons = wrapper.findAll('[data-rig-activity-bar-item]')
    expect(buttons[1]!.attributes('tabindex')).toBe('0')
  })

  it('can focus an activity bar item', () => {
    const wrapper = mount(ActivityBar, { props: { items }, attachTo: document.body })
    const item = wrapper.find('[data-rig-activity-bar-item]')
    ;(item.element as HTMLElement).focus()
    expect(document.activeElement).toBe(item.element)
    wrapper.unmount()
  })

  it('updates data-state when activeId prop changes', async () => {
    const wrapper = mount(ActivityBar, { props: { items, activeId: 'files' } })
    const itemEls = wrapper.findAll('[data-rig-activity-bar-item]')
    expect(itemEls[0]!.attributes('data-state')).toBe('active')
    expect(itemEls[1]!.attributes('data-state')).toBe('inactive')
    await wrapper.setProps({ activeId: 'search' })
    expect(itemEls[0]!.attributes('data-state')).toBe('inactive')
    expect(itemEls[1]!.attributes('data-state')).toBe('active')
  })

  it('navigates with ArrowRight/ArrowLeft in horizontal orientation', async () => {
    const wrapper = mount(ActivityBar, {
      props: { items, orientation: 'horizontal' },
    })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    const buttons = wrapper.findAll('[data-rig-activity-bar-item]')
    expect(buttons[1]!.attributes('tabindex')).toBe('0')
  })

  it('navigates to first and last item with Home/End', async () => {
    const wrapper = mount(ActivityBar, { props: { items } })
    await wrapper.trigger('keydown', { key: 'End' })
    let buttons = wrapper.findAll('[data-rig-activity-bar-item]')
    expect(buttons[2]!.attributes('tabindex')).toBe('0')
    await wrapper.trigger('keydown', { key: 'Home' })
    buttons = wrapper.findAll('[data-rig-activity-bar-item]')
    expect(buttons[0]!.attributes('tabindex')).toBe('0')
  })

  it('renders badge with notification aria-label', () => {
    const badgeItems: Action[] = [
      { id: 'files', label: 'Files', badge: '3' },
      { id: 'search', label: 'Search' },
    ]
    const wrapper = mount(ActivityBar, { props: { items: badgeItems } })
    const badge = wrapper.find('[data-rig-activity-bar-badge]')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('3')
    expect(badge.attributes('aria-label')).toBe('3 notifications')
  })
})
