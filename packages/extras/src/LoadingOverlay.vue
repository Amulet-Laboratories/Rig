<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Whether the overlay is currently active/visible */
    active?: boolean
    /** Accessible label for screen readers */
    label?: string
  }>(),
  {
    active: false,
    label: 'Loading',
  },
)

defineSlots<{
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div
    v-if="active"
    data-rig-loading-overlay
    :data-active="active || undefined"
    role="status"
    aria-live="polite"
    :aria-label="label"
  >
    <div data-rig-loading-overlay-spinner aria-hidden="true">
      <slot />
    </div>
    <span data-rig-loading-overlay-label>{{ label }}</span>
  </div>
</template>
