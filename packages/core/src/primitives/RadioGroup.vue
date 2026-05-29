<script setup lang="ts">
export interface RadioOption {
  /** Value emitted when this radio is selected */
  value: string
  /** Display label — falls back to value */
  label?: string
  /** Disable this specific option */
  disabled?: boolean
}

withDefaults(
  defineProps<{
    /** Currently selected radio value */
    modelValue?: string
    /** Radio options — when provided, RadioGroup renders inputs internally */
    options?: RadioOption[]
    /** Accessible label for the group */
    label?: string
    /** ID of an external element that labels this group */
    labelledBy?: string
    /** Radio group name attribute */
    name?: string
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

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  default: (props: { modelValue?: string; disabled: boolean }) => unknown
  option?: (props: { option: RadioOption; checked: boolean; disabled: boolean }) => unknown
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
    case 'Home':
      e.preventDefault()
      next = 0
      break
    case 'End':
      e.preventDefault()
      next = radios.length - 1
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
    <!-- Options mode: RadioGroup renders radios internally -->
    <template v-if="options && options.length">
      <label
        v-for="opt in options"
        :key="opt.value"
        data-rig-radio
        :data-state="modelValue === opt.value ? 'checked' : 'unchecked'"
        :data-disabled="disabled || opt.disabled || undefined"
      >
        <input
          type="radio"
          tabindex="0"
          :name="name"
          :value="opt.value"
          :checked="modelValue === opt.value"
          :disabled="disabled || opt.disabled"
          @change="emit('update:modelValue', opt.value)"
        />
        <slot
          name="option"
          :option="opt"
          :checked="modelValue === opt.value"
          :disabled="disabled || !!opt.disabled"
        >
          {{ opt.label ?? opt.value }}
        </slot>
      </label>
    </template>

    <!-- Slot mode: consumer provides custom content -->
    <slot v-else :modelValue="modelValue" :disabled="disabled" />
  </div>
</template>
