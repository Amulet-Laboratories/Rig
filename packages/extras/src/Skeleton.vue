<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Number of skeleton lines to render */
    lines?: number
    /** Whether to animate the shimmer effect */
    animate?: boolean
    /** Width of each line — string or array of strings for per-line widths */
    width?: string | string[]
  }>(),
  {
    lines: 1,
    animate: true,
  },
)

function lineWidth(index: number, width?: string | string[]): string | undefined {
  if (!width) return undefined
  if (typeof width === 'string') return width
  return width[index] ?? width[width.length - 1]
}
</script>

<template>
  <div data-rig-skeleton tabindex="-1" @keydown.stop role="status" aria-busy="true" aria-label="Loading" :data-animate="animate || undefined">
    <div
      v-for="i in lines"
      :key="i"
      data-rig-skeleton-line
      :style="lineWidth(i - 1, width) ? { width: lineWidth(i - 1, width) } : undefined"
    />
  </div>
</template>
