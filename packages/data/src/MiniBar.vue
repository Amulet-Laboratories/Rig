<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Array of numeric data values */
    data?: number[]
    /** Width of the SVG */
    width?: number
    /** Height of the SVG */
    height?: number
    /** Gap between bars in pixels */
    gap?: number
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    data: () => [],
    width: 120,
    height: 32,
    gap: 2,
    responsive: false,
  },
)

const bars = computed(() => {
  if (props.data.length === 0) return []
  const max = Math.max(...props.data) || 1
  const barWidth = (props.width - (props.data.length - 1) * props.gap) / props.data.length

  return props.data.map((v, i) => {
    const barHeight = (v / max) * props.height
    return {
      x: i * (barWidth + props.gap),
      y: props.height - barHeight,
      width: Math.max(barWidth, 1),
      height: barHeight,
      value: v,
    }
  })
})
</script>

<template>
  <svg
    data-rig-mini-bar
    :width="responsive ? undefined : width"
    :height="responsive ? undefined : height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Bar chart"
    tabindex="0"
    @keydown.stop
  >
    <rect
      v-for="(bar, i) in bars"
      :key="i"
      data-rig-mini-bar-rect
      :x="bar.x"
      :y="bar.y"
      :width="bar.width"
      :height="bar.height"
      fill="currentColor"
    />
  </svg>
</template>
