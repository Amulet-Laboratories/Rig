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

function onKeydown(e: KeyboardEvent) {
  const radios = Array.from(
    (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
      'input[type="radio"]:not([disabled]), [role="radio"]:not([aria-disabled="true"])',
    ),
  )
  const idx = radios.indexOf(e.target as HTMLElement)
  if (idx < 0) return

  let next: number | null = null
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      next = (idx + 1) % radios.length
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      next = (idx - 1 + radios.length) % radios.length
      break
  }
  if (next !== null) {
    radios[next]?.focus()
    radios[next]?.click()
  }
}
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
    @keydown="onKeydown"
  >
    <!--
      Slot receives the bound modelValue so consumers can pass it down to
      each Radio via `v-bind` or explicit props.
    -->
    <slot :modelValue="modelValue" :disabled="disabled" />
  </div>
</template>
