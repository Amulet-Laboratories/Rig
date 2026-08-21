<script setup lang="ts" generic="T">
// VirtualGrid — a windowed tile grid for very large sets.
//
// List windows one dimension and DataGrid windows table rows; neither can put
// fifty thousand thumbnails on screen, which is what an asset browser is. The
// windowing maths lives in `useVirtualGrid`; this component adds the listbox
// semantics, a roving active cell (aria-activedescendant, so the focused cell
// never has to be rendered), a keyed multi-selection, and the keyboard grammar
// shared with List: arrows move, Space selects, Enter activates.
//
// Selection follows DataGrid's convention — keys ride on `v-model:selection`,
// identity comes from `itemKey` (field name or function, falling back to `id`).
// The active cell is its own model for the same reason DataGrid separates
// focus from selection: browsing and blessing are different gestures.
import { ref, computed, watch, useId } from 'vue'
import { useVirtualGrid } from '@core/composables'

const props = withDefaults(
  defineProps<{
    /** Items to render */
    items: T[]
    /** Cell identity for selection/active — a field name or a function. Falls back to `id`. */
    itemKey?: string | ((item: T) => unknown)
    /** Column count derives from container width: as many columns at least this wide as fit. */
    minColumnWidth?: number
    /** Fixed column count. Takes precedence over `minColumnWidth`. */
    columns?: number
    /** Fixed row height in px. Unset means square cells: column width plus `captionHeight`. */
    rowHeight?: number
    /** Added under square cells for a caption line. Ignored when `rowHeight` is set. */
    captionHeight?: number
    /** Gap between cells and rows, px. */
    gap?: number
    /** Extra rows rendered above and below the viewport. */
    overscan?: number
    /** Enable multi-selection via Space, Ctrl-click and Shift-click. */
    selectable?: boolean
    /** Accessible label for the grid */
    ariaLabel?: string
  }>(),
  {
    minColumnWidth: 140,
    captionHeight: 0,
    gap: 8,
    overscan: 2,
    selectable: false,
  },
)

const emit = defineEmits<{
  /** Enter or double-click on a cell */
  activate: [payload: { item: T; index: number }]
  /** A cell's selection toggled */
  select: [payload: { item: T; index: number; selected: boolean }]
  contextmenu: [payload: { item: T; event: MouseEvent }]
}>()

defineSlots<{
  item?: (props: { item: T; index: number; selected: boolean; active: boolean }) => unknown
  empty?: () => unknown
}>()

const selection = defineModel<unknown[]>('selection', { default: () => [] })
const active = defineModel<unknown>('active')

const cellIdPrefix = useId()

const {
  containerRef,
  viewportHeight,
  columnCount,
  rowHeight,
  virtualState,
  onScroll,
  scrollToIndex,
} = useVirtualGrid(() => props.items, {
  minColumnWidth: () => props.minColumnWidth,
  columns: props.columns ? () => props.columns! : undefined,
  rowHeight: props.rowHeight ?? ((w: number) => w + props.captionHeight),
  gap: props.gap,
  overscan: props.overscan,
})

function keyOf(item: T): unknown {
  const k = props.itemKey
  if (typeof k === 'function') return k(item)
  return (item as Record<string, unknown>)[k ?? 'id']
}

const selectedKeys = computed(() => new Set(selection.value))

const activeIndex = ref(-1)
// Anchor for Shift-click / Shift-Space range selection.
const anchorIndex = ref(-1)

// The model is a KEY so a consumer can point at an asset without knowing its
// position; the internal index is what the keyboard moves. Keep them in step
// in both directions, and survive the items array being replaced or extended.
function syncActiveIndex() {
  const key = active.value
  if (key == null) {
    activeIndex.value = -1
    return
  }
  const items = props.items
  if (
    activeIndex.value >= 0 &&
    activeIndex.value < items.length &&
    keyOf(items[activeIndex.value]!) === key
  )
    return
  activeIndex.value = items.findIndex((it) => keyOf(it) === key)
}
watch([active, () => props.items], syncActiveIndex, { immediate: true })

function setActive(index: number) {
  if (!props.items.length) return
  const i = Math.max(0, Math.min(index, props.items.length - 1))
  activeIndex.value = i
  active.value = keyOf(props.items[i]!)
  scrollToIndex(i)
}

function toggle(item: T, index: number) {
  const k = keyOf(item)
  const cur = [...selection.value]
  const at = cur.indexOf(k)
  if (at >= 0) cur.splice(at, 1)
  else cur.push(k)
  selection.value = cur
  emit('select', { item, index, selected: at < 0 })
}

function selectRange(from: number, to: number) {
  const [a, b] = from <= to ? [from, to] : [to, from]
  const cur = new Set(selection.value)
  for (let i = a; i <= b; i++) cur.add(keyOf(props.items[i]!))
  selection.value = [...cur]
}

function onCellClick(item: T, index: number, e: MouseEvent) {
  if (props.selectable && e.shiftKey && anchorIndex.value >= 0) {
    selectRange(anchorIndex.value, index)
    setActive(index)
    return
  }
  if (props.selectable && (e.ctrlKey || e.metaKey)) {
    toggle(item, index)
    anchorIndex.value = index
    setActive(index)
    return
  }
  anchorIndex.value = index
  setActive(index)
}

const visiblePage = computed(
  () =>
    Math.max(1, Math.floor(viewportHeight.value / (rowHeight.value + props.gap))) *
    columnCount.value,
)

function onKeydown(e: KeyboardEvent) {
  if (!props.items.length) return
  const i = activeIndex.value
  const last = props.items.length - 1
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      setActive(i < 0 ? 0 : Math.min(i + 1, last))
      break
    case 'ArrowLeft':
      e.preventDefault()
      setActive(i < 0 ? 0 : Math.max(i - 1, 0))
      break
    case 'ArrowDown':
      e.preventDefault()
      setActive(i < 0 ? 0 : Math.min(i + columnCount.value, last))
      break
    case 'ArrowUp':
      e.preventDefault()
      setActive(i < 0 ? 0 : Math.max(i - columnCount.value, 0))
      break
    case 'PageDown':
      e.preventDefault()
      setActive(i < 0 ? 0 : Math.min(i + visiblePage.value, last))
      break
    case 'PageUp':
      e.preventDefault()
      setActive(i < 0 ? 0 : Math.max(i - visiblePage.value, 0))
      break
    case 'Home':
      e.preventDefault()
      setActive(0)
      break
    case 'End':
      e.preventDefault()
      setActive(last)
      break
    case 'Enter':
      e.preventDefault()
      if (i >= 0) emit('activate', { item: props.items[i]!, index: i })
      break
    case ' ':
      e.preventDefault()
      if (i < 0) break
      if (props.selectable && e.shiftKey && anchorIndex.value >= 0)
        selectRange(anchorIndex.value, i)
      else if (props.selectable) {
        toggle(props.items[i]!, i)
        anchorIndex.value = i
      } else emit('activate', { item: props.items[i]!, index: i })
      break
    case 'Escape':
      if (props.selectable && selection.value.length) {
        e.preventDefault()
        selection.value = []
      }
      break
  }
}

function onContextMenu(item: T, index: number, event: MouseEvent) {
  event.preventDefault()
  setActive(index)
  emit('contextmenu', { item, event })
}

const activeDescendant = computed(() =>
  activeIndex.value >= 0 ? `${cellIdPrefix}-${activeIndex.value}` : undefined,
)

defineExpose({ scrollToIndex, columnCount })
</script>

<template>
  <div
    ref="containerRef"
    data-rig-virtual-grid
    role="listbox"
    tabindex="0"
    :aria-label="ariaLabel"
    :aria-multiselectable="selectable || undefined"
    :aria-activedescendant="activeDescendant"
    :style="{
      '--rig-virtual-grid-columns': String(columnCount),
      '--rig-virtual-grid-gap': `${gap}px`,
      '--rig-virtual-grid-row-height': `${rowHeight}px`,
    }"
    @keydown="onKeydown"
    @scroll="onScroll"
  >
    <div v-if="!items.length" data-rig-virtual-grid-empty>
      <slot name="empty">Nothing to show.</slot>
    </div>
    <div
      v-else
      :style="{
        paddingTop: `${virtualState.paddingTop}px`,
        paddingBottom: `${virtualState.paddingBottom}px`,
      }"
    >
      <div v-for="row in virtualState.rows" :key="row.row" data-rig-virtual-grid-row>
        <div
          v-for="cell in row.cells"
          :id="`${cellIdPrefix}-${cell.index}`"
          :key="String(keyOf(cell.item) ?? cell.index)"
          data-rig-virtual-grid-cell
          role="option"
          :aria-selected="selectable ? selectedKeys.has(keyOf(cell.item)) : undefined"
          :data-selected="selectedKeys.has(keyOf(cell.item)) || undefined"
          :data-active="activeIndex === cell.index || undefined"
          @click="onCellClick(cell.item, cell.index, $event)"
          @dblclick="emit('activate', { item: cell.item, index: cell.index })"
          @contextmenu="onContextMenu(cell.item, cell.index, $event)"
        >
          <slot
            name="item"
            :item="cell.item"
            :index="cell.index"
            :selected="selectedKeys.has(keyOf(cell.item))"
            :active="activeIndex === cell.index"
          />
        </div>
      </div>
    </div>
  </div>
</template>
