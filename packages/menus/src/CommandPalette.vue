<script setup lang="ts">
import { ref, watch, computed, nextTick, toRef, onUnmounted, useId } from 'vue'
import type { ListItem } from '@core/types'
import { useFocusTrap } from '@core/composables'

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
  error: [err: unknown]
}>()

defineSlots<{
  item?: (props: { item: ListItem; highlighted: boolean; query: string }) => unknown
  empty?: (props: Record<string, never>) => unknown
}>()

const listboxId = useId()
const optionIdPrefix = useId()

const query = ref('')
const resolvedItems = ref<ListItem[]>([])
const loadingItems = ref(false)
const focusedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const paletteRef = ref<HTMLElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function close() {
  query.value = ''
  focusedIndex.value = 0
  emit('update:open', false)
}

// Focus trap — keeps Tab/Shift+Tab within the palette while open
useFocusTrap({
  containerRef: paletteRef,
  active: toRef(props, 'open'),
  onEscape: close,
  autoFocus: false, // We handle initial focus ourselves (input)
  restoreFocus: true,
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

async function fetchItems(q: string) {
  if (typeof props.items === 'function') {
    loadingItems.value = true
    try {
      resolvedItems.value = await props.items(q)
    } catch (err) {
      emit('error', err)
    } finally {
      loadingItems.value = false
    }
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

const focusedId = computed(() => {
  const item = resolvedItems.value[focusedIndex.value]
  return item ? `${optionIdPrefix}-${item.id}` : undefined
})

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
    case 'Home':
      e.preventDefault()
      focusedIndex.value = 0
      break
    case 'End':
      e.preventDefault()
      focusedIndex.value = Math.max(resolvedItems.value.length - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      if (resolvedItems.value[focusedIndex.value]) {
        selectItem(resolvedItems.value[focusedIndex.value]!)
      }
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
      v-show="open"
      data-rig-command-palette-overlay
      :data-state="open ? 'open' : 'closed'"
      :data-loading="loadingItems || undefined"
      :aria-hidden="!open || undefined"
      :inert="!open || undefined"
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
        <div :id="listboxId" data-rig-command-palette-results role="listbox">
          <div
            v-for="(item, index) in resolvedItems"
            :id="`${optionIdPrefix}-${item.id}`"
            :key="item.id"
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
          <div v-if="resolvedItems.length === 0" data-rig-command-palette-empty>
            <slot name="empty">No results</slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
