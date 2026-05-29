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
    expect(wrapper.attributes('data-rig-tree')).toBe('')
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
    expect(items[0]!.attributes('data-depth')).toBe('0')
    expect(items[1]!.attributes('data-depth')).toBe('1')
  })

  it('marks leaf nodes', () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
    })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[0]!.attributes('data-leaf')).toBeUndefined() // src is not leaf
    expect(items[1]!.attributes('data-leaf')).not.toBeUndefined() // App.vue is leaf
  })

  it('sets aria-level', () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
    })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[0]!.attributes('aria-level')).toBe('1')
    expect(items[1]!.attributes('aria-level')).toBe('2')
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
    await items[1]!.trigger('click')
    expect(wrapper.emitted('update:selected')?.[0]).toEqual(['app'])
  })

  it('renders expand toggle for non-leaf nodes', () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: [] },
    })
    expect(wrapper.findAll('[data-rig-tree-toggle]')).toHaveLength(1) // only 'src'
  })

  it('calls onExpand for lazy loading', async () => {
    const lazyNodes: TreeNode[] = [{ id: 'lazy', label: 'Lazy Folder' }]
    const onExpand = vi.fn().mockResolvedValue([{ id: 'child1', label: 'Child 1' }])

    const wrapper = mount(TreeView, {
      props: { nodes: lazyNodes, expanded: [], onExpand },
    })

    await wrapper.find('[data-rig-tree-toggle]').trigger('click')
    expect(onExpand).toHaveBeenCalled()
  })

  it('sets data-virtual attribute when virtual=true', () => {
    const wrapper = mount(TreeView, { props: { nodes, virtual: true } })
    expect(wrapper.attributes('data-virtual')).not.toBeUndefined()
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

  // ── Keyboard Navigation ──

  it('moves focus down with ArrowDown', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')
    const items = wrapper.findAll('[data-rig-tree-node]')
    // First item should have tabindex 0
    expect(items[0]!.attributes('tabindex')).toBe('0')

    await tree.trigger('keydown', { key: 'ArrowDown' })
    // After ArrowDown, focusedIndex moves to 1
    const updatedItems = wrapper.findAll('[data-rig-tree-node]')
    expect(updatedItems[1]!.attributes('tabindex')).toBe('0')
    expect(updatedItems[0]!.attributes('tabindex')).toBe('-1')
    wrapper.unmount()
  })

  it('moves focus up with ArrowUp', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // Move down first, then up
    await tree.trigger('keydown', { key: 'ArrowDown' })
    await tree.trigger('keydown', { key: 'ArrowUp' })

    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[0]!.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('expands a collapsed node with ArrowRight', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: [] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // First node is 'src' which is collapsible
    await tree.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src']])
    wrapper.unmount()
  })

  it('collapses an expanded node with ArrowLeft', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // First node is 'src' which is expanded — ArrowLeft should collapse it
    await tree.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([[]])
    wrapper.unmount()
  })

  it('moves to first child with ArrowRight on expanded node', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // src is expanded, ArrowRight should move to first child (App.vue)
    await tree.trigger('keydown', { key: 'ArrowRight' })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[1]!.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('moves to parent with ArrowLeft on child node', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // Move to child first (App.vue at index 1)
    await tree.trigger('keydown', { key: 'ArrowDown' })
    // ArrowLeft on a leaf node at depth > 0 should move to parent
    await tree.trigger('keydown', { key: 'ArrowLeft' })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[0]!.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('jumps to first node with Home', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // Move down a few times
    await tree.trigger('keydown', { key: 'ArrowDown' })
    await tree.trigger('keydown', { key: 'ArrowDown' })
    // Press Home
    await tree.trigger('keydown', { key: 'Home' })
    const items = wrapper.findAll('[data-rig-tree-node]')
    expect(items[0]!.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('jumps to last node with End', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    await tree.trigger('keydown', { key: 'End' })
    const items = wrapper.findAll('[data-rig-tree-node]')
    // Last node is 'readme' at index 3
    expect(items[3]!.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('emits activate on Enter', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    await tree.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('activate')?.[0]).toEqual([nodes[0]])
    wrapper.unmount()
  })

  it('toggles expand on Space for folder nodes', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    await tree.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([expect.not.arrayContaining(['src'])])
    wrapper.unmount()
  })

  it('selects on Space for leaf nodes', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes, expanded: ['src'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // Move focus to a leaf node (index.ts is at index 1 after src is expanded: src, App.vue, main.ts, index.ts)
    await tree.trigger('keydown', { key: 'ArrowDown' }) // App.vue
    await tree.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:selected')).toBeTruthy()
    wrapper.unmount()
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(TreeView, { props: { nodes }, attachTo: document.body })
    const firstNode = wrapper.findAll('[data-rig-tree-node]')[0]!
    expect(firstNode.attributes('tabindex')).toBe('0')
    ;(firstNode.element as HTMLElement).focus()
    expect(document.activeElement).toBe(firstNode.element)
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(TreeView, { props: { nodes, expanded: [] } })
    expect(wrapper.findAll('[data-rig-tree-node]')).toHaveLength(2)
    await wrapper.setProps({ expanded: ['src'] })
    expect(wrapper.findAll('[data-rig-tree-node]')).toHaveLength(4)
  })
})
