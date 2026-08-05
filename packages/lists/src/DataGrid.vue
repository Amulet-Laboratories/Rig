<script setup lang="ts">
// DataGrid — the library's datatable.
//
// It was a sortable div-grid with keyboard navigation and nothing else, which
// meant every consumer hand-rolled the rest. Obelisk's media table wrote thirty
// lines of filter predicate and a four-`Select` header to get what a datatable
// is supposed to come with; three of those columns declared `width` and
// `resizable` and neither did anything (see the two bugs below). Filtering,
// paging, selection, column visibility and resizing now live here so that a
// consumer describes its columns and stops writing table machinery.
//
// Two long-standing bugs are fixed in passing:
//
//   1. `resizable` was declared on DataGridColumn and read by nothing.
//   2. `width` was applied as `width: Npx` on a flex item whose CSS sets
//      `flex: 1 1 0%`. Flex-basis wins over width, so every column rendered
//      equal-width no matter what was declared. Widths now emit an explicit
//      `flex: 0 0 Npx`.
//
// Everything added is opt-in. `<DataGrid :columns :rows />` renders exactly what
// it rendered before, and `sort` / `row-click` keep their old signatures.
//
// Structure: the root is a shell (toolbar / scroller / footer) and `role="grid"`
// sits on the scroller. A grid may only contain rows and rowgroups, so a toolbar
// or a pagination nav cannot live inside it. The keydown handler stays on the
// root — keystrokes bubble, and it keeps the grid navigable no matter which
// chrome has focus.

import { ref, computed, watch, nextTick, useSlots } from 'vue'
import type { SortState } from '@core/types'
import { useVirtualList, useDataTable } from '@core/composables'
import type { DataTableValueType } from '@core/composables'
import Pagination from '@core/primitives/Pagination.vue'

/** How a column's values compare and align. Text is the default.
 *  Re-exported from the shared pipeline so `DataGridColumn` stays self-describing. */
export type DataGridValueType = DataTableValueType

export type DataGridDensity = 'compact' | 'default' | 'comfortable'

export interface DataGridColumn {
  key: string
  label: string
  /** Fixed width in px. Emits `flex: 0 0 Npx` — the column stops growing. */
  width?: number
  /** Floor for interactive resizing. Defaults to 48. */
  minWidth?: number
  sortable?: boolean
  /** Drag the trailing edge to resize. Needs no `width` to start. */
  resizable?: boolean
  /** Offer this column in the column picker. */
  hideable?: boolean
  /** Defaults to `right` for `type: 'number'`, otherwise `left`. */
  align?: 'left' | 'center' | 'right'
  /** Picks the comparator: numeric, chronological, or natural-string. */
  type?: DataGridValueType
  /** Render a filter control in this column's header. */
  filter?: 'text' | 'select'
  /**
   * The value to sort, filter and search on. Set it when the cell slot renders
   * something other than the raw field — sorting the underlying key while the
   * screen shows something else is the classic datatable lie.
   */
  accessor?: (row: Record<string, unknown>) => unknown
}

const props = withDefaults(
  defineProps<{
    /** Column definitions */
    columns?: DataGridColumn[]
    /** Row data */
    rows?: Record<string, unknown>[]
    /** Accessible label for the grid — use to distinguish multiple grids on the same page */
    ariaLabel?: string
    /** Render the built-in search box in the toolbar */
    searchable?: boolean
    /** Render the column picker in the toolbar. Only `hideable` columns appear. */
    columnPicker?: boolean
    /** Render each column's `filter` control inside its header cell */
    filterable?: boolean
    /** Leading checkbox column. Selected keys ride on `v-model:selection`. */
    selectable?: boolean
    /** Row identity for selection — a field name or a function. Falls back to `id`. */
    rowKey?: string | ((row: Record<string, unknown>) => unknown)
    /** Rows per page. Unset means no paging. Ignored when `virtual` is set. */
    pageSize?: number
    /** Row padding. */
    density?: DataGridDensity
    /** Pin the header while the body scrolls. */
    stickyHeader?: boolean
    /** Window the rows for very large sets. Mutually exclusive with `pageSize`. */
    virtual?: boolean
    /** Row height in px — required for virtual scroll maths. */
    rowHeight?: number
    /** Caps the scroller so virtual mode and `stickyHeader` have something to scroll. */
    maxHeight?: string
  }>(),
  {
    columns: () => [],
    rows: () => [],
    ariaLabel: 'Data grid',
    searchable: false,
    columnPicker: false,
    filterable: false,
    selectable: false,
    density: 'default',
    stickyHeader: false,
    virtual: false,
    rowHeight: 33,
  },
)

const emit = defineEmits<{
  sort: [column: string, direction: 'asc' | 'desc']
  'row-click': [row: Record<string, unknown>, index: number]
}>()

defineSlots<Record<string, (props: Record<string, unknown>) => unknown>>()

// Every model is uncontrolled unless the consumer binds it — `defineModel`
// keeps local state when no `v-model` arrives, so the grid is useful with no
// wiring at all and fully controllable when a consumer wants to persist view
// state.
const sort = defineModel<SortState | null>('sort', { default: null })
const search = defineModel<string>('search', { default: '' })
const filters = defineModel<Record<string, string>>('filters', { default: () => ({}) })
const selection = defineModel<unknown[]>('selection', { default: () => [] })
const hiddenColumns = defineModel<string[]>('hiddenColumns', { default: () => [] })
const page = defineModel<number>('page', { default: 1 })

const slots = useSlots()

const gridRef = ref<HTMLElement | null>(null)
const focusedRow = ref(0)
const focusedCol = ref(0)

// ── Columns ─────────────────────────────────────────────────────────────────

const visibleColumns = computed(() =>
  props.columns.filter((c) => !hiddenColumns.value.includes(c.key)),
)

const hideableColumns = computed(() => props.columns.filter((c) => c.hideable))

function isHidden(key: string) {
  return hiddenColumns.value.includes(key)
}

function toggleColumn(key: string) {
  hiddenColumns.value = isHidden(key)
    ? hiddenColumns.value.filter((k) => k !== key)
    : [...hiddenColumns.value, key]
}

function alignOf(col: DataGridColumn) {
  return col.align ?? (col.type === 'number' ? 'right' : undefined)
}

/** Interactive resize overrides the declared width for the session. */
const resizedWidths = ref<Record<string, number>>({})

function widthOf(col: DataGridColumn): number | undefined {
  return resizedWidths.value[col.key] ?? col.width
}

function colStyle(col: DataGridColumn) {
  const w = widthOf(col)
  if (!w) return undefined
  // `flex: 0 0 Npx` is the part that actually sizes the column — a bare
  // `width` loses to the stylesheet's `flex-basis: 0%`.
  return { flex: `0 0 ${w}px`, width: `${w}px` }
}

// ── Filter → sort → page ────────────────────────────────────────────────────

// The pipeline itself lives in `useDataTable`, shared with every other
// tabular renderer. This component owns the markup and the keyboard grid; it
// does not own a second copy of "how a datatable narrows and orders rows".
const paged = computed(() => !!props.pageSize && !props.virtual)

/** `rowKey` accepts a field name as well as a function; the composable takes
 *  only a function, so the string form is resolved here. */
function keyOfRow(row: Record<string, unknown>): unknown {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  if (props.rowKey) return row[props.rowKey]
  return row.id
}

const table = useDataTable({
  rows: () => props.rows,
  columns: () => props.columns,
  // Global search spans the visible columns only — matching a column the user
  // has hidden returns rows with no visible reason for being there.
  searchableColumns: () => visibleColumns.value,
  pageSize: () => (paged.value ? props.pageSize : undefined),
  state: { sort, search, filters, selection, page },
  rowKey: keyOfRow,
})

const {
  sorted: sortedRows,
  paged: pageRows,
  pageCount,
  pageOffset,
  hasActiveFilters,
  allSelected,
  someSelected,
  filterOptions,
  setFilter,
  clearFilters,
  isSelected,
  toggleRow,
  toggleAll,
} = table

watch([() => sortedRows.value.length, pageCount], table.clampPage)

// ── Virtual rendering ───────────────────────────────────────────────────────

// Called unconditionally — the composable registers lifecycle hooks, and an
// empty source is how it is switched off without breaking call order.
const { containerRef, virtualState } = useVirtualList(() => (props.virtual ? pageRows.value : []), {
  itemHeight: props.rowHeight,
})

const renderedRows = computed(() =>
  props.virtual
    ? virtualState.value.items.map(({ item, index }) => ({ row: item, index }))
    : pageRows.value.map((row, index) => ({ row, index })),
)

const padTop = computed(() => (props.virtual ? virtualState.value.paddingTop : 0))
const padBottom = computed(() => (props.virtual ? virtualState.value.paddingBottom : 0))

// ── Sorting ─────────────────────────────────────────────────────────────────

function toggleSort(col: DataGridColumn) {
  if (!col.sortable) return
  const next = table.toggleSort(col.key)
  emit('sort', next.column, next.direction)
}

function sortIndicator(col: DataGridColumn): string {
  if (sort.value?.column !== col.key) return '⋅'
  return sort.value.direction === 'asc' ? '▲' : '▼'
}

function ariaSort(col: DataGridColumn): 'ascending' | 'descending' | undefined {
  if (sort.value?.column !== col.key) return undefined
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

// ── Resizing ────────────────────────────────────────────────────────────────

const resizing = ref<string | null>(null)

function startResize(e: PointerEvent, col: DataGridColumn) {
  // The handle sits inside the header cell, which sorts on click.
  e.stopPropagation()
  e.preventDefault()
  const handle = e.currentTarget as HTMLElement
  const cell = handle.parentElement
  const startX = e.clientX
  const startWidth = widthOf(col) ?? cell?.getBoundingClientRect().width ?? 120
  const floor = col.minWidth ?? 48
  resizing.value = col.key
  handle.setPointerCapture(e.pointerId)

  function onMove(ev: PointerEvent) {
    resizedWidths.value = {
      ...resizedWidths.value,
      [col.key]: Math.max(floor, startWidth + ev.clientX - startX),
    }
  }
  function onUp(ev: PointerEvent) {
    resizing.value = null
    handle.releasePointerCapture(ev.pointerId)
    handle.removeEventListener('pointermove', onMove)
    handle.removeEventListener('pointerup', onUp)
  }
  handle.addEventListener('pointermove', onMove)
  handle.addEventListener('pointerup', onUp)
}

// ── Keyboard ────────────────────────────────────────────────────────────────

function focusCell(row: number, col: number) {
  focusedRow.value = row
  focusedCol.value = col
  nextTick(() => {
    const target = gridRef.value?.querySelector<HTMLElement>(
      `[data-rig-grid-row="${row}"] [data-rig-grid-col="${col}"], [data-rig-grid-header-row] [data-rig-grid-col="${col}"]`,
    )
    target?.focus()
  })
}

// In virtual mode the target row may not be mounted yet, so scroll it into the
// window first and let the scroll handler re-render before focusing.
watch(focusedRow, async (idx) => {
  if (!props.virtual || !containerRef.value) return
  const el = containerRef.value
  const top = (idx - pageOffset.value) * props.rowHeight
  const bottom = top + props.rowHeight
  if (top < el.scrollTop) el.scrollTop = top
  else if (bottom > el.scrollTop + el.clientHeight) el.scrollTop = bottom - el.clientHeight
  await nextTick()
})

function onGridKeydown(e: KeyboardEvent) {
  const rowCount = sortedRows.value.length
  const colCount = visibleColumns.value.length
  if (!rowCount || !colCount) return

  // focusedRow -1 means header row
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      if (focusedCol.value < colCount - 1) focusCell(focusedRow.value, focusedCol.value + 1)
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (focusedCol.value > 0) focusCell(focusedRow.value, focusedCol.value - 1)
      break
    case 'ArrowDown':
      e.preventDefault()
      if (focusedRow.value < rowCount - 1) focusCell(focusedRow.value + 1, focusedCol.value)
      break
    case 'ArrowUp':
      e.preventDefault()
      if (focusedRow.value > 0) focusCell(focusedRow.value - 1, focusedCol.value)
      break
    case 'Home':
      e.preventDefault()
      focusCell(focusedRow.value, 0)
      break
    case 'End':
      e.preventDefault()
      focusCell(focusedRow.value, colCount - 1)
      break
    case 'Enter':
    case ' ':
      if (focusedRow.value >= 0 && focusedRow.value < rowCount) {
        e.preventDefault()
        const row = sortedRows.value[focusedRow.value]!
        // Space is the checkbox key once there are checkboxes; without
        // selection it stays an alias for Enter, as it always was.
        if (e.key === ' ' && props.selectable) toggleRow(row)
        else emit('row-click', row, focusedRow.value)
      }
      break
  }
}

const showToolbar = computed(
  () =>
    props.searchable || (props.columnPicker && hideableColumns.value.length > 0) || !!slots.toolbar,
)
const showFooter = computed(() => paged.value || !!slots.footer)
</script>

<template>
  <div
    ref="gridRef"
    data-rig-data-grid
    :data-density="density !== 'default' ? density : undefined"
    :data-sticky="stickyHeader || undefined"
    :data-resizing="resizing || undefined"
    @keydown="onGridKeydown"
  >
    <div v-if="showToolbar" data-rig-data-grid-toolbar>
      <slot
        name="toolbar"
        :filtered="sortedRows.length"
        :total="rows.length"
        :selection="selection"
        :clear="clearFilters"
      />

      <input
        v-if="searchable"
        data-rig-data-grid-search
        type="search"
        :value="search"
        placeholder="Search…"
        :aria-label="`Search ${ariaLabel}`"
        @input="search = ($event.target as HTMLInputElement).value"
      />

      <details v-if="columnPicker && hideableColumns.length" data-rig-data-grid-columns>
        <summary data-rig-data-grid-columns-toggle>Columns</summary>
        <div data-rig-data-grid-columns-menu role="group" aria-label="Toggle columns">
          <label v-for="col in hideableColumns" :key="col.key" data-rig-data-grid-columns-item>
            <input type="checkbox" :checked="!isHidden(col.key)" @change="toggleColumn(col.key)" />
            {{ col.label }}
          </label>
        </div>
      </details>

      <button v-if="hasActiveFilters" type="button" data-rig-data-grid-clear @click="clearFilters">
        Clear
      </button>
    </div>

    <div
      ref="containerRef"
      data-rig-data-grid-scroll
      role="grid"
      :aria-label="ariaLabel"
      :aria-rowcount="sortedRows.length + 1"
      :aria-colcount="visibleColumns.length + (selectable ? 1 : 0)"
      :style="maxHeight ? { maxHeight } : undefined"
    >
      <div data-rig-data-grid-header data-rig-grid-header-row role="row">
        <div
          v-if="selectable"
          data-rig-data-grid-header-cell
          data-rig-data-grid-select-cell
          role="columnheader"
          :aria-colindex="1"
        >
          <input
            type="checkbox"
            :checked="allSelected"
            :indeterminate="someSelected"
            aria-label="Select all rows"
            @change="toggleAll"
          />
        </div>
        <div
          v-for="(col, ci) in visibleColumns"
          :key="col.key"
          data-rig-data-grid-header-cell
          :data-rig-grid-col="ci"
          role="columnheader"
          :aria-colindex="ci + 1 + (selectable ? 1 : 0)"
          :aria-sort="ariaSort(col)"
          :data-sortable="col.sortable || undefined"
          :data-sorted="sort?.column === col.key ? sort.direction : undefined"
          :data-align="alignOf(col)"
          :style="colStyle(col)"
          :tabindex="col.sortable ? 0 : -1"
          @click="toggleSort(col)"
          @keydown.enter="toggleSort(col)"
          @keydown.space.prevent="toggleSort(col)"
        >
          <span data-rig-data-grid-header-label>
            <span>{{ col.label }}</span>
            <span v-if="col.sortable" data-rig-data-grid-sort-indicator aria-hidden="true">
              {{ sortIndicator(col) }}
            </span>
          </span>

          <!-- Filters live inside the header cell rather than in a row of their
               own: a second row of `columnheader`s for the same columns is a
               lie to a screen reader, and this way they stay aligned for free. -->
          <select
            v-if="filterable && col.filter === 'select'"
            data-rig-data-grid-filter
            :value="filters[col.key] ?? ''"
            :aria-label="`Filter by ${col.label}`"
            @click.stop
            @keydown.stop
            @change="setFilter(col.key, ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All</option>
            <option v-for="opt in filterOptions(col)" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <input
            v-else-if="filterable && col.filter === 'text'"
            data-rig-data-grid-filter
            type="text"
            :value="filters[col.key] ?? ''"
            :placeholder="`Filter ${col.label.toLowerCase()}…`"
            :aria-label="`Filter by ${col.label}`"
            @click.stop
            @keydown.stop
            @input="setFilter(col.key, ($event.target as HTMLInputElement).value)"
          />

          <span
            v-if="col.resizable"
            data-rig-data-grid-resize-handle
            role="separator"
            aria-orientation="vertical"
            :aria-label="`Resize ${col.label}`"
            @pointerdown="startResize($event, col)"
            @click.stop
          />
        </div>
      </div>

      <div v-if="sortedRows.length === 0" data-rig-data-grid-empty role="row">
        <div role="gridcell" :aria-colspan="visibleColumns.length">
          <slot name="empty">No data</slot>
        </div>
      </div>
      <div
        v-else
        data-rig-data-grid-body
        role="rowgroup"
        :style="
          padTop || padBottom
            ? { paddingTop: `${padTop}px`, paddingBottom: `${padBottom}px` }
            : undefined
        "
      >
        <div
          v-for="{ row, index } in renderedRows"
          :key="index"
          data-rig-data-grid-row
          :data-rig-grid-row="index + pageOffset"
          :data-selected="selectable && isSelected(row) ? '' : undefined"
          role="row"
          :aria-rowindex="index + pageOffset + 2"
          :aria-selected="selectable ? isSelected(row) : undefined"
          :tabindex="focusedRow === index + pageOffset ? 0 : -1"
          :style="virtual ? { height: `${rowHeight}px` } : undefined"
          @click="emit('row-click', row, index + pageOffset)"
          @keydown.enter="emit('row-click', row, index + pageOffset)"
          @focus="focusedRow = index + pageOffset"
        >
          <div
            v-if="selectable"
            data-rig-data-grid-cell
            data-rig-data-grid-select-cell
            role="gridcell"
            :aria-colindex="1"
            @click.stop
          >
            <input
              type="checkbox"
              :checked="isSelected(row)"
              :aria-label="`Select row ${index + pageOffset + 1}`"
              @change="toggleRow(row)"
            />
          </div>
          <div
            v-for="(col, ci) in visibleColumns"
            :key="col.key"
            data-rig-data-grid-cell
            :data-rig-grid-col="ci"
            role="gridcell"
            :aria-colindex="ci + 1 + (selectable ? 1 : 0)"
            :data-align="alignOf(col)"
            :style="colStyle(col)"
          >
            <slot :name="col.key" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFooter" data-rig-data-grid-footer>
      <slot name="footer" :filtered="sortedRows.length" :total="rows.length">
        <span data-rig-data-grid-count>
          {{ sortedRows.length }}{{ sortedRows.length === rows.length ? '' : ` of ${rows.length}` }}
        </span>
      </slot>
      <Pagination
        v-if="paged && pageCount > 1"
        v-model="page"
        :total="sortedRows.length"
        :page-size="pageSize"
      />
    </div>
  </div>
</template>
