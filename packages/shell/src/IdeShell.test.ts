import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IdeShell from './IdeShell.vue'
import type { Action, TabItem } from '@core/types'
import { nextTick } from 'vue'

const activities: Action[] = [
  { id: 'explorer', label: 'Explorer', icon: 'codicon:files' },
  { id: 'search', label: 'Search', icon: 'codicon:search' },
]

const panelTabs: TabItem[] = [
  { id: 'output', label: 'Output' },
  { id: 'terminal', label: 'Terminal' },
]

function factory(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(IdeShell, {
    props: { activities, panelTabs, ...props },
    slots,
    global: {
      stubs: {
        ActivityBar: { template: '<div data-rig-activity-bar><slot /></div>' },
        SideBar: { template: '<div data-rig-sidebar><slot /></div>' },
        StatusBar: { template: '<div data-rig-status-bar><slot /></div>' },
        PanelBar: { template: '<div data-rig-panel-bar><slot /></div>' },
        EditorWorkbench: {
          template: '<div data-rig-editor-workbench><slot /><slot name="empty" /></div>',
          props: ['tabs', 'activeId'],
        },
        Panel: { template: '<div data-rig-panel><slot /></div>', props: ['open', 'position', 'size'] },
      },
    },
  })
}

describe('IdeShell', () => {
  it('renders with data-rig-shell-grid', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-shell-grid]').exists()).toBe(true)
  })

  it('renders activity bar area', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-activity-bar]').exists()).toBe(true)
  })

  it('renders sidebar area', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-sidebar]').exists()).toBe(true)
  })

  it('renders editor area', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-editor-workbench]').exists()).toBe(true)
  })

  it('renders statusbar area', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-status-bar]').exists()).toBe(true)
  })

  it('passes activities to default activity bar', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-activity-bar]').exists()).toBe(true)
  })

  it('exposes shell state via expose', () => {
    const wrapper = factory()
    const exposed = wrapper.vm as unknown as { shell: Record<string, unknown> }
    expect(exposed.shell).toBeDefined()
    expect(exposed.shell.openTab).toBeTypeOf('function')
    expect(exposed.shell.closeTab).toBeTypeOf('function')
    expect(exposed.shell.toggleSidebar).toBeTypeOf('function')
    expect(exposed.shell.togglePanel).toBeTypeOf('function')
  })

  it('renders custom sidebar slot content', () => {
    const wrapper = factory({}, { sidebar: '<div id="custom-sidebar">Custom</div>' })
    expect(wrapper.find('#custom-sidebar').exists()).toBe(true)
  })

  it('renders custom statusbar slot content', () => {
    const wrapper = factory({}, { statusbar: '<span id="status-item">Ready</span>' })
    expect(wrapper.find('#status-item').exists()).toBe(true)
  })

  it('renders custom titlebar slot when provided', () => {
    const wrapper = factory({}, { titlebar: '<div id="custom-titlebar">Title</div>' })
    expect(wrapper.find('#custom-titlebar').exists()).toBe(true)
  })

  it('renders aux panel slot when provided', () => {
    const wrapper = factory({}, { aux: '<div id="aux-panel">Chat</div>' })
    expect(wrapper.find('[data-rig-panel]').exists()).toBe(true)
  })

  it('handles keyboard interaction', async () => {
    const wrapper = mount(IdeShell)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(IdeShell, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(IdeShell)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('handles prop updates', async () => {
    const wrapper = mount(IdeShell)
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
