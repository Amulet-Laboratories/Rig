<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Bound checked state */
    modelValue?: boolean
    /** Whether the checkbox is disabled */
    disabled?: boolean
    /** Whether the checkbox shows an indeterminate state */
    indeterminate?: boolean
    /** Accessible label for icon-only checkboxes */
    ariaLabel?: string
    /** ID of the element that describes this checkbox (e.g. error message) */
    ariaDescribedBy?: string
  }>(),
  {
    modelValue: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

defineSlots<{
  default(props: Record<string, never>): unknown
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
    @keydown.stop
  >
    <input
      type="checkbox"
      tabindex="0"
      :checked="modelValue"
      :disabled="disabled"
      :indeterminate="indeterminate"
      :aria-label="ariaLabel"
      :aria-describedby="ariaDescribedBy"
      @change="onChange"
    />
    <slot />
  </label>
</template>
