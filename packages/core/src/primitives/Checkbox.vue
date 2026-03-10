<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Bound checked state */
    modelValue?: boolean
    /** Whether the checkbox is disabled */
    disabled?: boolean
    /** Whether the checkbox shows an indeterminate state */
    indeterminate?: boolean
  }>(),
  {
    modelValue: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>

<template>
  <label
    data-rig-checkbox
    :data-disabled="disabled || undefined"
    :data-state="modelValue ? 'checked' : 'unchecked'"
    :data-indeterminate="indeterminate || undefined"
  >
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :indeterminate="indeterminate"
      @change="onChange"
    />
    <slot />
  </label>
</template>
