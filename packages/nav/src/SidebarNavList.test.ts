import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarNavList from './SidebarNavList.vue'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: 'mdi:view-dashboard' },
  { id: 'budget', label: 'Budget', icon: 'mdi:calculator' },
  { id: 'reports', label: 'Reports', icon: 'mdi:chart-bar' },
]

describe('SidebarNavList', () => {
  it('renders with data-rig-sidebar-nav-list', () => {
    const wrapper = mount(SidebarNavList, { props: { items } })
    expect(wrapper.find('[data-rig-sidebar-nav-list]').exists()).toBe(true)
  })

  it('renders all items', () => {
    const wrapper = mount(SidebarNavList, { props: { items } })
    expect(wrapper.findAll('[data-rig-sidebar-nav-item]')).toHaveLength(3)
  })

  it('displays item labels', () => {
    const wrapper = mount(SidebarNavList, { props: { items } })
    const labels = wrapper.findAll('[data-rig-sidebar-nav-label]')
    expect(labels[0]!.text()).toBe('Dashboard')
    expect(labels[1]!.text()).toBe('Budget')
    expect(labels[2]!.text()).toBe('Reports')
  })

  it('marks active item', () => {
    const wrapper = mount(SidebarNavList, { props: { items, activeId: 'budget' } })
    const btns = wrapper.findAll('[data-rig-sidebar-nav-item]')
    expect(btns[0]!.attributes('data-state')).toBeUndefined()
    expect(btns[1]!.attributes('data-state')).toBe('active')
    expect(btns[2]!.attributes('data-state')).toBeUndefined()
  })

  it('sets aria-current on active item', () => {
    const wrapper = mount(SidebarNavList, { props: { items, activeId: 'dashboard' } })
    const btns = wrapper.findAll('[data-rig-sidebar-nav-item]')
    expect(btns[0]!.attributes('aria-current')).toBe('page')
    expect(btns[1]!.attributes('aria-current')).toBeUndefined()
  })

  it('emits select on click', async () => {
    const wrapper = mount(SidebarNavList, { props: { items } })
    await wrapper.findAll('[data-rig-sidebar-nav-item]')[1]!.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([items[1]])
  })

  it('has role navigation', () => {
    const wrapper = mount(SidebarNavList, { props: { items } })
    expect(wrapper.find('[data-rig-sidebar-nav-list]').attributes('role')).toBe('navigation')
  })

  it('renders icon slot', () => {
    const wrapper = mount(SidebarNavList, { props: { items } })
    expect(wrapper.findAll('[data-rig-sidebar-nav-icon]')).toHaveLength(3)
  })

  it('renders without icons', () => {
    const plain = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ]
    const wrapper = mount(SidebarNavList, { props: { items: plain } })
    expect(wrapper.findAll('[data-rig-sidebar-nav-icon]')).toHaveLength(0)
  })
})
