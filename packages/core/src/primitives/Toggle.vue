<script setup lang="ts">
import type { Size } from '../types'

withDefaults(
  defineProps<{
    /** Bound pressed state */
    pressed?: boolean
    /** Whether the toggle is disabled */
    disabled?: boolean
    /** Visual variant */
    variant?: string
    /** Size scale */
    size?: Size
  }>(),
  {
    pressed: false,
  },
)

defineEmits<{
  'update:pressed': [value: boolean]
}>()
</script>

<template>
  <button
    data-rig-toggle
    type="button"
    :aria-pressed="pressed"
    :data-state="pressed ? 'on' : 'off'"
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled || undefined"
    :disabled="disabled"
    @click="$emit('update:pressed', !pressed)"
  >
    <slot />
  </button>
</template>
