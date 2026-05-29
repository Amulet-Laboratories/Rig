import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import GraphNetwork from './GraphNetwork.vue'
import type { GraphNode, GraphEdge } from './GraphNetwork.vue'

function generateNodes(count: number): GraphNode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `n-${i}`,
    label: `Node ${i}`,
    size: 6 + Math.random() * 4,
  }))
}

function generateEdges(nodes: GraphNode[], density = 0.1): GraphEdge[] {
  const edges: GraphEdge[] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() < density) {
        edges.push({ source: nodes[i]!.id, target: nodes[j]!.id })
      }
    }
  }
  return edges
}

describe('GraphNetwork mount', () => {
  bench('empty graph', () => {
    const w = mount(GraphNetwork)
    w.unmount()
  })

  bench('10 nodes, sparse edges', () => {
    const nodes = generateNodes(10)
    const edges = generateEdges(nodes, 0.3)
    const w = mount(GraphNetwork, { props: { nodes, edges } })
    w.unmount()
  })

  bench('50 nodes, sparse edges', () => {
    const nodes = generateNodes(50)
    const edges = generateEdges(nodes, 0.08)
    const w = mount(GraphNetwork, { props: { nodes, edges } })
    w.unmount()
  })

  bench('100 nodes, sparse edges', () => {
    const nodes = generateNodes(100)
    const edges = generateEdges(nodes, 0.04)
    const w = mount(GraphNetwork, { props: { nodes, edges } })
    w.unmount()
  })

  bench('100 nodes, labels hidden', () => {
    const nodes = generateNodes(100)
    const edges = generateEdges(nodes, 0.04)
    const w = mount(GraphNetwork, {
      props: { nodes, edges, showLabels: false },
    })
    w.unmount()
  })
})

describe('GraphNetwork reactivity', () => {
  const nodes = generateNodes(50)
  const edges = generateEdges(nodes, 0.1)

  bench('add nodes to existing graph', async () => {
    const w = mount(GraphNetwork, { props: { nodes, edges } })
    const moreNodes = [...nodes, ...generateNodes(10).map((n) => ({ ...n, id: `extra-${n.id}` }))]
    await w.setProps({ nodes: moreNodes })
    w.unmount()
  })

  bench('resize viewport', async () => {
    const w = mount(GraphNetwork, { props: { nodes, edges, width: 500, height: 400 } })
    await w.setProps({ width: 800, height: 600 })
    w.unmount()
  })
})
