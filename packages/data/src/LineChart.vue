<script setup lang="ts">
import { computed } from 'vue'

export interface LineChartSeries {
  label: string
  data: number[]
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Array of series to render */
    series?: LineChartSeries[]
    /** X-axis labels */
    labels?: string[]
    /** Width of the chart */
    width?: number
    /** Height of the chart */
    height?: number
    /** Whether to show dots at data points */
    showDots?: boolean
  }>(),
  {
    series: () => [],
    labels: () => [],
    width: 400,
    height: 300,
    showDots: false,
  },
)

const emit = defineEmits<{
  'point-click': [series: LineChartSeries, index: number]
}>()

const padding = { top: 20, right: 20, bottom: 40, left: 50 }
const innerWidth = computed(() => props.width - padding.left - padding.right)
const innerHeight = computed(() => props.height - padding.top - padding.bottom)

const allValues = computed(() => props.series.flatMap((s) => s.data))
const maxVal = computed(() => Math.max(...allValues.value, 1))
const minVal = computed(() => Math.min(...allValues.value, 0))
const range = computed(() => maxVal.value - minVal.value || 1)

const paths = computed(() =>
  props.series.map((s) => {
    const points = s.data.map((v, i) => {
      const x = padding.left + (i / Math.max(s.data.length - 1, 1)) * innerWidth.value
      const y = padding.top + ((maxVal.value - v) / range.value) * innerHeight.value
      return { x, y, value: v }
    })
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    return { series: s, points, d }
  }),
)
</script>

<template>
  <svg
    data-rig-line-chart
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Line chart"
    tabindex="0"
    @keydown.stop
  >
    <g v-for="(path, si) in paths" :key="si" data-rig-line-chart-series>
      <path
        data-rig-line-chart-line
        :d="path.d"
        fill="none"
        :stroke="path.series.color ?? 'currentColor'"
        :stroke-width="'var(--rig-chart-stroke-width, 2)'"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <template v-if="showDots">
        <circle
          v-for="(pt, pi) in path.points"
          :key="pi"
          data-rig-line-chart-dot
          :cx="pt.x"
          :cy="pt.y"
          :r="'var(--rig-chart-dot-radius, 3)'"
          :fill="path.series.color ?? 'currentColor'"
          role="graphics-symbol"
          :aria-label="`${path.series.label}: ${pt.value}`"
          @click="emit('point-click', path.series, pi)"
        />
      </template>
    </g>
    <g v-if="labels.length" data-rig-line-chart-labels>
      <text
        v-for="(label, li) in labels"
        :key="li"
        data-rig-line-chart-label
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
