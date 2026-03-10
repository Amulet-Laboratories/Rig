<script setup lang="ts">
import { computed } from 'vue'
import type { Orientation } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Bound numeric value */
    modelValue?: number
    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Step increment */
    step?: number
    /** Whether the slider is disabled */
    disabled?: boolean
    /** Orientation */
    orientation?: Orientation
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const percent = computed(() => {
  const range = props.max - props.min
  const val = (props.modelValue ?? props.min) - props.min
  return range > 0 ? Math.round((val / range) * 1000) / 10 : 0
})

function onInput(e: Event) {
  emit('update:modelValue', Number((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div
    data-rig-slider
    :data-orientation="orientation"
    :data-disabled="disabled || undefined"
    :style="{ '--rig-slider-percent': `${percent}%` }"
  >
    <input
      data-rig-slider-input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue ?? min"
      :disabled="disabled"
      :aria-orientation="orientation"
      @input="onInput"
    />
    <slot name="thumb" :percent="percent" />
  </div>
</template>
