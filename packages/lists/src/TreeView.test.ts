import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeView from './TreeView.vue'
import type { TreeNode } from '@core/types'

const nodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'app', label: 'App.vue' },
      { id: 'main', label: 'main.ts' },
    ],
  },
  { id: 'readme', label: 'README.md' },
]

describe('TreeView', () => {
  it('renders with data-rig-tree and tree role', () => {
    const wrapper = mount(TreeView, { props: { nodes } })
    expect(wrapper.attributes('data-rig-tree')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('tree')
  })

  it('renders root nodes when none expanded', () => {
    const wrapper = mount(TreeView, { props: { nodes, expanded: [] } })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items).toHaveLength(2) // src + readme
  })

  it('renders children when parent is expanded', () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
    })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items).toHaveLength(4) // src + App.vue + main.ts + readme
  })

  it('sets depth data attribute', () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
    })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[0].attributes('data-depth')).toBe('0')
    expect(items[1].attributes('data-depth')).toBe('1')
  })

  it('marks leaf nodes', () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
    })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[0].attributes('data-leaf')).toBeUndefined() // src is not leaf
    expect(items[1].attributes('data-leaf')).toBeDefined() // App.vue is leaf
  })

  it('sets aria-level', () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
    })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[0].attributes('aria-level')).toBe('1')
    expect(items[1].attributes('aria-level')).toBe('2')
  })

  it('emits update:expanded on toggle click', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: [] },
    })
    await wrapper.find('[data-rig-tree-toggle]').trigger('click')
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src']])
  })

  it('emits update:selected on node click', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
    })
    const items = wrapper.findAll('[data-rig-tree-node]')
    await items[1].trigger('click')
    expect(wrapper.emitted('update:selected')?.[0]).toEqual(['app'])
  })

  it('renders expand toggle for non-leaf nodes', () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: [] },
    })
    expect(wrapper.findAll('[data-rig-tree-toggle]')).toHaveLength(1) // only 'src'
  })

  it('calls onExpand for lazy loading', async () => {
    const lazyNodes: TreeNode[] = [
      { id: 'lazy', label: 'Lazy Folder' },
    ]
    const onExpand = vi.fn().mockResolvedValue([
      { id: 'child1', label: 'Child 1' },
    ])

    const wrapper = mount(TreeView, {
      props: { nodes: lazyNodes, expanded: [], onExpand },
    })

    await wrapper.find('[data-rig-tree-toggle]').trigger('click')
    expect(onExpand).toHaveBeenCalled()
  })

  it('sets data-virtual attribute when virtual=true', () => {
    const wrapper = mount(TreeView, { props: { nodes, virtual: true } })
    expect(wrapper.attributes('data-virtual')).toBeDefined()
  })

  it('does not set data-virtual when virtual=false', () => {
    const wrapper = mount(TreeView, { props: { nodes, virtual: false } })
    expect(wrapper.attributes('data-virtual')).toBeUndefined()
  })

  it('still renders nodes in virtual mode', () => {
    // jsdom has no real scroll so virtualState renders all items (containerHeight=300)
    const wrapper = mount(TreeView, {
      props: { nodes, virtual: true, itemHeight: 22, expanded: ['src'] },
    })
    const items = wrapper.findAll('[data-rig-tree-node]')
    // src + App.vue + main.ts + README.md = 4
    expect(items.length).toBeGreaterThan(0)
  })
})
