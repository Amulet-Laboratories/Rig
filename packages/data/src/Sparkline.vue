<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Array of numeric data points */
    data?: number[]
    /** Width of the SVG */
    width?: number
    /** Height of the SVG */
    height?: number
    /** Stroke width */
    strokeWidth?: number
    /** Whether to show area fill */
    fill?: boolean
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    data: () => [],
    width: 120,
    height: 32,
    strokeWidth: 2,
    fill: false,
    responsive: false,
  },
)

const pathD = computed(() => {
  if (props.data.length < 2) return ''
  const max = Math.max(...props.data)
  const min = Math.min(...props.data)
  const range = max - min || 1
  const step = props.width / (props.data.length - 1)
  const padding = props.strokeWidth

  return props.data
    .map((v, i) => {
      const x = i * step
      const y = padding + ((max - v) / range) * (props.height - padding * 2)
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
})

const areaD = computed(() => {
  if (!props.fill || !pathD.value) return ''
  const step = props.width / (props.data.length - 1)
  const lastX = (props.data.length - 1) * step
  return `${pathD.value} L${lastX},${props.height} L0,${props.height} Z`
})
</script>

<template>
  <svg
    data-rig-sparkline
    :width="responsive ? undefined : width"
    :height="responsive ? undefined : height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Sparkline chart"
    tabindex="0"
    @keydown.stop
  >
    <path
      v-if="areaD"
      data-rig-sparkline-area
      :d="areaD"
      fill="currentColor"
      :opacity="'var(--rig-chart-fill-opacity, 0.15)'"
    />
    <path
      v-if="pathD"
      data-rig-sparkline-line
      :d="pathD"
      fill="none"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
