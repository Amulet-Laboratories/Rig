<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import type { Size } from '../types'

const props = withDefaults(
  defineProps<{
    /** Iconify icon name (e.g. 'mdi:home') */
    icon?: string
    /** Size scale */
    size?: Size
    /** Accessible label — when omitted, icon is decorative (aria-hidden) */
    label?: string
    /** Semantic color tone — mapped to a theme color token by CSS */
    tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted'
    /** Explicit color (any CSS color) — escape hatch for domain/brand colors;
     *  overrides `tone` when both are set */
    color?: string
  }>(),
  {
    size: 'md',
  },
)

defineSlots<{
  default(props: Record<string, never>): unknown
}>()

const IconifyIcon = defineAsyncComponent({
  loader: () => import('@iconify/vue').then((m) => m.Icon as Component),
})

const isDecorative = computed(() => !props.label)
</script>

<template>
  <span
    data-rig-icon
    tabindex="-1"
    :data-size="size"
    :data-tone="tone || undefined"
    :style="color ? { color } : undefined"
    :role="isDecorative ? undefined : 'img'"
    :aria-label="label"
    :aria-hidden="isDecorative ? 'true' : undefined"
    @keydown.stop
  >
    <slot>
      <IconifyIcon v-if="icon" :icon="icon" />
    </slot>
  </span>
</template>
