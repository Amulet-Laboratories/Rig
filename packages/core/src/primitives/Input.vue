<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** DOM id for the input element (enables external <label for=""> linkage) */
    id?: string
    /** Bound value */
    modelValue?: string
    /** Placeholder text */
    placeholder?: string
    /** Whether the input is disabled */
    disabled?: boolean
    /** Show a clear button when value is non-empty */
    clearable?: boolean
    /** Debounce delay in ms (0 = no debounce) */
    debounce?: number
    /** Native input type */
    type?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    debounce: 0,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  enter: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const inputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value

  if (props.debounce > 0) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      emit('update:modelValue', value)
    }, props.debounce)
  } else {
    emit('update:modelValue', value)
  }
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    emit('enter')
  }
}

/** Focus the underlying input element */
function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div
    data-rig-input
    :data-disabled="disabled || undefined"
    :data-clearable="clearable || undefined"
  >
    <slot name="leading" />
    <input
      ref="inputRef"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :type="type"
      @input="onInput"
      @keydown="onKeydown"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <button
      v-if="clearable && modelValue"
      data-rig-input-clear
      type="button"
      aria-label="Clear"
      :disabled="disabled"
      @click="onClear"
    >
      <slot name="clear-icon">&times;</slot>
    </button>
    <slot name="trailing" />
  </div>
</template>
