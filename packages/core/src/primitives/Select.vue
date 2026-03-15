<script setup lang="ts">
import type { SelectOption } from '../types'

const {
  id,
  modelValue = '',
  options = [],
  placeholder,
  disabled,
  ariaLabel,
  ariaLabelledby,
} = defineProps<{
  /** DOM id for the select element (enables external <label for=""> linkage) */
  id?: string
  /** Bound value */
  modelValue?: string
  /** Available options */
  options?: SelectOption[]
  /** Placeholder shown when no value selected */
  placeholder?: string
  /** Whether the select is disabled */
  disabled?: boolean
  /** Accessible label when no visible label exists */
  ariaLabel?: string
  /** ID of the element that labels this select */
  ariaLabelledby?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

function onChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div data-rig-select :data-disabled="disabled || undefined" @keydown.stop>
    <slot name="leading" />
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
      tabindex="0"
      @change="onChange"
    >
      <option v-if="placeholder" value="" disabled :selected="!modelValue">
        {{ placeholder }}
      </option>
      <option v-for="opt in options" :key="opt.id" :value="opt.id" :disabled="opt.disabled">
        {{ opt.label }}
      </option>
    </select>
    <slot name="trailing" />
  </div>
</template>
