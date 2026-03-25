<script setup lang="ts">
import type { Size } from '../types'

withDefaults(
  defineProps<{
    /** Heading level for accessibility (renders as h2-h6, or span if 'none') */
    as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
    /** Text size variant */
    size?: Size
    /** Whether the text is muted */
    muted?: boolean
  }>(),
  { as: 'h3', size: 'xs', muted: true },
)

defineSlots<{ default(props: Record<string, never>): unknown }>()
</script>

<template>
  <component :is="as" data-rig-section-header :data-size="size" :data-muted="muted || undefined">
    <slot />
  </component>
</template>
