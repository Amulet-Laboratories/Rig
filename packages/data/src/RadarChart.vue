<script setup lang="ts">
import { computed } from 'vue'

export interface RadarChartAxis {
  label: string
  max?: number
}

export interface RadarChartSeries {
  label: string
  data: number[]
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Axis definitions */
    axes?: RadarChartAxis[]
    /** Data series */
    series?: RadarChartSeries[]
    /** Size of the chart (width & height) */
    size?: number
    /** Number of concentric rings */
    rings?: number
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    axes: () => [],
    series: () => [],
    size: 300,
    rings: 5,
    responsive: false,
  },
)

const center = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - 30)

function angleFor(i: number): number {
  return (Math.PI * 2 * i) / props.axes.length - Math.PI / 2
}

function pointOnAxis(i: number, value: number, max: number): { x: number; y: number } {
  const r = (value / (max || 1)) * radius.value
  const angle = angleFor(i)
  return {
    x: center.value + r * Math.cos(angle),
    y: center.value + r * Math.sin(angle),
  }
}

const ringPaths = computed(() => {
  const result: string[] = []
  for (let ring = 1; ring <= props.rings; ring++) {
    const frac = ring / props.rings
    const points = props.axes.map((_, i) => {
      const angle = angleFor(i)
      const r = frac * radius.value
      return `${center.value + r * Math.cos(angle)},${center.value + r * Math.sin(angle)}`
    })
    result.push(`M${points.join(' L')} Z`)
  }
  return result
})

const axisLines = computed(() =>
  props.axes.map((_, i) => {
    const angle = angleFor(i)
    return {
      x2: center.value + radius.value * Math.cos(angle),
      y2: center.value + radius.value * Math.sin(angle),
    }
  }),
)

const axisLabelPositions = computed(() =>
  props.axes.map((a, i) => {
    const angle = angleFor(i)
    const r = radius.value + 16
    return {
      x: center.value + r * Math.cos(angle),
      y: center.value + r * Math.sin(angle),
      label: a.label,
    }
  }),
)

const seriesPaths = computed(() =>
  props.series.map((s) => {
    const points = s.data.map((v, i) => {
      const max = props.axes[i]?.max ?? Math.max(...s.data, 1)
      return pointOnAxis(i, v, max)
    })
    const d = `${points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} Z`
    return { series: s, d }
  }),
)
</script>

<template>
  <svg
    data-rig-radar-chart
    :width="responsive ? undefined : size"
    :height="responsive ? undefined : size"
    :viewBox="`0 0 ${size} ${size}`"
    role="img"
    aria-label="Radar chart"
    tabindex="0"
    @keydown.stop
  >
    <!-- Grid rings -->
    <path
      v-for="(ring, i) in ringPaths"
      :key="`ring-${i}`"
      data-rig-radar-chart-ring
      :d="ring"
      fill="none"
      stroke="currentColor"
      :opacity="'var(--rig-chart-grid-opacity, 0.15)'"
    />
    <!-- Axis lines -->
    <line
      v-for="(axis, i) in axisLines"
      :key="`axis-${i}`"
      data-rig-radar-chart-axis
      :x1="center"
      :y1="center"
      :x2="axis.x2"
      :y2="axis.y2"
      stroke="currentColor"
      :opacity="'var(--rig-chart-axis-opacity, 0.2)'"
    />
    <!-- Series polygons -->
    <g v-for="(p, i) in seriesPaths" :key="`series-${i}`" data-rig-radar-chart-series>
      <path
        data-rig-radar-chart-area
        :d="p.d"
        :style="p.series.color ? { fill: p.series.color } : undefined"
        :opacity="'var(--rig-chart-fill-opacity, 0.15)'"
      />
      <path
        data-rig-radar-chart-line
        :d="p.d"
        fill="none"
        :style="p.series.color ? { stroke: p.series.color } : undefined"
        :stroke-width="'var(--rig-chart-stroke-width, 2)'"
      />
    </g>
    <!-- Axis labels -->
    <text
      v-for="(lp, i) in axisLabelPositions"
      :key="`label-${i}`"
      data-rig-radar-chart-label
      :x="lp.x"
      :y="lp.y"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="currentColor"
      :font-size="'var(--rig-chart-label-size, 11)'"
    >
      {{ lp.label }}
    </text>
  </svg>
</template>
