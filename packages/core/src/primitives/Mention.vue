<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

interface MentionItem {
  /** Unique identifier */
  id: string | number
  /** Display label */
  label: string
}

const props = withDefaults(
  defineProps<{
    /** Current textarea value */
    modelValue?: string
    /** Character that triggers the mention popup */
    trigger?: string
    /** Available items for mention suggestions */
    items?: MentionItem[]
    /** Whether the input is disabled */
    disabled?: boolean
    /** Placeholder text */
    placeholder?: string
    /** Accessible label */
    ariaLabel?: string
  }>(),
  {
    modelValue: '',
    trigger: '@',
    items: () => [],
    disabled: false,
    placeholder: '',
    ariaLabel: 'Mention input',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [item: MentionItem]
}>()

defineSlots<{
  item?: (props: { item: MentionItem; active: boolean }) => unknown
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const mentionRef = ref<HTMLElement | null>(null)
const showList = ref(false)
const query = ref('')
const activeIndex = ref(0)
const triggerStart = ref(-1)

const listId = `rig-mention-list-${Math.random().toString(36).slice(2, 9)}`

const filtered = computed(() => {
  if (!query.value) return props.items
  const q = query.value.toLowerCase()
  return props.items.filter((item) => item.label.toLowerCase().includes(q))
})

function getActiveDescendant() {
  if (!showList.value || filtered.value.length === 0) return undefined
  return `${listId}-item-${activeIndex.value}`
}

function onInput(e: Event) {
  if (props.disabled) return
  const target = e.target as HTMLTextAreaElement
  const value = target.value
  emit('update:modelValue', value)

  const cursorPos = target.selectionStart ?? 0
  const textBeforeCursor = value.slice(0, cursorPos)

  // Find the last trigger character before cursor
  const lastTriggerIndex = textBeforeCursor.lastIndexOf(props.trigger)
  if (lastTriggerIndex >= 0) {
    const textBetween = textBeforeCursor.slice(lastTriggerIndex + props.trigger.length)
    // Only show if no spaces in the query (single-word mentions)
    if (
      !textBetween.includes(' ') &&
      (lastTriggerIndex === 0 || textBeforeCursor[lastTriggerIndex - 1] === ' ')
    ) {
      triggerStart.value = lastTriggerIndex
      query.value = textBetween
      showList.value = true
      activeIndex.value = 0
      return
    }
  }

  showList.value = false
  query.value = ''
}

function selectItem(item: MentionItem) {
  if (!textareaRef.value) return
  const before = props.modelValue.slice(0, triggerStart.value)
  const cursorPos = textareaRef.value.selectionStart ?? 0
  const after = props.modelValue.slice(cursorPos)
  const newValue = `${before}${props.trigger}${item.label} ${after}`
  emit('update:modelValue', newValue)
  emit('select', item)
  showList.value = false
  query.value = ''

  nextTick(() => {
    if (textareaRef.value) {
      const pos = before.length + props.trigger.length + item.label.length + 1
      textareaRef.value.setSelectionRange(pos, pos)
      textareaRef.value.focus()
    }
  })
}

function onKeydown(e: KeyboardEvent) {
  if (!showList.value || filtered.value.length === 0) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % filtered.value.length
      break
    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value = (activeIndex.value - 1 + filtered.value.length) % filtered.value.length
      break
    case 'Enter': {
      e.preventDefault()
      const item = filtered.value[activeIndex.value]
      if (item) selectItem(item)
      break
    }
    case 'Escape':
      e.preventDefault()
      showList.value = false
      break
  }
}

function onClickOutside(e: MouseEvent) {
  if (mentionRef.value && !mentionRef.value.contains(e.target as Node)) {
    showList.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
</script>

<template>
  <div
    ref="mentionRef"
    data-rig-mention
    :data-disabled="disabled || undefined"
    :data-state="showList ? 'open' : 'closed'"
  >
    <textarea
      ref="textareaRef"
      data-rig-mention-input
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      aria-autocomplete="list"
      :aria-expanded="showList"
      :aria-controls="showList ? listId : undefined"
      :aria-activedescendant="getActiveDescendant()"
      role="combobox"
      @input="onInput"
      @keydown="onKeydown"
    />

    <ul v-if="showList && filtered.length > 0" :id="listId" data-rig-mention-list role="listbox">
      <li
        v-for="(item, index) in filtered"
        :id="`${listId}-item-${index}`"
        :key="item.id"
        data-rig-mention-item
        :data-active="index === activeIndex || undefined"
        role="option"
        :aria-selected="index === activeIndex"
        @click="selectItem(item)"
        @mouseenter="activeIndex = index"
      >
        <slot name="item" :item="item" :active="index === activeIndex">
          {{ item.label }}
        </slot>
      </li>
    </ul>
  </div>
</template>
