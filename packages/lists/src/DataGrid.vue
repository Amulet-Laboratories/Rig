<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

export interface DataGridColumn {
  key: string
  label: string
  width?: number
  sortable?: boolean
  resizable?: boolean
}

const props = withDefaults(
  defineProps<{
    /** Column definitions */
    columns?: DataGridColumn[]
    /** Row data */
    rows?: Record<string, unknown>[]
  }>(),
  {
    columns: () => [],
    rows: () => [],
  },
)

const emit = defineEmits<{
  sort: [column: string, direction: 'asc' | 'desc']
  'row-click': [row: Record<string, unknown>, index: number]
}>()

// Dynamic column slots (`:name="col.key"`) + an `empty` slot with different
// prop shapes make defineSlots impractical here — column slot names are only
// known at runtime.  Consumers get per-slot typing via template `#col-key` etc.

const sortColumn = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const focusedRow = ref(0)
const focusedCol = ref(0)

/**
 * Sorted rows — reactive computed that re-sorts when sort column/direction or
 * source rows change. Uses localeCompare with numeric collation for natural
 * string ordering. O(n log n) per sort change; fine for typical grid sizes
 * (<10k rows). For very large datasets, consider pre-sorting on the server
 * or integrating with useVirtualList for windowed rendering.
 */
const sortedRows = computed(() => {
  if (!sortColumn.value) return props.rows
  const col = sortColumn.value
  const dir = sortDirection.value
  return [...props.rows].sort((a, b) => {
    const aVal = String(a[col] ?? '')
    const bVal = String(b[col] ?? '')
    const cmp = aVal.localeCompare(bVal, undefined, { numeric: true })
    return dir === 'asc' ? cmp : -cmp
  })
})

function toggleSort(col: DataGridColumn) {
  if (!col.sortable) return
  if (sortColumn.value === col.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = col.key
    sortDirection.value = 'asc'
  }
}

function focusCell(row: number, col: number) {
  focusedRow.value = row
  focusedCol.value = col
  nextTick(() => {
    const grid = document.querySelector('[data-rig-data-grid]')
    const target = grid?.querySelector<HTMLElement>(
      `[data-rig-grid-row="${row}"] [data-rig-grid-col="${col}"], [data-rig-grid-header-row] [data-rig-grid-col="${col}"]`,
    )
    target?.focus()
  })
}

function onGridKeydown(e: KeyboardEvent) {
  const rowCount = sortedRows.value.length
  const colCount = props.columns.length
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
        emit('row-click', sortedRows.value[focusedRow.value]!, focusedRow.value)
      }
      break
  }
}
</script>

<template>
  <div
    data-rig-data-grid
    role="grid"
    aria-label="Data grid"
    :aria-rowcount="sortedRows.length + 1"
    :aria-colcount="columns.length"
    @keydown="onGridKeydown"
  >
    <div data-rig-data-grid-header data-rig-grid-header-row role="row">
      <div
        v-for="(col, ci) in columns"
        :key="col.key"
        data-rig-data-grid-header-cell
        :data-rig-grid-col="ci"
        role="columnheader"
        :aria-sort="
          sortColumn === col.key
            ? sortDirection === 'asc'
              ? 'ascending'
              : 'descending'
            : undefined
        "
        :data-sortable="col.sortable || undefined"
        :data-sorted="sortColumn === col.key ? sortDirection : undefined"
        :style="col.width ? { width: `${col.width}px` } : undefined"
        :tabindex="col.sortable ? 0 : -1"
        @click="toggleSort(col)"
        @keydown.enter="toggleSort(col)"
        @keydown.space.prevent="toggleSort(col)"
      >
        <span>{{ col.label }}</span>
        <span v-if="col.sortable" data-rig-data-grid-sort-indicator aria-hidden="true">
          {{ sortColumn === col.key ? (sortDirection === 'asc' ? '▲' : '▼') : '⋅' }}
        </span>
      </div>
    </div>
    <div v-if="sortedRows.length === 0" data-rig-data-grid-empty role="row">
      <div role="gridcell" :aria-colspan="columns.length">
        <slot name="empty">No data</slot>
      </div>
    </div>
    <div v-else data-rig-data-grid-body role="rowgroup">
      <div
        v-for="(row, i) in sortedRows"
        :key="i"
        data-rig-data-grid-row
        :data-rig-grid-row="i"
        role="row"
        :aria-rowindex="i + 2"
        :tabindex="focusedRow === i ? 0 : -1"
        @click="emit('row-click', row, i)"
        @keydown.enter="emit('row-click', row, i)"
        @focus="focusedRow = i"
      >
        <div
          v-for="(col, ci) in columns"
          :key="col.key"
          data-rig-data-grid-cell
          :data-rig-grid-col="ci"
          role="gridcell"
          :style="col.width ? { width: `${col.width}px` } : undefined"
        >
          <slot :name="col.key" :value="row[col.key]" :row="row">
            {{ row[col.key] }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
