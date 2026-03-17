<script setup lang="ts">
import type { SelectOption } from '../types'

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    modelValue: '',
    options: () => [],
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

defineSlots<{
  'leading'(props: Record<string, never>): unknown
  'trailing'(props: Record<string, never>): unknown
}>()

function onChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div data-rig-select :data-disabled="props.disabled || undefined" @keydown.stop>
    <slot name="leading" />
    <select
      :id="props.id"
      :value="props.modelValue"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      :aria-labelledby="props.ariaLabelledby"
      tabindex="0"
      @change="onChange"
    >
      <option v-if="props.placeholder" value="" disabled :selected="!props.modelValue">
        {{ props.placeholder }}
      </option>
      <option v-for="opt in props.options" :key="opt.id" :value="opt.id" :disabled="opt.disabled">
        {{ opt.label }}
      </option>
    </select>
    <slot name="trailing" />
  </div>
</template>
