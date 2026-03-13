<script setup lang="ts">
defineProps<{
  /** Keyboard key or shortcut text to display */
  keys?: string
}>()
</script>

<template>
  <kbd data-rig-kbd tabindex="-1" :aria-label="keys" @keydown.stop>
    <slot>{{ keys }}</slot>
  </kbd>
</template>
