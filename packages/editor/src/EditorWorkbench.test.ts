import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorWorkbench from './EditorWorkbench.vue'
import type { TabItem } from '@core/types'

const tabs: TabItem[] = [
  { id: 'a', label: 'file-a.ts' },
  { id: 'b', label: 'file-b.ts', dirty: true },
  { id: 'c', label: 'file-c.ts', closable: false },
]

describe('EditorWorkbench', () => {
  it('renders with data-rig-editor-workbench', () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs } })
    expect(wrapper.attributes('data-rig-editor-workbench')).toBe('')
  })

  it('renders all tabs', () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs } })
    expect(wrapper.findAll('[data-rig-editor-tab]')).toHaveLength(3)
  })

  it('marks active tab', () => {
    const wrapper = mount(EditorWorkbench, {
      props: { tabs, activeId: 'b' },
    })
    const active = wrapper.findAll('[data-rig-editor-tab]')[1]!
    expect(active.attributes('data-state')).toBe('active')
    expect(active.attributes('aria-selected')).toBe('true')
  })

  it('emits update:activeId on tab click', async () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs } })
    await wrapper.findAll('[data-rig-editor-tab]')[1]!.trigger('click')
    expect(wrapper.emitted('update:activeId')?.[0]).toEqual(['b'])
  })

  it('emits close on close button click', async () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs, activeId: 'a' } })
    await wrapper.findAll('[data-rig-editor-tab-close]')[0]!.trigger('click')
    expect(wrapper.emitted('close')?.[0]).toEqual(['a'])
  })

  it('shows dirty indicator', () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs, activeId: 'b' } })
    const dirtyTab = wrapper.findAll('[data-rig-editor-tab]')[1]!
    expect(dirtyTab.attributes('data-dirty')).not.toBeUndefined()
  })

  it('shows empty slot when no tabs', () => {
    const wrapper = mount(EditorWorkbench, {
      props: { tabs: [] },
    })
    expect(wrapper.find('[data-rig-editor-workbench-empty]').exists()).toBe(true)
  })

  it('has tablist role on tab row', () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs } })
    expect(wrapper.find('[data-rig-editor-workbench-tabs]').attributes('role')).toBe('tablist')
  })

  it('inline tab buttons are draggable', () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs } })
    const tabEls = wrapper.findAll('[data-rig-editor-tab]')
    tabEls.forEach((tab) => {
      expect(tab.attributes('draggable')).toBe('true')
    })
  })

  it('emits reorder when tab is dropped onto another', async () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs } })
    const tabEls = wrapper.findAll('[data-rig-editor-tab]')
    await tabEls[0]!.trigger('dragstart')
    await tabEls[2]!.trigger('dragover')
    await tabEls[2]!.trigger('drop')
    expect(wrapper.emitted('reorder')?.[0]).toEqual([{ from: 0, to: 2 }])
  })

  it('sets data-drag-over on hovered tab', async () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs } })
    const tabEls = wrapper.findAll('[data-rig-editor-tab]')
    await tabEls[0]!.trigger('dragstart')
    await tabEls[1]!.trigger('dragover')
    expect(tabEls[1]!.attributes('data-drag-over')).not.toBeUndefined()
  })

  it('activates tab on Enter key', async () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs } })
    await wrapper.findAll('[data-rig-editor-tab]')[1]!.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:activeId')?.[0]).toEqual(['b'])
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(EditorWorkbench, {
      props: { tabs, activeId: 'a' },
      attachTo: document.body,
    })
    const activeTab = wrapper.findAll('[data-rig-editor-tab]')[0]!
    ;(activeTab.element as HTMLElement).focus()
    expect(document.activeElement).toBe(activeTab.element)
    wrapper.unmount()
  })

  it('reflects activeId prop change', async () => {
    const wrapper = mount(EditorWorkbench, { props: { tabs, activeId: 'a' } })
    expect(wrapper.findAll('[data-rig-editor-tab]')[0]!.attributes('data-state')).toBe('active')
    await wrapper.setProps({ activeId: 'b' })
    expect(wrapper.findAll('[data-rig-editor-tab]')[0]!.attributes('data-state')).toBe('inactive')
    expect(wrapper.findAll('[data-rig-editor-tab]')[1]!.attributes('data-state')).toBe('active')
  })
})
