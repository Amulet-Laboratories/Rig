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
    /** Accessible label for the toggle button */
    ariaLabel?: string
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
    data-rig-toggle tabindex="0"
    type="button"
    :aria-pressed="pressed"
    :data-state="pressed ? 'on' : 'off'"
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled || undefined"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="$emit('update:pressed', !pressed)"
    @keydown.enter.prevent="$emit('update:pressed', !pressed)"
  >
    <slot />
  </button>
</template>
