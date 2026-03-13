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
  }>(),
  {
    size: 'md',
  },
)

const IconifyIcon = defineAsyncComponent({
  loader: () => import('@iconify/vue').then((m) => m.Icon as Component),
})

const isDecorative = computed(() => !props.label)
</script>

<template>
  <span
    data-rig-icon tabindex="-1"
    @keydown.stop
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
