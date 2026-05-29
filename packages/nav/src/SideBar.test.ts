import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SideBar from './SideBar.vue'

describe('SideBar', () => {
  it('renders with data-rig-sidebar when open', () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    expect(wrapper.find('[data-rig-sidebar]').exists()).toBe(true)
  })

  it('does not render when closed', () => {
    const wrapper = mount(SideBar, { props: { open: false } })
    expect(wrapper.find('[data-rig-sidebar]').exists()).toBe(false)
  })

  it('defaults to open', () => {
    const wrapper = mount(SideBar)
    expect(wrapper.find('[data-rig-sidebar]').exists()).toBe(true)
  })

  it('does not apply inline width style', () => {
    const wrapper = mount(SideBar, { props: { open: true, width: 300 } })
    expect(wrapper.find('[data-rig-sidebar]').attributes('style')).toBeUndefined()
  })

  it('fills its container without inline width', () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    expect(wrapper.find('[data-rig-sidebar]').attributes('style')).toBeUndefined()
  })

  it('renders header slot', () => {
    const wrapper = mount(SideBar, {
      props: { open: true },
      slots: { header: '<h2 data-test-header>Explorer</h2>' },
    })
    expect(wrapper.find('[data-test-header]').exists()).toBe(true)
    expect(wrapper.find('[data-test-header]').text()).toBe('Explorer')
  })

  it('renders default slot content', () => {
    const wrapper = mount(SideBar, {
      props: { open: true },
      slots: { default: '<div data-test-content>Files</div>' },
    })
    expect(wrapper.find('[data-test-content]').exists()).toBe(true)
  })

  it('has content section and header only with slot', () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    expect(wrapper.find('[data-rig-sidebar-header]').exists()).toBe(false)
    expect(wrapper.find('[data-rig-sidebar-content]').exists()).toBe(true)

    const withHeader = mount(SideBar, {
      props: { open: true },
      slots: { header: '<span>Title</span>' },
    })
    expect(withHeader.find('[data-rig-sidebar-header]').exists()).toBe(true)
  })

  it('sets data-state attribute', () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    expect(wrapper.find('[data-rig-sidebar]').attributes('data-state')).toBe('open')
  })

  it('emits update:open with false on Escape keydown', async () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    await wrapper.find('[data-rig-sidebar]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('can focus the sidebar container', () => {
    const wrapper = mount(SideBar, { props: { open: true }, attachTo: document.body })
    const sidebar = wrapper.find('[data-rig-sidebar]')
    ;(sidebar.element as HTMLElement).focus()
    expect(document.activeElement).toBe(sidebar.element)
    wrapper.unmount()
  })

  it('does not emit update:open on non-Escape keydown', async () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    await wrapper.find('[data-rig-sidebar]').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('hides sidebar when open prop changes to false', async () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    expect(wrapper.find('[data-rig-sidebar]').exists()).toBe(true)
    await wrapper.setProps({ open: false })
    expect(wrapper.find('[data-rig-sidebar]').exists()).toBe(false)
  })
})
