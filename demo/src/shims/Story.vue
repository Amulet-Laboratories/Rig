<script setup lang="ts">
/**
 * Story shim — replaces Histoire's <Story> for standalone rendering.
 * Passes through slot content and exposes the title for the demo shell.
 */
defineProps<{
  title?: string
  icon?: string
  group?: string
}>()
</script>

<template>
  <div data-demo-story>
    <slot />
  </div>
</template>
