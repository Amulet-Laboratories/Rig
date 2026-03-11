<script setup lang="ts">
import type { Size } from '../types'

withDefaults(
  defineProps<{
    /** Visual variant — consumer defines meaning via CSS */
    variant?: string
    /** Size scale */
    size?: Size
  }>(),
  {
    size: 'md',
  },
)
</script>

<template>
  <span data-rig-badge :data-variant="variant" :data-size="size">
    <slot />
  </span>
</template>
