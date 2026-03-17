<script setup lang="ts">
import { computed } from 'vue'

export interface AreaChartSeries {
  label: string
  data: number[]
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Array of series to render */
    series?: AreaChartSeries[]
    /** X-axis labels */
    labels?: string[]
    /** Width of the chart */
    width?: number
    /** Height of the chart */
    height?: number
    /** Fill opacity */
    fillOpacity?: number
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    series: () => [],
    labels: () => [],
    width: 400,
    height: 300,
    fillOpacity: 0.2,
    responsive: false,
  },
)

const padding = { top: 20, right: 20, bottom: 40, left: 50 }
const innerWidth = computed(() => props.width - padding.left - padding.right)
const innerHeight = computed(() => props.height - padding.top - padding.bottom)

const allValues = computed(() => props.series.flatMap((s) => s.data))
const maxVal = computed(() => Math.max(...allValues.value, 1))
const minVal = computed(() => Math.min(...allValues.value, 0))
const range = computed(() => maxVal.value - minVal.value || 1)
const baseY = computed(() => padding.top + innerHeight.value)

const paths = computed(() =>
  props.series.map((s) => {
    const points = s.data.map((v, i) => {
      const x = padding.left + (i / Math.max(s.data.length - 1, 1)) * innerWidth.value
      const y = padding.top + ((maxVal.value - v) / range.value) * innerHeight.value
      return { x, y }
    })
    const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    const lastX = points[points.length - 1]?.x ?? padding.left
    const firstX = points[0]?.x ?? padding.left
    const areaD = `${lineD} L${lastX},${baseY.value} L${firstX},${baseY.value} Z`
    return { series: s, lineD, areaD }
  }),
)
</script>

<template>
  <svg
    data-rig-area-chart
    :width="responsive ? undefined : width"
    :height="responsive ? undefined : height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Area chart"
    tabindex="0"
    @keydown.stop
  >
    <g v-for="(path, i) in paths" :key="i" data-rig-area-chart-series>
      <path
        data-rig-area-chart-fill
        :d="path.areaD"
        :fill="path.series.color ?? 'currentColor'"
        :opacity="fillOpacity"
      />
      <path
        data-rig-area-chart-line
        :d="path.lineD"
        fill="none"
        :stroke="path.series.color ?? 'currentColor'"
        :stroke-width="'var(--rig-chart-stroke-width, 2)'"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <g v-if="labels.length" data-rig-area-chart-labels>
      <text
        v-for="(label, li) in labels"
        :key="li"
        data-rig-area-chart-label
        :x="padding.left + (li / Math.max(labels.length - 1, 1)) * innerWidth"
        :y="height - 8"
        text-anchor="middle"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 11)'"
      >
        {{ label }}
      </text>
    </g>
  </svg>
</template>
