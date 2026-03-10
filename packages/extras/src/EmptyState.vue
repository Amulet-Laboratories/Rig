<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Title text */
    title?: string
    /** Description text */
    description?: string
    /** Icon name (optional) */
    icon?: string
  }>(),
  {},
)
</script>

<template>
  <div data-rig-empty-state role="status">
    <slot name="icon">
      <span v-if="icon" data-rig-empty-state-icon>{{ icon }}</span>
    </slot>
    <slot>
      <h3 v-if="title" data-rig-empty-state-title>{{ title }}</h3>
      <p v-if="description" data-rig-empty-state-description>{{ description }}</p>
    </slot>
    <slot name="action" />
  </div>
</template>
