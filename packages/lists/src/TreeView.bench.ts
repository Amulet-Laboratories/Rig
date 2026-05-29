import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeView from './TreeView.vue'
import type { ID } from '@core/types'

interface TreeNode {
  id: ID
  label: string
  children?: TreeNode[]
}

function generateFlatTree(count: number): TreeNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `node-${i}`,
    label: `Node ${i}`,
  }))
}

function generateDeepTree(depth: number, breadth: number): TreeNode[] {
  if (depth === 0) return []
  return Array.from({ length: breadth }, (_, i) => ({
    id: `d${depth}-${i}`,
    label: `Level ${depth} Node ${i}`,
    children: generateDeepTree(depth - 1, breadth),
  }))
}

describe('TreeView mount', () => {
  bench('10 flat nodes', () => {
    const w = mount(TreeView, { props: { nodes: generateFlatTree(10) } })
    w.unmount()
  })

  bench('100 flat nodes', () => {
    const w = mount(TreeView, { props: { nodes: generateFlatTree(100) } })
    w.unmount()
  })

  bench('1000 flat nodes', () => {
    const w = mount(TreeView, { props: { nodes: generateFlatTree(1000) } })
    w.unmount()
  })

  bench('deep tree (4 levels x 5 breadth = 780 nodes)', () => {
    const w = mount(TreeView, { props: { nodes: generateDeepTree(4, 5) } })
    w.unmount()
  })
})

describe('TreeView expand/collapse', () => {
  const nodes = generateDeepTree(3, 4)

  bench('expand root node', async () => {
    const w = mount(TreeView, {
      props: { nodes, expanded: [] },
    })
    await w.setProps({ expanded: ['d3-0'] })
    w.unmount()
  })
})
