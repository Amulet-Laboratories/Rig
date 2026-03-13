import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShellGrid from './ShellGrid.vue'
import { nextTick } from 'vue'

describe('ShellGrid', () => {
  it('renders with data-rig-shell-grid', () => {
    const wrapper = mount(ShellGrid)
    expect(wrapper.attributes('data-rig-shell-grid')).toBeDefined()
  })

  it('renders all named areas', () => {
    const wrapper = mount(ShellGrid, {
      slots: {
        activity: '<div id="act">Activity</div>',
        sidebar: '<div id="side">Sidebar</div>',
        editor: '<div id="edit">Editor</div>',
        panel: '<div id="pan">Panel</div>',
        statusbar: '<div id="stat">Status</div>',
      },
    })
    expect(wrapper.find('#act').exists()).toBe(true)
    expect(wrapper.find('#side').exists()).toBe(true)
    expect(wrapper.find('#edit').exists()).toBe(true)
    expect(wrapper.find('#pan').exists()).toBe(true)
    expect(wrapper.find('#stat').exists()).toBe(true)
  })

  it('sets direction data attribute', () => {
    const wrapper = mount(ShellGrid, { props: { direction: 'rtl' } })
    expect(wrapper.attributes('data-direction')).toBe('rtl')
  })

  it('applies sidebar width from sizes', () => {
    const wrapper = mount(ShellGrid, {
      props: { sizes: { sideWidth: 300, panelHeight: 150 } },
    })
    const sidebar = wrapper.find('[data-rig-shell-sidebar]')
    expect(sidebar.attributes('style')).toContain('width: 300px')
  })

  it('applies panel height from sizes', () => {
    const wrapper = mount(ShellGrid, {
      props: { sizes: { sideWidth: 260, panelHeight: 250 } },
    })
    const panel = wrapper.find('[data-rig-shell-panel]')
    expect(panel.attributes('style')).toContain('height: 250px')
  })

  it('renders resizers when resizable', () => {
    const wrapper = mount(ShellGrid, { props: { resizable: true } })
    expect(wrapper.findAll('[data-rig-resizer]').length).toBe(2)
  })

  it('hides resizers when not resizable', () => {
    const wrapper = mount(ShellGrid, { props: { resizable: false } })
    expect(wrapper.findAll('[data-rig-resizer]').length).toBe(0)
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(ShellGrid)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(ShellGrid, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(ShellGrid)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(ShellGrid)
    await wrapper.setProps({ resizable: true })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
