<script setup lang="ts">
import { computed } from 'vue'

export interface PointCloudPoint {
  x: number
  y: number
  z?: number
  color?: string
  size?: number
  label?: string
}

const props = withDefaults(
  defineProps<{
    /** Data points */
    data?: PointCloudPoint[]
    /** Width */
    width?: number
    /** Height */
    height?: number
    /** Default point size */
    pointSize?: number
    /** Density rendering — reduce opacity for overlapping points */
    density?: boolean
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    data: () => [],
    width: 500,
    height: 400,
    pointSize: 2,
    density: false,
    responsive: false,
  },
)

/**
 * @emits point-click
 */
const emit = defineEmits<{
  'point-click': [point: PointCloudPoint, index: number]
}>()

const xRange = computed(() => {
  const xs = props.data.map((d) => d.x)
  return { min: Math.min(...xs, 0), max: Math.max(...xs, 1) }
})

const yRange = computed(() => {
  const ys = props.data.map((d) => d.y)
  return { min: Math.min(...ys, 0), max: Math.max(...ys, 1) }
})

const padding = 20

const points = computed(() =>
  props.data.map((d) => ({
    cx:
      padding +
      ((d.x - xRange.value.min) / (xRange.value.max - xRange.value.min || 1)) *
        (props.width - padding * 2),
    cy:
      padding +
      ((yRange.value.max - d.y) / (yRange.value.max - yRange.value.min || 1)) *
        (props.height - padding * 2),
    r: d.size ?? props.pointSize,
    color: d.color,
    label: d.label,
    raw: d,
  })),
)
</script>

<template>
  <svg
    data-rig-point-cloud
    :width="responsive ? undefined : width"
    :height="responsive ? undefined : height"
    :viewBox="`0 0 ${width} ${height}`"
    role="group"
    aria-label="Point cloud"
  >
    <circle
      v-for="(pt, i) in points"
      :key="i"
      data-rig-point-cloud-point
      :cx="pt.cx"
      :cy="pt.cy"
      :r="pt.r"
      :fill="pt.color ?? 'currentColor'"
      :opacity="
        density ? 'var(--rig-chart-density-opacity, 0.3)' : 'var(--rig-chart-point-opacity, 0.8)'
      "
      :role="pt.label ? 'graphics-symbol' : undefined"
      :aria-label="pt.label ?? undefined"
      :tabindex="pt.label ? 0 : undefined"
      @click="emit('point-click', pt.raw, i)"
      @keydown.enter.prevent="pt.label ? emit('point-click', pt.raw, i) : undefined"
      @keydown.space.prevent="pt.label ? emit('point-click', pt.raw, i) : undefined"
    />
  </svg>
</template>
