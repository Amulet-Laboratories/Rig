<script setup lang="ts">
withDefaults(
  defineProps<{
    /** The label text for this stat */
    label?: string
    /** The value to display */
    value?: string | number
    /** Semantic color hint for the value */
    tone?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'muted'
    /** Whether to add a top border separator */
    separator?: boolean
    /** Whether the value should be bold */
    bold?: boolean
  }>(),
  { label: '', value: '', tone: 'default', separator: false, bold: false },
)

defineSlots<{
  label?(props: Record<string, never>): unknown
  default?(props: Record<string, never>): unknown
}>()
</script>

<template>
  <div
    data-rig-stat-row
    :data-tone="tone"
    :data-separator="separator || undefined"
    :data-bold="bold || undefined"
  >
    <span data-rig-stat-row-label>
      <slot name="label">{{ label }}</slot>
    </span>
    <span data-rig-stat-row-value>
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>
