<script setup lang="ts">
import { computed } from 'vue'
import type { Size } from '../types'
import { useReducedMotion } from '../composables'

const props = withDefaults(
  defineProps<{
    /** Progress value from 0 to 100 */
    value?: number
    /** Size of the ring */
    size?: Size
    /** Width of the stroke */
    strokeWidth?: number
    /** Accessible label for the progress ring */
    ariaLabel?: string
  }>(),
  {
    value: 0,
    size: 'md',
    strokeWidth: 3,
  },
)

const sizeMap: Record<string, number> = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
}

const prefersReducedMotion = useReducedMotion()

const diameter = computed(() => sizeMap[props.size] ?? 36)
const radius = computed(() => (diameter.value - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => {
  const clamped = Math.min(100, Math.max(0, props.value))
  return circumference.value - (clamped / 100) * circumference.value
})
</script>

<template>
  <div
    data-rig-progress-ring
    :data-size="size"
    role="progressbar"
    :aria-label="ariaLabel"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
    tabindex="-1"
    @keydown.stop
  >
    <svg :width="diameter" :height="diameter" :viewBox="`0 0 ${diameter} ${diameter}`">
      <circle
        data-rig-progress-ring-track
        :cx="diameter / 2"
        :cy="diameter / 2"
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
      />
      <circle
        data-rig-progress-ring-fill
        :data-no-transition="prefersReducedMotion || undefined"
        :cx="diameter / 2"
        :cy="diameter / 2"
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        :transform="`rotate(-90 ${diameter / 2} ${diameter / 2})`"
      />
    </svg>
    <slot />
  </div>
</template>
