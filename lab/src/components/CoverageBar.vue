<script setup lang="ts">
const props = defineProps<{
  label: string
  value: number
  thresholds?: { warn: number; danger: number }
}>()

function barColor(v: number): string {
  const t = props.thresholds ?? { warn: 70, danger: 50 }
  if (v >= t.warn) return '#4ade80'
  if (v >= t.danger) return '#facc15'
  return '#f87171'
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 0.25rem">
    <div style="display: flex; justify-content: space-between; font-size: 0.75rem">
      <span style="opacity: 0.6">{{ props.label }}</span>
      <span style="font-variant-numeric: tabular-nums; font-weight: 600">
        {{ props.value.toFixed(1) }}%
      </span>
    </div>
    <div
      style="
        height: 0.375rem;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.06);
        overflow: hidden;
      "
    >
      <div
        :style="{
          height: '100%',
          width: `${Math.min(props.value, 100)}%`,
          borderRadius: '9999px',
          background: barColor(props.value),
          transition: 'width 0.3s ease',
        }"
      />
    </div>
  </div>
</template>
