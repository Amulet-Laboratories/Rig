<script setup lang="ts">
/**
 * Variant shim — replaces Histoire's <Variant> for standalone rendering.
 * Renders a simple labelled section with the slot content.
 */
defineProps<{
  title?: string
}>()
</script>

<template>
  <section data-demo-variant>
    <slot />
  </section>
</template>
