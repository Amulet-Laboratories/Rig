<script setup lang="ts">
import { computed } from 'vue'

export interface SankeyNode {
  id: string
  label: string
  color?: string
}

export interface SankeyLink {
  source: string
  target: string
  value: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Node definitions */
    nodes?: SankeyNode[]
    /** Link definitions */
    links?: SankeyLink[]
    /** Width of the chart */
    width?: number
    /** Height of the chart */
    height?: number
    /** Node width */
    nodeWidth?: number
    /** Node padding */
    nodePadding?: number
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    nodes: () => [],
    links: () => [],
    width: 600,
    height: 400,
    nodeWidth: 20,
    nodePadding: 10,
    responsive: false,
  },
)

/**
 * @emits node-click
 * @emits link-click
 */
const emit = defineEmits<{
  'node-click': [node: SankeyNode]
  'link-click': [link: SankeyLink]
}>()

// Simple left-right layout
const layout = computed(() => {
  if (props.nodes.length === 0) return { nodes: [], links: [] }

  // Determine layers by BFS from sources
  const sourceIds = new Set(props.links.map((l) => l.source))
  const targetIds = new Set(props.links.map((l) => l.target))
  const roots = props.nodes.filter((n) => sourceIds.has(n.id) && !targetIds.has(n.id))
  const leafs = props.nodes.filter((n) => targetIds.has(n.id) && !sourceIds.has(n.id))

  // For simplicity: left column = sources, right column = targets
  const leftNodes = roots.length ? roots : props.nodes.slice(0, Math.ceil(props.nodes.length / 2))
  const rightNodes = leafs.length ? leafs : props.nodes.slice(Math.ceil(props.nodes.length / 2))

  const padding = props.nodePadding
  const p = { top: 20, bottom: 20 }
  const availH = props.height - p.top - p.bottom

  function layoutColumn(nodes: SankeyNode[], x: number) {
    const totalValue = nodes.reduce((sum, n) => {
      const inSum = props.links.filter((l) => l.target === n.id).reduce((s, l) => s + l.value, 0)
      const outSum = props.links.filter((l) => l.source === n.id).reduce((s, l) => s + l.value, 0)
      return sum + Math.max(inSum, outSum, 1)
    }, 0)

    let y = p.top
    return nodes.map((n) => {
      const inSum = props.links.filter((l) => l.target === n.id).reduce((s, l) => s + l.value, 0)
      const outSum = props.links.filter((l) => l.source === n.id).reduce((s, l) => s + l.value, 0)
      const value = Math.max(inSum, outSum, 1)
      const h = ((availH - (nodes.length - 1) * padding) * value) / totalValue
      const rect = { x, y, w: props.nodeWidth, h, node: n }
      y += h + padding
      return rect
    })
  }

  const leftLayout = layoutColumn(leftNodes, 0)
  const rightLayout = layoutColumn(rightNodes, props.width - props.nodeWidth)

  const allNodeRects = [...leftLayout, ...rightLayout]
  const nodeMap = new Map(allNodeRects.map((r) => [r.node.id, r]))

  // Compute link paths
  const linkPaths = props.links
    .map((link) => {
      const src = nodeMap.get(link.source)
      const tgt = nodeMap.get(link.target)
      if (!src || !tgt) return null

      const x0 = src.x + src.w
      const x1 = tgt.x
      const y0 = src.y + src.h / 2
      const y1 = tgt.y + tgt.h / 2
      const mid = (x0 + x1) / 2
      const thickness = Math.max(link.value / 10, 2)

      return {
        d: `M${x0},${y0} C${mid},${y0} ${mid},${y1} ${x1},${y1}`,
        thickness,
        color: link.color,
        link,
      }
    })
    .filter(Boolean) as { d: string; thickness: number; color?: string; link: SankeyLink }[]

  return { nodes: allNodeRects, links: linkPaths }
})
</script>

<template>
  <svg
    data-rig-sankey-diagram
    :width="responsive ? undefined : width"
    :height="responsive ? undefined : height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Sankey diagram"
    tabindex="0"
    @keydown.stop
  >
    <!-- Links -->
    <path
      v-for="(link, i) in layout.links"
      :key="`link-${i}`"
      data-rig-sankey-diagram-link
      :d="link.d"
      fill="none"
      :stroke="link.color ?? 'currentColor'"
      :stroke-width="link.thickness"
      :opacity="'var(--rig-chart-link-opacity, 0.3)'"
      @click="emit('link-click', link.link)"
    />
    <!-- Nodes -->
    <g
      v-for="(nr, i) in layout.nodes"
      :key="`node-${i}`"
      data-rig-sankey-diagram-node
      @click="emit('node-click', nr.node)"
    >
      <rect
        data-rig-sankey-diagram-rect
        :x="nr.x"
        :y="nr.y"
        :width="nr.w"
        :height="nr.h"
        :fill="nr.node.color ?? 'currentColor'"
        :rx="'var(--rig-chart-cell-radius, 2)'"
      />
      <text
        data-rig-sankey-diagram-label
        :x="nr.x < width / 2 ? nr.x + nr.w + 6 : nr.x - 6"
        :y="nr.y + nr.h / 2"
        :text-anchor="nr.x < width / 2 ? 'start' : 'end'"
        dominant-baseline="middle"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 11)'"
      >
        {{ nr.node.label }}
      </text>
    </g>
  </svg>
</template>
