<script setup lang="ts" generic="T">
import { ref, computed, watch, nextTick } from 'vue'
import type { ListItem, ID } from '@core/types'
import { useVirtualList } from '@core/composables'

const props = withDefaults(
  defineProps<{
    /** Items to render */
    items: ListItem<T>[]
    /** Currently selected item ID(s) */
    selected?: ID | ID[]
    /** Enable multi-select */
    multiSelect?: boolean
    /** Enable virtual / windowed rendering for large lists */
    virtual?: boolean
    /** Row height in px — used for virtual scroll calculations */
    itemHeight?: number
  }>(),
  {
    multiSelect: false,
    virtual: false,
    itemHeight: 24,
  },
)

const emit = defineEmits<{
  'update:selected': [value: ID | ID[]]
  activate: [item: ListItem<T>]
  contextmenu: [payload: { item: ListItem<T>; event: MouseEvent }]
}>()

const focusedIndex = ref(0)
const itemRefs = ref<HTMLElement[]>([])

function setItemRef(el: unknown, index: number) {
  if (el instanceof HTMLElement) {
    itemRefs.value[index] = el
  }
}

// Virtual scroll
const { containerRef, virtualState, onScroll } = useVirtualList(
  () => (props.virtual ? props.items : []),
  { itemHeight: props.itemHeight! },
)

const renderedItems = computed(() =>
  props.virtual
    ? virtualState.value.items.map(({ item, index }) => ({ item, index }))
    : props.items.map((item, index) => ({ item, index })),
)

const paddingTop = computed(() => (props.virtual ? virtualState.value.paddingTop : 0))
const paddingBottom = computed(() => (props.virtual ? virtualState.value.paddingBottom : 0))

watch(focusedIndex, async (idx) => {
  if (!props.virtual || !containerRef.value) return
  const top = idx * props.itemHeight!
  const bottom = top + props.itemHeight!
  const el = containerRef.value
  if (top < el.scrollTop) {
    el.scrollTop = top
  } else if (bottom > el.scrollTop + el.clientHeight) {
    el.scrollTop = bottom - el.clientHeight
  }
  await nextTick()
  itemRefs.value[idx]?.focus()
})

function isSelected(id: ID): boolean {
  if (Array.isArray(props.selected)) return props.selected.includes(id)
  return props.selected === id
}

function select(item: ListItem<T>, e?: MouseEvent) {
  if (item.disabled) return

  if (props.multiSelect && Array.isArray(props.selected)) {
    const current = [...props.selected]
    const idx = current.indexOf(item.id)
    if (e?.ctrlKey || e?.metaKey) {
      if (idx >= 0) current.splice(idx, 1)
      else current.push(item.id)
      emit('update:selected', current)
    } else {
      emit('update:selected', [item.id])
    }
  } else {
    emit('update:selected', item.id)
  }
}

function activate(item: ListItem<T>) {
  if (!item.disabled) {
    emit('activate', item)
  }
}

function onContextMenu(item: ListItem<T>, event: MouseEvent) {
  event.preventDefault()
  emit('contextmenu', { item, event })
}

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIndex.value = Math.min(focusedIndex.value + 1, props.items.length - 1)
      itemRefs.value[focusedIndex.value]?.focus()
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      itemRefs.value[focusedIndex.value]?.focus()
      break
    case 'Home':
      e.preventDefault()
      focusedIndex.value = 0
      itemRefs.value[0]?.focus()
      break
    case 'End':
      e.preventDefault()
      focusedIndex.value = props.items.length - 1
      itemRefs.value[focusedIndex.value]?.focus()
      break
    case 'Enter':
      e.preventDefault()
      activate(props.items[focusedIndex.value])
      break
    case ' ':
      e.preventDefault()
      select(props.items[focusedIndex.value])
      break
  }
}
</script>

<template>
  <div
    ref="containerRef"
    data-rig-list
    role="listbox"
    :aria-multiselectable="multiSelect || undefined"
    :data-virtual="virtual || undefined"
    @keydown="onKeydown"
    @scroll="virtual ? onScroll() : undefined"
  >
    <div :style="{ paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }">
    <div
      v-for="{ item, index } in renderedItems"
      :key="item.id"
      :ref="(el) => setItemRef(el, index)"
      data-rig-list-item
      role="option"
      :aria-selected="isSelected(item.id)"
      :data-selected="isSelected(item.id) || undefined"
      :data-highlighted="focusedIndex === index || undefined"
      :data-disabled="item.disabled || undefined"
      :tabindex="index === focusedIndex ? 0 : -1"
      @click="select(item, $event)"
      @dblclick="activate(item)"
      @contextmenu="onContextMenu(item, $event)"
    >
      <slot name="item" :item="item" :selected="isSelected(item.id)" :focused="focusedIndex === index">
        <span data-rig-list-item-label>{{ item.label }}</span>
        <span v-if="item.description" data-rig-list-item-description>{{ item.description }}</span>
      </slot>
    </div>
    </div>
  </div>
</template>
