<script setup lang="ts">
import type { Size } from '../types'

withDefaults(
  defineProps<{
    /** Size of the dot */
    size?: Size
    /** Custom color — uses --domain-accent by default */
    color?: string
    /** Whether the dot should pulse */
    pulse?: boolean
  }>(),
  {
    size: 'md',
    pulse: false,
  },
)
</script>

<template>
  <span
    data-rig-dot
    :data-size="size"
    :data-pulse="pulse || undefined"
    :style="color ? { '--dot-color': color } : undefined"
    role="presentation"
    tabindex="-1"
    @keydown.stop
  />
</template>
