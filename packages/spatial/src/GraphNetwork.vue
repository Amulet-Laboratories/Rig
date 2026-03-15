<script setup lang="ts">
import { computed } from 'vue'

export interface GraphNode {
  id: string
  label?: string
  x?: number
  y?: number
  color?: string
  size?: number
}

export interface GraphEdge {
  source: string
  target: string
  label?: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Nodes */
    nodes?: GraphNode[]
    /** Edges */
    edges?: GraphEdge[]
    /** Width */
    width?: number
    /** Height */
    height?: number
    /** Whether to show labels */
    showLabels?: boolean
  }>(),
  {
    nodes: () => [],
    edges: () => [],
    width: 500,
    height: 400,
    showLabels: true,
  },
)

const emit = defineEmits<{
  'node-click': [node: GraphNode]
  'edge-click': [edge: GraphEdge]
}>()

// Simple circular layout for nodes without explicit positions
const positionedNodes = computed(() => {
  const count = props.nodes.length
  return props.nodes.map((n, i) => {
    const angle = (Math.PI * 2 * i) / Math.max(count, 1)
    const r = Math.min(props.width, props.height) / 3
    return {
      ...n,
      cx: n.x ?? props.width / 2 + r * Math.cos(angle),
      cy: n.y ?? props.height / 2 + r * Math.sin(angle),
      r: n.size ?? 8,
    }
  })
})

const nodeMap = computed(() => new Map(positionedNodes.value.map((n) => [n.id, n])))

const edgeLines = computed(
  () =>
    props.edges
      .map((e) => {
        const src = nodeMap.value.get(e.source)
        const tgt = nodeMap.value.get(e.target)
        if (!src || !tgt) return null
        return {
          x1: src.cx,
          y1: src.cy,
          x2: tgt.cx,
          y2: tgt.cy,
          color: e.color,
          label: e.label,
          edge: e,
        }
      })
      .filter(Boolean) as {
      x1: number
      y1: number
      x2: number
      y2: number
      color?: string
      label?: string
      edge: GraphEdge
    }[],
)
</script>

<template>
  <svg
    data-rig-graph-network
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Network graph"
    tabindex="0"
    @keydown.stop
  >
    <!-- Edges -->
    <line
      v-for="(edge, i) in edgeLines"
      :key="`edge-${i}`"
      data-rig-graph-network-edge
      :x1="edge.x1"
      :y1="edge.y1"
      :x2="edge.x2"
      :y2="edge.y2"
      :stroke="edge.color ?? 'currentColor'"
      :opacity="'var(--rig-chart-edge-opacity, 0.3)'"
      :stroke-width="'var(--rig-chart-edge-width, 1.5)'"
      @click="emit('edge-click', edge.edge)"
    />
    <!-- Nodes -->
    <g
      v-for="node in positionedNodes"
      :key="node.id"
      data-rig-graph-network-node
      role="button"
      :aria-label="node.label ?? node.id"
      @click="emit('node-click', node)"
    >
      <circle
        data-rig-graph-network-node-circle
        :cx="node.cx"
        :cy="node.cy"
        :r="node.r"
        :fill="node.color ?? 'currentColor'"
      />
      <text
        v-if="showLabels && node.label"
        data-rig-graph-network-node-label
        :x="node.cx"
        :y="node.cy + node.r + 14"
        text-anchor="middle"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 11)'"
      >
        {{ node.label }}
      </text>
    </g>
  </svg>
</template>
