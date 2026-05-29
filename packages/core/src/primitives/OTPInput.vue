<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Current OTP value string */
    modelValue?: string
    /** Number of input cells */
    length?: number
    /** Whether the input is disabled */
    disabled?: boolean
    /** Mask input characters (for security) */
    mask?: boolean
    /** Accessible label */
    ariaLabel?: string
  }>(),
  {
    modelValue: '',
    length: 6,
    disabled: false,
    mask: false,
    ariaLabel: 'One-time password',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
}>()

defineSlots<{
  separator?: (props: { index: number }) => unknown
}>()

const cellRefs = ref<HTMLInputElement[]>([])

const cells = computed(() => {
  const chars = props.modelValue.split('')
  return Array.from({ length: props.length }, (_, i) => chars[i] ?? '')
})

function updateValue(index: number, char: string) {
  const chars = cells.value.slice()
  chars[index] = char
  const newValue = chars.join('')
  emit('update:modelValue', newValue)
  if (newValue.length === props.length && !newValue.includes('')) {
    emit('complete', newValue)
  }
}

function focusCell(index: number) {
  nextTick(() => {
    const el = cellRefs.value[index]
    if (el) {
      el.focus()
      el.select()
    }
  })
}

function onInput(e: Event, index: number) {
  if (props.disabled) return
  const target = e.target as HTMLInputElement
  const value = target.value

  // Handle paste of multiple characters
  if (value.length > 1) {
    const chars = value.slice(0, props.length - index).split('')
    const currentCells = cells.value.slice()
    chars.forEach((char, offset) => {
      if (index + offset < props.length) {
        currentCells[index + offset] = char
      }
    })
    emit('update:modelValue', currentCells.join(''))
    const nextIndex = Math.min(index + chars.length, props.length - 1)
    focusCell(nextIndex)
    if (currentCells.join('').length === props.length) {
      emit('complete', currentCells.join(''))
    }
    return
  }

  updateValue(index, value)
  if (value && index < props.length - 1) {
    focusCell(index + 1)
  }
}

function onKeydown(e: KeyboardEvent, index: number) {
  if (props.disabled) return
  switch (e.key) {
    case 'Backspace':
      e.preventDefault()
      if (cells.value[index]) {
        updateValue(index, '')
      } else if (index > 0) {
        updateValue(index - 1, '')
        focusCell(index - 1)
      }
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (index > 0) focusCell(index - 1)
      break
    case 'ArrowRight':
      e.preventDefault()
      if (index < props.length - 1) focusCell(index + 1)
      break
    case 'Delete':
      e.preventDefault()
      updateValue(index, '')
      break
  }
}

function onPaste(e: ClipboardEvent) {
  if (props.disabled) return
  e.preventDefault()
  const text = e.clipboardData?.getData('text') ?? ''
  const chars = text.slice(0, props.length).split('')
  emit('update:modelValue', chars.join(''))
  const nextIndex = Math.min(chars.length, props.length - 1)
  focusCell(nextIndex)
  if (chars.length >= props.length) {
    emit('complete', chars.join(''))
  }
}
</script>

<template>
  <div
    data-rig-otp-input
    :data-disabled="disabled || undefined"
    role="group"
    :aria-label="ariaLabel"
    @paste="onPaste"
  >
    <template v-for="(cell, index) in cells" :key="index">
      <slot v-if="index > 0" name="separator" :index="index" />
      <input
        :ref="
          (el) => {
            if (el) cellRefs[index] = el as HTMLInputElement
          }
        "
        data-rig-otp-input-cell
        :data-filled="cell !== '' || undefined"
        :type="mask ? 'password' : 'text'"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="1"
        :value="cell"
        :disabled="disabled"
        :aria-label="`Digit ${index + 1} of ${length}`"
        @input="onInput($event, index)"
        @keydown="onKeydown($event, index)"
      />
    </template>
  </div>
</template>
