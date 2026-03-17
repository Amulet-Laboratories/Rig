<script setup lang="ts">
import { computed } from 'vue'

export interface ScatterPlotPoint {
  x: number
  y: number
  label?: string
  size?: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Data points */
    data?: ScatterPlotPoint[]
    /** Width of the chart */
    width?: number
    /** Height of the chart */
    height?: number
    /** Default dot radius */
    dotRadius?: number
    /** Maximum rendered radius when size values are present (bubble mode) */
    maxRadius?: number
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    data: () => [],
    width: 400,
    height: 300,
    dotRadius: 4,
    maxRadius: 30,
    responsive: false,
  },
)

/**
 * @emits point-click
 */
const emit = defineEmits<{
  'point-click': [point: ScatterPlotPoint, index: number]
}>()

const padding = { top: 20, right: 20, bottom: 20, left: 20 }
const innerWidth = computed(() => props.width - padding.left - padding.right)
const innerHeight = computed(() => props.height - padding.top - padding.bottom)

const xRange = computed(() => {
  const xs = props.data.map((d) => d.x)
  return { min: Math.min(...xs, 0), max: Math.max(...xs, 1) }
})

const yRange = computed(() => {
  const ys = props.data.map((d) => d.y)
  return { min: Math.min(...ys, 0), max: Math.max(...ys, 1) }
})

/** Whether any point supplies a size value (bubble mode) */
const hasSizeChannel = computed(() => props.data.some((d) => d.size != null))

const maxSize = computed(() => Math.max(...props.data.map((d) => d.size ?? 0), 1))

const points = computed(() =>
  props.data.map((d) => ({
    cx:
      padding.left +
      ((d.x - xRange.value.min) / (xRange.value.max - xRange.value.min || 1)) * innerWidth.value,
    cy:
      padding.top +
      ((yRange.value.max - d.y) / (yRange.value.max - yRange.value.min || 1)) * innerHeight.value,
    r:
      d.size != null && hasSizeChannel.value
        ? (d.size / maxSize.value) * props.maxRadius
        : props.dotRadius,
    color: d.color,
    label: d.label ?? `(${d.x}, ${d.y})`,
    raw: d,
  })),
)
</script>

<template>
  <svg
    data-rig-scatter-plot
    :width="responsive ? undefined : width"
    :height="responsive ? undefined : height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Scatter plot"
    tabindex="0"
    @keydown.stop
  >
    <circle
      v-for="(pt, i) in points"
      :key="i"
      data-rig-scatter-plot-point
      :cx="pt.cx"
      :cy="pt.cy"
      :r="pt.r"
      :fill="pt.color ?? 'currentColor'"
      :opacity="hasSizeChannel ? 'var(--rig-chart-bubble-opacity, 0.7)' : undefined"
      role="graphics-symbol"
      :aria-label="pt.label"
      @click="emit('point-click', pt.raw, i)"
    />
  </svg>
</template>
