<script setup lang="ts">
defineProps<{
  /** Keyboard key or shortcut text to display */
  keys?: string
}>()
</script>

<template>
  <kbd data-rig-kbd>
    <slot>{{ keys }}</slot>
  </kbd>
</template>
