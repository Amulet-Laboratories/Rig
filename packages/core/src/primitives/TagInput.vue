<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Bound array of tag strings */
    modelValue: string[]
    /** Suggestions for autocomplete */
    suggestions?: string[]
    /** Placeholder text when empty */
    placeholder?: string
    /** Whether the input is disabled */
    disabled?: boolean
    /** Maximum number of tags (0 = unlimited) */
    max?: number
    /** Accessible label for screen readers */
    ariaLabel?: string
  }>(),
  {
    placeholder: 'Add tag…',
    max: 0,
  },
)

const emit = defineEmits<{
  'update:modelValue': [tags: string[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)

const filteredSuggestions = computed(() => {
  if (!props.suggestions?.length || !inputValue.value.trim()) return []
  const q = inputValue.value.trim().toLowerCase()
  return props.suggestions.filter(
    (s) => s.toLowerCase().includes(q) && !props.modelValue.includes(s),
  )
})

watch(inputValue, () => {
  showSuggestions.value = filteredSuggestions.value.length > 0
  highlightedIndex.value = -1
})

function addTag(value: string) {
  const tag = value.trim()
  if (!tag) return
  if (props.modelValue.includes(tag)) return
  if (props.max > 0 && props.modelValue.length >= props.max) return
  emit('update:modelValue', [...props.modelValue, tag])
  inputValue.value = ''
  showSuggestions.value = false
}

function removeTag(index: number) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightedIndex.value >= 0 && filteredSuggestions.value[highlightedIndex.value]) {
      addTag(filteredSuggestions.value[highlightedIndex.value]!)
    } else {
      addTag(inputValue.value)
    }
  } else if (e.key === 'Backspace' && !inputValue.value && props.modelValue.length) {
    removeTag(props.modelValue.length - 1)
  } else if (e.key === 'ArrowDown' && showSuggestions.value) {
    e.preventDefault()
    highlightedIndex.value = Math.min(
      highlightedIndex.value + 1,
      filteredSuggestions.value.length - 1,
    )
  } else if (e.key === 'ArrowUp' && showSuggestions.value) {
    e.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
  } else if (e.key === 'Escape') {
    showSuggestions.value = false
  }
}

function selectSuggestion(suggestion: string) {
  addTag(suggestion)
  nextTick(() => inputRef.value?.focus())
}

function onBlur() {
  // Delay to allow suggestion clicks to fire
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

function focusInput() {
  inputRef.value?.focus()
}
</script>

<template>
  <div data-rig-tag-input :data-disabled="disabled || undefined" @click="focusInput">
    <span v-for="(tag, i) in modelValue" :key="tag" data-rig-tag>
      <slot name="tag" :tag="tag" :index="i" :remove="() => removeTag(i)">
        {{ tag }}
      </slot>
      <button
        v-if="!disabled"
        data-rig-tag-remove
        type="button"
        :aria-label="`Remove ${tag}`"
        @click.stop="removeTag(i)"
      >
        &times;
      </button>
    </span>

    <input
      ref="inputRef"
      v-model="inputValue"
      :placeholder="modelValue.length === 0 ? placeholder : ''"
      :disabled="disabled"
      data-rig-tag-input-field
      role="combobox"
      :aria-label="ariaLabel"
      :aria-expanded="showSuggestions"
      aria-autocomplete="list"
      @keydown="onKeydown"
      @blur="onBlur"
    />

    <ul
      v-if="showSuggestions && filteredSuggestions.length > 0"
      data-rig-tag-suggestions
      role="listbox"
    >
      <li
        v-for="(suggestion, idx) in filteredSuggestions"
        :key="suggestion"
        data-rig-tag-suggestion
        :data-highlighted="idx === highlightedIndex || undefined"
        role="option"
        :aria-selected="idx === highlightedIndex"
        @mousedown.prevent="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>
