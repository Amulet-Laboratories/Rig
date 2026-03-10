<script setup lang="ts">
const props = defineProps<{
  /** Currently selected value in the radio group */
  modelValue?: string
  /** This radio's value */
  value: string
  /** Radio group name */
  name: string
  /** Whether this radio is disabled */
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange() {
  emit('update:modelValue', props.value)
}
</script>

<template>
  <label
    data-rig-radio
    :data-state="modelValue === value ? 'checked' : 'unchecked'"
    :data-disabled="disabled || undefined"
  >
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="onChange"
    />
    <slot />
  </label>
</template>
