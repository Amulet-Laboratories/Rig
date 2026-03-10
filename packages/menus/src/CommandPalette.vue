<script setup lang="ts">
import { ref, watch, computed, nextTick, onUnmounted, useId } from 'vue'
import type { ListItem } from '@core/types'

const listboxId = useId()

const props = withDefaults(
  defineProps<{
    /** Whether the palette is open */
    open?: boolean
    /** Items or async function returning items */
    items: ListItem[] | ((query: string) => Promise<ListItem[]>)
    /** Input placeholder */
    placeholder?: string
  }>(),
  {
    open: false,
    placeholder: 'Type a command...',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [item: ListItem]
}>()

const query = ref('')
const resolvedItems = ref<ListItem[]>([])
const focusedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const paletteRef = ref<HTMLElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function close() {
  query.value = ''
  focusedIndex.value = 0
  emit('update:open', false)
}

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

async function fetchItems(q: string) {
  if (typeof props.items === 'function') {
    resolvedItems.value = await props.items(q)
  } else {
    const lower = q.toLowerCase()
    resolvedItems.value = q
      ? props.items.filter(
          (item) =>
            item.label.toLowerCase().includes(lower) ||
            item.description?.toLowerCase().includes(lower),
        )
      : props.items
  }
  focusedIndex.value = 0
}

watch(query, (q) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchItems(q), 100)
})

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      query.value = ''
      await fetchItems('')
      await nextTick()
      inputRef.value?.focus()
    }
  },
  { immediate: true },
)

function selectItem(item: ListItem) {
  if (!item.disabled) {
    emit('select', item)
    close()
  }
}

const focusedId = computed(() => resolvedItems.value[focusedIndex.value]?.id)

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIndex.value = Math.min(focusedIndex.value + 1, resolvedItems.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      if (resolvedItems.value[focusedIndex.value]) {
        selectItem(resolvedItems.value[focusedIndex.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      close()
      break
  }
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      data-rig-command-palette-overlay
      @click="onOverlayClick"
    >
      <div
        ref="paletteRef"
        data-rig-command-palette
        role="combobox"
        aria-expanded="true"
        aria-haspopup="listbox"
        @keydown="onKeydown"
      >
        <input
          ref="inputRef"
          v-model="query"
          data-rig-command-palette-input
          type="text"
          role="searchbox"
          :placeholder="placeholder"
          aria-autocomplete="list"
          :aria-controls="listboxId"
          :aria-activedescendant="focusedId"
        />
        <div
          :id="listboxId"
          data-rig-command-palette-results
          role="listbox"
        >
          <div
            v-for="(item, index) in resolvedItems"
            :key="item.id"
            :id="item.id"
            data-rig-command-palette-item
            role="option"
            :aria-selected="focusedIndex === index"
            :data-highlighted="focusedIndex === index || undefined"
            :data-disabled="item.disabled || undefined"
            @click="selectItem(item)"
          >
            <slot name="item" :item="item" :highlighted="focusedIndex === index" :query="query">
              <span data-rig-command-palette-item-label>{{ item.label }}</span>
              <span v-if="item.description" data-rig-command-palette-item-description>
                {{ item.description }}
              </span>
            </slot>
          </div>
          <div
            v-if="resolvedItems.length === 0"
            data-rig-command-palette-empty
          >
            <slot name="empty">No results</slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
