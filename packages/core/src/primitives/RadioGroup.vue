<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Currently selected radio value */
    modelValue?: string
    /** Accessible label for the group */
    label?: string
    /** ID of an external element that labels this group */
    labelledBy?: string
    /** Layout axis */
    orientation?: 'horizontal' | 'vertical'
    /** Disable all radios in the group */
    disabled?: boolean
  }>(),
  {
    orientation: 'vertical',
    disabled: false,
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div
    data-rig-radio-group
    role="radiogroup"
    :aria-label="label"
    :aria-labelledby="labelledBy"
    :aria-orientation="orientation"
    :aria-disabled="disabled || undefined"
    :data-orientation="orientation"
    :data-disabled="disabled || undefined"
  >
    <!--
      Slot receives the bound modelValue so consumers can pass it down to
      each Radio via `v-bind` or explicit props.
    -->
    <slot :modelValue="modelValue" :disabled="disabled" />
  </div>
</template>
