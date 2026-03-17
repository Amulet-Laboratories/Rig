<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Current numeric value */
    modelValue?: number
    /** Minimum allowed value */
    min?: number
    /** Maximum allowed value */
    max?: number
    /** Increment/decrement step */
    step?: number
    /** Whether the input is disabled */
    disabled?: boolean
    /** Placeholder text when empty */
    placeholder?: string
    /** Accessible label */
    ariaLabel?: string
  }>(),
  {
    modelValue: 0,
    min: -Infinity,
    max: Infinity,
    step: 1,
    disabled: false,
    placeholder: '',
    ariaLabel: 'Number input',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

defineSlots<{
  increment?: (props: Record<string, never>) => unknown
  decrement?: (props: Record<string, never>) => unknown
}>()

const canIncrement = computed(() => !props.disabled && props.modelValue + props.step <= props.max)
const canDecrement = computed(() => !props.disabled && props.modelValue - props.step >= props.min)

function clamp(value: number): number {
  return Math.min(Math.max(value, props.min), props.max)
}

function increment() {
  if (!canIncrement.value) return
  emit('update:modelValue', clamp(props.modelValue + props.step))
}

function decrement() {
  if (!canDecrement.value) return
  emit('update:modelValue', clamp(props.modelValue - props.step))
}

function onInput(e: Event) {
  if (props.disabled) return
  const target = e.target as HTMLInputElement
  const parsed = parseFloat(target.value)
  if (!Number.isNaN(parsed)) {
    emit('update:modelValue', clamp(parsed))
  }
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      increment()
      break
    case 'ArrowDown':
      e.preventDefault()
      decrement()
      break
    case 'Home':
      if (props.min !== -Infinity) {
        e.preventDefault()
        emit('update:modelValue', props.min)
      }
      break
    case 'End':
      if (props.max !== Infinity) {
        e.preventDefault()
        emit('update:modelValue', props.max)
      }
      break
  }
}
</script>

<template>
  <div data-rig-number-input :data-disabled="disabled || undefined">
    <button
      data-rig-number-input-decrement
      :disabled="!canDecrement"
      :aria-disabled="!canDecrement"
      aria-label="Decrease value"
      tabindex="-1"
      @click="decrement"
    >
      <slot name="decrement">&minus;</slot>
    </button>
    <input
      data-rig-number-input-field
      type="text"
      inputmode="numeric"
      role="spinbutton"
      :aria-label="ariaLabel"
      :aria-valuenow="modelValue"
      :aria-valuemin="min !== -Infinity ? min : undefined"
      :aria-valuemax="max !== Infinity ? max : undefined"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="onInput"
      @keydown="onKeydown"
    />
    <button
      data-rig-number-input-increment
      :disabled="!canIncrement"
      :aria-disabled="!canIncrement"
      aria-label="Increase value"
      tabindex="-1"
      @click="increment"
    >
      <slot name="increment">&plus;</slot>
    </button>
  </div>
</template>
