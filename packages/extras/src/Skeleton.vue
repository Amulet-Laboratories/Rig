<script setup lang="ts">
import { useReducedMotion } from '@core/composables'

withDefaults(
  defineProps<{
    /** Display mode — 'skeleton' renders shaped placeholder lines, 'shimmer' renders an animated gradient block */
    mode?: 'skeleton' | 'shimmer'
    /** Number of skeleton lines to render (skeleton mode only) */
    lines?: number
    /** Whether to animate the effect */
    animate?: boolean
    /** Width — string or array of strings for per-line widths (skeleton mode) or block width (shimmer mode) */
    width?: string | string[]
    /** Height of the shimmer block (shimmer mode only) */
    height?: string
    /** Border radius (shimmer mode only) */
    borderRadius?: string
  }>(),
  {
    mode: 'skeleton',
    lines: 1,
    animate: true,
    height: '1rem',
    borderRadius: 'inherit',
  },
)

const prefersReducedMotion = useReducedMotion()

function lineWidth(index: number, width?: string | string[]): string | undefined {
  if (!width) return undefined
  if (typeof width === 'string') return width
  return width[index] ?? width[width.length - 1]
}
</script>

<template>
  <div
    data-rig-skeleton
    :data-mode="mode"
    :tabindex="-1"
    :role="mode === 'shimmer' ? 'presentation' : 'status'"
    :aria-hidden="mode === 'shimmer' ? true : undefined"
    :aria-busy="mode !== 'shimmer' ? true : undefined"
    :aria-label="mode !== 'shimmer' ? 'Loading' : undefined"
    :data-animate="mode !== 'shimmer' && animate && !prefersReducedMotion ? '' : undefined"
    :style="
      mode === 'shimmer'
        ? { width: typeof width === 'string' ? width : '100%', height, borderRadius }
        : undefined
    "
    @keydown.stop
  >
    <!-- Shimmer mode -->
    <div v-if="mode === 'shimmer'" data-rig-shimmer-wave />

    <!-- Skeleton mode (default) -->
    <template v-else>
      <div
        v-for="i in lines"
        :key="i"
        data-rig-skeleton-line
        :style="lineWidth(i - 1, width) ? { width: lineWidth(i - 1, width) } : undefined"
      />
    </template>
  </div>
</template>
