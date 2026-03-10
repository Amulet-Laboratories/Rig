<script setup lang="ts">
import type { Size } from '../types'

withDefaults(
  defineProps<{
    /** Visual variant — consumer defines meaning via CSS */
    variant?: string
    /** Size scale */
    size?: Size
    /** Whether the card is clickable/interactive */
    interactive?: boolean
    /** Accent color — applied as a CSS custom property */
    accent?: string
  }>(),
  {
    size: 'md',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <component
    :is="interactive ? 'button' : 'div'"
    data-rig-card
    :data-variant="variant"
    :data-size="size"
    :data-interactive="interactive || undefined"
    :style="accent ? { '--rig-card-accent': accent } : undefined"
    :type="interactive ? 'button' : undefined"
    @click="interactive ? $emit('click', $event) : undefined"
  >
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </component>
</template>
