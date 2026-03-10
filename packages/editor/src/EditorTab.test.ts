import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorTab from './EditorTab.vue'
import type { TabItem } from '@core/types'

describe('EditorTab', () => {
  const tab: TabItem = { id: 'test', label: 'test.ts' }

  it('renders with data-rig-editor-tab and tab role', () => {
    const wrapper = mount(EditorTab, { props: { tab } })
    expect(wrapper.attributes('data-rig-editor-tab')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('tab')
  })

  it('displays tab label', () => {
    const wrapper = mount(EditorTab, { props: { tab } })
    expect(wrapper.text()).toContain('test.ts')
  })

  it('reflects active state', () => {
    const wrapper = mount(EditorTab, { props: { tab, active: true } })
    expect(wrapper.attributes('data-state')).toBe('active')
    expect(wrapper.attributes('aria-selected')).toBe('true')
  })

  it('reflects dirty state', () => {
    const wrapper = mount(EditorTab, {
      props: { tab: { ...tab, dirty: true } },
    })
    expect(wrapper.attributes('data-dirty')).toBeDefined()
    expect(wrapper.find('[data-rig-editor-tab-dirty]').exists()).toBe(true)
  })

  it('emits activate on click', async () => {
    const wrapper = mount(EditorTab, { props: { tab } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('activate')).toHaveLength(1)
  })

  it('emits close on close button click', async () => {
    const wrapper = mount(EditorTab, { props: { tab } })
    await wrapper.find('[data-rig-editor-tab-close]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('hides close button when closable is false', () => {
    const wrapper = mount(EditorTab, {
      props: { tab: { ...tab, closable: false } },
    })
    expect(wrapper.find('[data-rig-editor-tab-close]').exists()).toBe(false)
  })

  it('is draggable by default', () => {
    const wrapper = mount(EditorTab, { props: { tab } })
    expect(wrapper.attributes('draggable')).toBe('true')
  })

  it('is not draggable when draggable=false', () => {
    const wrapper = mount(EditorTab, { props: { tab, draggable: false } })
    expect(wrapper.attributes('draggable')).toBe('false')
  })

  it('emits dragstart on drag start', async () => {
    const wrapper = mount(EditorTab, { props: { tab } })
    await wrapper.trigger('dragstart')
    expect(wrapper.emitted('dragstart')).toHaveLength(1)
  })

  it('emits dragend on drag end', async () => {
    const wrapper = mount(EditorTab, { props: { tab } })
    await wrapper.trigger('dragend')
    expect(wrapper.emitted('dragend')).toHaveLength(1)
  })
})
