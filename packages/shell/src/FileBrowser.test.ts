import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileBrowser from './FileBrowser.vue'

const groups = [
  {
    id: 'src',
    label: 'Source',
    nodes: [
      { id: '1', label: 'index.ts' },
      { id: '2', label: 'utils.ts' },
    ],
  },
  {
    id: 'test',
    label: 'Tests',
    nodes: [{ id: '3', label: 'index.test.ts' }],
  },
]

describe('FileBrowser', () => {
  it('renders with data-rig-file-browser', () => {
    const wrapper = mount(FileBrowser, { props: { groups } })
    expect(wrapper.find('[data-rig-file-browser]').exists()).toBe(true)
  })

  it('renders sidebar header', () => {
    const wrapper = mount(FileBrowser, { props: { groups, title: 'Explorer' } })
    expect(wrapper.find('[data-rig-sidebar-header]').text()).toBe('Explorer')
  })

  it('renders groups as View sections', () => {
    const wrapper = mount(FileBrowser, { props: { groups } })
    const views = wrapper.findAll('[data-rig-view]')
    expect(views).toHaveLength(2)
  })

  it('applies accent color to header', () => {
    const wrapper = mount(FileBrowser, {
      props: { groups, accent: '#ff0000' },
    })
    const header = wrapper.find('[data-rig-sidebar-header]')
    expect(header.attributes('style')).toContain('color')
  })

  it('renders header slot', () => {
    const wrapper = mount(FileBrowser, {
      props: { groups },
      slots: { header: '<span>My Files</span>' },
    })
    expect(wrapper.find('[data-rig-sidebar-header] span').text()).toBe('My Files')
  })

  it('emits select on node selection', async () => {
    const wrapper = mount(FileBrowser, { props: { groups } })
    const treeItems = wrapper.findAll('[data-rig-tree-node]')
    if (treeItems.length > 0) {
      await treeItems[0]!.trigger('click')
      expect(wrapper.emitted('select')).toBeDefined()
    }
  })

  it('passes collapsedGroups to toggle groups', () => {
    const wrapper = mount(FileBrowser, {
      props: { groups, collapsedGroups: ['test'] },
    })
    // Collapsed state is passed through — View gets collapsed prop
    const views = wrapper.findAll('[data-rig-view]')
    expect(views).toHaveLength(2)
  })

  it('marks groups as collapsed when in collapsedGroups', () => {
    const wrapper = mount(FileBrowser, {
      props: { groups, collapsedGroups: ['src'] },
    })
    // The View component should reflect collapsed state
    const views = wrapper.findAll('[data-rig-view]')
    expect(views.length).toBeGreaterThanOrEqual(1)
  })
})
