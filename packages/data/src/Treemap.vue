<script setup lang="ts">
import { computed } from 'vue'

export interface TreemapNode {
  label: string
  value: number
  color?: string
  children?: TreemapNode[]
}

const props = withDefaults(
  defineProps<{
    /** Tree data */
    data?: TreemapNode[]
    /** Width of the chart */
    width?: number
    /** Height of the chart */
    height?: number
  }>(),
  {
    data: () => [],
    width: 400,
    height: 300,
  },
)

const emit = defineEmits<{
  'node-click': [node: TreemapNode]
}>()

interface LayoutRect {
  x: number
  y: number
  w: number
  h: number
  node: TreemapNode
}

function layout(nodes: TreemapNode[], x: number, y: number, w: number, h: number): LayoutRect[] {
  const total = nodes.reduce((sum, n) => sum + n.value, 0) || 1
  const rects: LayoutRect[] = []
  let offset = 0
  const isHorizontal = w >= h

  for (const node of nodes) {
    const ratio = node.value / total
    if (isHorizontal) {
      const rectW = w * ratio
      rects.push({ x: x + offset, y, w: rectW, h, node })
      offset += rectW
    } else {
      const rectH = h * ratio
      rects.push({ x, y: y + offset, w, h: rectH, node })
      offset += rectH
    }
  }
  return rects
}

const rects = computed(() => layout(props.data, 0, 0, props.width, props.height))
</script>

<template>
  <svg
    data-rig-treemap
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Treemap"
    tabindex="0"
    @keydown.stop
  >
    <g
      v-for="(rect, i) in rects"
      :key="i"
      data-rig-treemap-node
      @click="emit('node-click', rect.node)"
    >
      <rect
        data-rig-treemap-rect
        :x="rect.x + 1"
        :y="rect.y + 1"
        :width="Math.max(rect.w - 2, 0)"
        :height="Math.max(rect.h - 2, 0)"
        :fill="rect.node.color ?? 'currentColor'"
        :opacity="'var(--rig-chart-node-opacity, 0.7)'"
        :rx="'var(--rig-chart-cell-radius, 2)'"
        role="graphics-symbol"
        :aria-label="`${rect.node.label}: ${rect.node.value}`"
      />
      <text
        v-if="rect.w > 40 && rect.h > 20"
        data-rig-treemap-label
        :x="rect.x + rect.w / 2"
        :y="rect.y + rect.h / 2"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 11)'"
      >
        {{ rect.node.label }}
      </text>
    </g>
  </svg>
</template>
