<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Whether the indicator is active */
    active?: boolean
    /** Custom color — uses --domain-accent by default */
    color?: string
  }>(),
  {
    active: true,
  },
)
</script>

<template>
  <span
    data-rig-pulse-indicator
    :data-active="active || undefined"
    :style="color ? { '--pulse-color': color } : undefined"
    role="status"
    :aria-label="active ? 'Active' : 'Inactive'"
    tabindex="-1"
    @keydown.stop
  >
    <span data-rig-pulse-indicator-ring />
    <span data-rig-pulse-indicator-dot />
  </span>
</template>
