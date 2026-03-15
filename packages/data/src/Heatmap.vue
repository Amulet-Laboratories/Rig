<script setup lang="ts">
import { computed } from 'vue'

export interface HeatmapCell {
  row: number
  col: number
  value: number
}

const props = withDefaults(
  defineProps<{
    /** Cell data */
    data?: HeatmapCell[]
    /** Number of rows */
    rows?: number
    /** Number of columns */
    cols?: number
    /** Row labels */
    rowLabels?: string[]
    /** Column labels */
    colLabels?: string[]
    /** Cell size in pixels */
    cellSize?: number
    /** Gap between cells */
    gap?: number
  }>(),
  {
    data: () => [],
    rows: 5,
    cols: 7,
    rowLabels: () => [],
    colLabels: () => [],
    cellSize: 32,
    gap: 2,
  },
)

const emit = defineEmits<{
  'cell-click': [cell: HeatmapCell]
}>()

const maxValue = computed(() => Math.max(...props.data.map((d) => d.value), 1))

const labelOffset = computed(() => (props.rowLabels.length ? 60 : 0))
const headerOffset = computed(() => (props.colLabels.length ? 24 : 0))

const svgWidth = computed(() => labelOffset.value + props.cols * (props.cellSize + props.gap))
const svgHeight = computed(() => headerOffset.value + props.rows * (props.cellSize + props.gap))

function getCellValue(row: number, col: number): number {
  return props.data.find((d) => d.row === row && d.col === col)?.value ?? 0
}

function getIntensity(value: number): number {
  return value / maxValue.value
}
</script>

<template>
  <svg
    data-rig-heatmap
    :width="svgWidth"
    :height="svgHeight"
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
    role="img"
    aria-label="Heatmap"
    tabindex="0"
    @keydown.stop
  >
    <g v-if="colLabels.length" data-rig-heatmap-col-labels>
      <text
        v-for="(label, ci) in colLabels"
        :key="ci"
        :x="labelOffset + ci * (cellSize + gap) + cellSize / 2"
        :y="14"
        text-anchor="middle"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 10)'"
      >
        {{ label }}
      </text>
    </g>
    <g v-if="rowLabels.length" data-rig-heatmap-row-labels>
      <text
        v-for="(label, ri) in rowLabels"
        :key="ri"
        :x="labelOffset - 6"
        :y="headerOffset + ri * (cellSize + gap) + cellSize / 2 + 4"
        text-anchor="end"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 10)'"
      >
        {{ label }}
      </text>
    </g>
    <g data-rig-heatmap-cells>
      <template v-for="r in rows" :key="`row-${r}`">
        <rect
          v-for="c in cols"
          :key="`${r}-${c}`"
          data-rig-heatmap-cell
          :x="labelOffset + (c - 1) * (cellSize + gap)"
          :y="headerOffset + (r - 1) * (cellSize + gap)"
          :width="cellSize"
          :height="cellSize"
          fill="currentColor"
          :opacity="getIntensity(getCellValue(r - 1, c - 1)) * 0.9 + 0.1"
          :rx="'var(--rig-chart-cell-radius, 2)'"
          role="graphics-symbol"
          :aria-label="`Row ${r}, Col ${c}: ${getCellValue(r - 1, c - 1)}`"
          @click="emit('cell-click', { row: r - 1, col: c - 1, value: getCellValue(r - 1, c - 1) })"
        />
      </template>
    </g>
  </svg>
</template>
