<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Whether the tooltip is visible */
    show: boolean
    /** Horizontal position in pixels */
    x?: number
    /** Vertical position in pixels */
    y?: number
  }>(),
  { x: 0, y: 0 },
)

defineSlots<{ default(props: Record<string, never>): unknown }>()
</script>

<template>
  <div v-if="show" data-rig-chart-tooltip role="tooltip" :style="{ left: x + 'px', top: y + 'px' }">
    <slot />
  </div>
</template>
