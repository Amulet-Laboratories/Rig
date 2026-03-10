<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Current value (0–100 by default) */
    value?: number
    /** Maximum value */
    max?: number
    /** Show indeterminate animation instead of a fill */
    indeterminate?: boolean
  }>(),
  {
    value: 0,
    max: 100,
  },
)

const percent = computed(() => {
  if (props.indeterminate) return undefined
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})
</script>

<template>
  <div
    data-rig-progress
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : value"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :data-indeterminate="indeterminate || undefined"
  >
    <div
      data-rig-progress-fill
      :style="percent !== undefined ? { width: `${percent}%` } : undefined"
    />
  </div>
</template>
