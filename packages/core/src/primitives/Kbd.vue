<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Keyboard key or shortcut text to display */
    keys?: string
  }>(),
  {},
)

defineSlots<{
  default(props: Record<string, never>): unknown
}>()
</script>

<template>
  <kbd data-rig-kbd tabindex="-1" :aria-label="keys" @keydown.stop>
    <slot>{{ keys }}</slot>
  </kbd>
</template>
