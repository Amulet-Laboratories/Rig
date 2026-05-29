<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
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
    /** Accessible label for the textarea (when no visible <label> is provided) */
    ariaLabel?: string
    /** HTML name attribute (for form submission) */
    name?: string
    /** Whether the textarea is required */
    required?: boolean
    /** Browser autocomplete hint */
    autocomplete?: string
    /** Whether the current value is invalid (for form validation) */
    invalid?: boolean
    /** ID of an element describing the textarea (e.g. error message element) */
    describedBy?: string
  }>(),
  {
    modelValue: '',
    rows: 4,
    resize: 'vertical',
    maxlength: 0,
  },
)

/**
 * @emits update:modelValue
 * @emits focus
 * @emits blur
 */
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
  <div
    data-rig-textarea
    role="group"
    aria-label="Text input"
    :data-disabled="props.disabled || undefined"
  >
    <textarea
      :id="props.id"
      ref="textareaRef"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :rows="props.rows"
      :name="props.name"
      :required="props.required || undefined"
      :autocomplete="props.autocomplete"
      :aria-invalid="props.invalid || undefined"
      :aria-describedby="props.describedBy || undefined"
      :aria-label="props.ariaLabel"
      :maxlength="props.maxlength || undefined"
      :style="{ resize: props.resize }"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @keydown.escape="textareaRef?.blur()"
    />
    <div v-if="props.maxlength > 0" data-rig-textarea-count>
      {{ props.modelValue.length }} / {{ props.maxlength }}
    </div>
  </div>
</template>
