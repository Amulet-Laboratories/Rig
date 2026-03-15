<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Label text */
    label?: string
    /** Main value to display */
    value?: string | number
    /** Trend direction */
    trend?: 'up' | 'down' | 'neutral'
    /** Trend value (e.g. "+12%") */
    trendValue?: string
    /** Description text */
    description?: string
  }>(),
  {
    label: '',
    value: '',
    trend: 'neutral',
    trendValue: '',
    description: '',
  },
)
</script>

<template>
  <div data-rig-stat-card role="group" :aria-label="label" tabindex="0" @keydown.stop>
    <div data-rig-stat-card-header>
      <span data-rig-stat-card-label>{{ label }}</span>
      <slot name="actions" />
    </div>
    <div data-rig-stat-card-value>{{ value }}</div>
    <div v-if="trendValue || description" data-rig-stat-card-footer>
      <span v-if="trendValue" data-rig-stat-card-trend :data-trend="trend">
        {{ trendValue }}
      </span>
      <span v-if="description" data-rig-stat-card-description>{{ description }}</span>
    </div>
    <slot />
  </div>
</template>
