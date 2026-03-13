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
  /** Accessible label for the radio input */
  ariaLabel?: string
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
    data-rig-radio @keydown.stop
    :data-state="modelValue === value ? 'checked' : 'unchecked'"
    :data-disabled="disabled || undefined"
  >
    <input
      type="radio" tabindex="0"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @change="onChange"
    />
    <slot />
  </label>
</template>
