<script setup lang="ts">
import type { Orientation } from '@core/types'

export interface StepItem {
  label: string
  description?: string
}

withDefaults(
  defineProps<{
    /** Step definitions */
    steps?: StepItem[]
    /** Current step index (0-based) */
    current?: number
    /** Layout direction */
    orientation?: Orientation
  }>(),
  {
    steps: () => [],
    current: 0,
    orientation: 'horizontal',
  },
)

defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div data-rig-stepper :data-orientation="orientation" role="list" aria-label="Progress steps">
    <div
      v-for="(step, i) in steps"
      :key="i"
      data-rig-stepper-step
      :data-state="i < current ? 'completed' : i === current ? 'active' : 'pending'"
      role="listitem"
      :aria-current="i === current ? 'step' : undefined"
      tabindex="0"
      @keydown.enter="$emit('select', i)"
      @click="$emit('select', i)"
    >
      <div data-rig-stepper-indicator>
        <span v-if="i < current" data-rig-stepper-check>&#x2713;</span>
        <span v-else data-rig-stepper-number>{{ i + 1 }}</span>
      </div>
      <div v-if="i < steps.length - 1" data-rig-stepper-connector />
      <div data-rig-stepper-content>
        <div data-rig-stepper-label>{{ step.label }}</div>
        <div v-if="step.description" data-rig-stepper-description>{{ step.description }}</div>
      </div>
    </div>
  </div>
</template>
