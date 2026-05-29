<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Label for the empty state */
    label?: string
    /** Hint text below the label */
    hint?: string
    /** Custom icon character (default: empty circle) */
    icon?: string
  }>(),
  { label: 'No data to visualize', hint: '', icon: '\u25CB' },
)

defineSlots<{ default?(props: Record<string, never>): unknown }>()
</script>

<template>
  <div data-rig-chart-empty role="status">
    <span data-rig-chart-empty-icon>{{ icon }}</span>
    <p data-rig-chart-empty-label>{{ label }}</p>
    <p v-if="hint" data-rig-chart-empty-hint>{{ hint }}</p>
    <slot />
  </div>
</template>
