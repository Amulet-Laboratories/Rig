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
  <span data-rig-badge tabindex="-1" role="status" :data-variant="variant" :data-size="size" @keydown.stop>
    <slot />
  </span>
</template>
