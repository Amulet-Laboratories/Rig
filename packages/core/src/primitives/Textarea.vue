<script setup lang="ts">
import { ref } from 'vue'

const {
  id,
  modelValue = '',
  placeholder,
  disabled,
  rows = 4,
  resize = 'vertical' as const,
  maxlength = 0,
} = defineProps<{
  /** DOM id for the textarea element (enables external <label for=""> linkage) */
  id?: string
  /** Bound value */
  modelValue?: string
  /** Placeholder text */
  placeholder?: string
  /** Whether the textarea is disabled */
  disabled?: boolean
  /** Number of visible text rows */
  rows?: number
  /** Whether the user can resize */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  /** Maximum character count (0 = unlimited) */
  maxlength?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}

/** Focus the underlying textarea element */
function focus() {
  textareaRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div data-rig-textarea :data-disabled="disabled || undefined">
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength || undefined"
      :style="{ resize }"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <div v-if="maxlength > 0" data-rig-textarea-count>
      {{ modelValue.length }} / {{ maxlength }}
    </div>
  </div>
</template>
