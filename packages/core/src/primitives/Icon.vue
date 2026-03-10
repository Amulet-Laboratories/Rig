<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { Size } from '../types'

const IconifyIcon = defineAsyncComponent(() =>
  import('@iconify/vue').then((m) => ({ default: m.Icon })),
)

const props = withDefaults(
  defineProps<{
    /** Iconify icon name (e.g. 'mdi:home') */
    icon?: string
    /** Size scale */
    size?: Size
    /** Accessible label — when omitted, icon is decorative (aria-hidden) */
    label?: string
  }>(),
  {
    size: 'md',
  },
)

const isDecorative = computed(() => !props.label)
</script>

<template>
  <span
    data-rig-icon
    :data-size="size"
    :role="isDecorative ? undefined : 'img'"
    :aria-label="label"
    :aria-hidden="isDecorative ? 'true' : undefined"
  >
    <slot>
      <IconifyIcon v-if="icon" :icon="icon" />
    </slot>
  </span>
</template>
