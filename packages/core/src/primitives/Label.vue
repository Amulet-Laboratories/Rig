<script setup lang="ts">
defineProps<{
  /** The id of the form element this label is associated with */
  for?: string
  /** Whether the associated input is disabled */
  disabled?: boolean
}>()
</script>

<template>
  <label
    data-rig-label
    tabindex="-1"
    :data-disabled="disabled || undefined"
    :aria-disabled="disabled || undefined"
    :for="$props.for"
    @keydown.stop
  >
    <slot />
  </label>
</template>
