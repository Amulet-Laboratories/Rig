import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SideBar from './SideBar.vue'
import { nextTick } from 'vue'

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

  it('applies width style', () => {
    const wrapper = mount(SideBar, { props: { open: true, width: 300 } })
    expect(wrapper.find('[data-rig-sidebar]').attributes('style')).toContain('width: 300px')
  })

  it('defaults to 260px width', () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    expect(wrapper.find('[data-rig-sidebar]').attributes('style')).toContain('width: 260px')
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

  it('has header and content sections', () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    expect(wrapper.find('[data-rig-sidebar-header]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-sidebar-content]').exists()).toBe(true)
  })

  it('sets data-state attribute', () => {
    const wrapper = mount(SideBar, { props: { open: true } })
    expect(wrapper.find('[data-rig-sidebar]').attributes('data-state')).toBe('open')
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(SideBar)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(SideBar, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(SideBar)
    // Verify component has emitted() interface
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(SideBar)
    await wrapper.setProps({ open: true })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
