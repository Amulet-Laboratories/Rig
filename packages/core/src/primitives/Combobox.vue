<script setup lang="ts">
import { ref, computed, watch, nextTick, useId } from 'vue'
import type { ID } from '../types'

const listboxId = useId()

export interface ComboboxOption {
  id: ID
  label: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    /** DOM id for the input element (enables external <label for=""> linkage) */
    id?: string
    /** Bound value — the selected option ID */
    modelValue?: ID | null
    /** Available options */
    options: ComboboxOption[]
    /** Placeholder text */
    placeholder?: string
    /** Whether the input is disabled */
    disabled?: boolean
    /** Show a clear button when a value is selected */
    clearable?: boolean
  }>(),
  {
    placeholder: 'Search…',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: ID | null]
  select: [option: ComboboxOption]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)
const query = ref('')
const open = ref(false)
const highlightedIndex = ref(-1)

const selectedOption = computed(() =>
  props.options.find((o) => o.id === props.modelValue) ?? null,
)

// Sync display text with selected option
watch(
  selectedOption,
  (opt) => {
    if (!open.value) {
      query.value = opt?.label ?? ''
    }
  },
  { immediate: true },
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(
    (o) =>
      o.label.toLowerCase().includes(q) ||
      (o.description?.toLowerCase().includes(q) ?? false),
  )
})

watch(query, () => {
  highlightedIndex.value = -1
  if (!open.value && query.value) {
    open.value = true
  }
})

function selectOption(option: ComboboxOption) {
  emit('update:modelValue', option.id)
  emit('select', option)
  query.value = option.label
  open.value = false
}

function clear() {
  emit('update:modelValue', null)
  query.value = ''
  open.value = false
  inputRef.value?.focus()
}

function onFocus() {
  open.value = true
}

function onBlur() {
  // Delay to let click events on list items fire
  setTimeout(() => {
    open.value = false
    // Reset display to selected option or empty
    query.value = selectedOption.value?.label ?? ''
  }, 150)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!open.value) {
      open.value = true
    } else {
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filtered.value.length - 1,
      )
      scrollToHighlighted()
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
    scrollToHighlighted()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightedIndex.value >= 0 && filtered.value[highlightedIndex.value]) {
      selectOption(filtered.value[highlightedIndex.value])
    }
  } else if (e.key === 'Escape') {
    open.value = false
    query.value = selectedOption.value?.label ?? ''
  }
}

function scrollToHighlighted() {
  nextTick(() => {
    const el = listRef.value?.querySelector('[data-highlighted]') as HTMLElement | null
    el?.scrollIntoView?.({ block: 'nearest' })
  })
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <div
    data-rig-combobox
    :data-disabled="disabled || undefined"
    :data-state="open ? 'open' : 'closed'"
  >
    <div data-rig-combobox-input-wrapper>
      <input
        ref="inputRef"
        v-model="query"
        :id="id"
        :placeholder="placeholder"
        :disabled="disabled"
        role="combobox"
        :aria-expanded="open"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        :aria-controls="listboxId"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />
      <button
        v-if="clearable && modelValue != null"
        data-rig-combobox-clear
        type="button"
        aria-label="Clear"
        @click="clear"
      >&times;</button>
    </div>

    <ul
      v-if="open && filtered.length > 0"
      ref="listRef"
      :id="listboxId"
      data-rig-combobox-list
      role="listbox"
    >
      <li
        v-for="(option, idx) in filtered"
        :key="option.id"
        data-rig-combobox-option
        :data-highlighted="idx === highlightedIndex || undefined"
        :data-selected="option.id === modelValue || undefined"
        role="option"
        :aria-selected="option.id === modelValue"
        @mousedown.prevent="selectOption(option)"
      >
        <slot name="option" :option="option" :highlighted="idx === highlightedIndex">
          <span data-rig-combobox-option-label>{{ option.label }}</span>
          <span v-if="option.description" data-rig-combobox-option-desc>{{ option.description }}</span>
        </slot>
      </li>
    </ul>

    <div
      v-else-if="open && query.trim() && filtered.length === 0"
      data-rig-combobox-empty
    >
      <slot name="empty">No results</slot>
    </div>
  </div>
</template>
