<script setup lang="ts">
import { ref } from 'vue'
import { useTooltip } from '@core/composables'
import type { Action, ID, Orientation } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Action items to display */
    items: Action[]
    /** Currently active item ID */
    activeId?: ID
    /** Bar orientation */
    orientation?: Orientation
    /** Enable drag-and-drop reordering of items */
    reorderable?: boolean
  }>(),
  {
    orientation: 'vertical',
    reorderable: false,
  },
)

const emit = defineEmits<{
  'update:activeId': [id: ID]
  select: [action: Action]
  reorder: [items: Action[]]
  'drag-start': [action: Action]
  'drag-end': []
}>()

defineSlots<{
  item?: (props: { item: Action; active: boolean }) => unknown
  bottom?: (props: Record<string, never>) => unknown
}>()

const tooltip = useTooltip()
const focusedIndex = ref(0)
const itemRefs = ref<HTMLElement[]>([])

// Drag-and-drop state
const dragSourceIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const dropEdge = ref<'before' | 'after' | null>(null)

function setItemRef(el: unknown, index: number) {
  if (el instanceof HTMLElement) {
    itemRefs.value[index] = el
  }
}

function onItemClick(action: Action) {
  emit('update:activeId', action.id)
  emit('select', action)
}

function onItemMouseEnter(e: MouseEvent, action: Action) {
  tooltip.show(
    e.currentTarget as HTMLElement,
    action.label ?? '',
    props.orientation === 'vertical' ? 'right' : 'bottom',
  )
}

function onItemMouseLeave() {
  tooltip.hide()
}

// ── Drag-and-drop handlers ──

function onDragStart(e: DragEvent, index: number) {
  if (!props.reorderable || !e.dataTransfer) {
    e.preventDefault()
    return
  }
  dragSourceIndex.value = index
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', String(index))
  const action = props.items[index]
  if (action) emit('drag-start', action)
  // Slight delay so the browser captures the element before we style it
  requestAnimationFrame(() => {
    const el = itemRefs.value[index]
    if (el) el.dataset.dragging = ''
  })
}

function onDragOver(e: DragEvent, index: number) {
  if (!props.reorderable || dragSourceIndex.value === null) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'

  dragOverIndex.value = index

  // Determine if cursor is in the top/left half or bottom/right half
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const isVertical = props.orientation === 'vertical'
  const pos = isVertical ? e.clientY - rect.top : e.clientX - rect.left
  const size = isVertical ? rect.height : rect.width
  dropEdge.value = pos < size / 2 ? 'before' : 'after'
}

function onDragLeave(e: DragEvent, index: number) {
  if (!props.reorderable) return
  // Only clear if actually leaving this element (not entering a child)
  const related = e.relatedTarget as Node | null
  const current = e.currentTarget as HTMLElement
  if (related && current.contains(related)) return
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null
    dropEdge.value = null
  }
}

function onDrop(e: DragEvent) {
  if (!props.reorderable || dragSourceIndex.value === null || dragOverIndex.value === null) return
  e.preventDefault()

  const from = dragSourceIndex.value
  let to = dragOverIndex.value

  // Clean up dragging attribute before reset (onDragEnd won't find it otherwise)
  const el = itemRefs.value[from]
  if (el) delete el.dataset.dragging

  // Adjust target based on drop edge
  if (dropEdge.value === 'after') to += 1
  // If dropping after the source, adjust for removal
  if (from < to) to -= 1

  if (from !== to && to >= 0 && to < props.items.length) {
    const reordered = [...props.items]
    const [moved] = reordered.splice(from, 1)
    if (moved) reordered.splice(to, 0, moved)
    emit('reorder', reordered)
  }

  resetDragState()
}

function onDragEnd() {
  if (!props.reorderable) return
  // Clean up dragging attribute
  if (dragSourceIndex.value !== null) {
    const el = itemRefs.value[dragSourceIndex.value]
    if (el) delete el.dataset.dragging
  }
  resetDragState()
  emit('drag-end')
}

function resetDragState() {
  dragSourceIndex.value = null
  dragOverIndex.value = null
  dropEdge.value = null
}

function onKeydown(e: KeyboardEvent) {
  const isVertical = props.orientation === 'vertical'
  const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
  const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

  if (e.key === nextKey) {
    e.preventDefault()
    focusedIndex.value = Math.min(focusedIndex.value + 1, props.items.length - 1)
    itemRefs.value[focusedIndex.value]?.focus()
  } else if (e.key === prevKey) {
    e.preventDefault()
    focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
    itemRefs.value[focusedIndex.value]?.focus()
  } else if (e.key === 'Home') {
    e.preventDefault()
    focusedIndex.value = 0
    itemRefs.value[0]?.focus()
  } else if (e.key === 'End') {
    e.preventDefault()
    focusedIndex.value = props.items.length - 1
    itemRefs.value[focusedIndex.value]?.focus()
  }
}
</script>

<template>
  <div
    data-rig-activity-bar
    :data-orientation="orientation"
    role="toolbar"
    :aria-orientation="orientation"
    aria-label="Activity bar"
    @keydown="onKeydown"
  >
    <div data-rig-activity-bar-top>
      <button
        v-for="(item, index) in items"
        :key="item.id"
        :ref="(el) => setItemRef(el, index)"
        data-rig-activity-bar-item
        :data-state="activeId === item.id ? 'active' : 'inactive'"
        :data-disabled="item.disabled || undefined"
        :data-drop-edge="reorderable && dragOverIndex === index ? dropEdge : undefined"
        :disabled="item.disabled"
        :draggable="reorderable || undefined"
        :tabindex="index === focusedIndex ? 0 : -1"
        :aria-label="item.label"
        @click="onItemClick(item)"
        @mouseenter="(e) => onItemMouseEnter(e, item)"
        @mouseleave="onItemMouseLeave"
        @dragstart="(e) => onDragStart(e, index)"
        @dragover="(e) => onDragOver(e, index)"
        @dragleave="(e) => onDragLeave(e, index)"
        @drop="onDrop"
        @dragend="onDragEnd"
      >
        <slot name="item" :item="item" :active="activeId === item.id">
          {{ item.label }}
        </slot>
        <span
          v-if="item.badge != null && item.badge !== ''"
          data-rig-activity-bar-badge
          :aria-label="`${item.badge} notifications`"
        >
          {{ item.badge }}
        </span>
      </button>
    </div>
    <div v-if="$slots.bottom" data-rig-activity-bar-bottom>
      <slot name="bottom" />
    </div>
  </div>
</template>
