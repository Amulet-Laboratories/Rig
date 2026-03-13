<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { ColumnDef, SortState } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Column definitions */
    columns: ColumnDef[]
    /** Row data */
    rows: T[]
    /** Current sort state */
    sort?: SortState
    /** Function or key to extract a unique row ID */
    rowKey: keyof T | ((row: T) => string)
    /** Whether columns can be resized */
    resizableColumns?: boolean
  }>(),
  {
    resizableColumns: false,
  },
)

const emit = defineEmits<{
  'update:sort': [sort: SortState]
  rowClick: [row: T]
  rowDblclick: [row: T]
  cellClick: [payload: { row: T; column: ColumnDef }]
}>()

function getRowId(row: T): string {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  return String(row[props.rowKey])
}

function toggleSort(col: ColumnDef) {
  if (!col.sortable) return

  if (props.sort?.column === col.id) {
    const newDir = props.sort.direction === 'asc' ? 'desc' : 'asc'
    emit('update:sort', { column: col.id, direction: newDir })
  } else {
    emit('update:sort', { column: col.id, direction: 'asc' })
  }
}

function onHeaderKeydown(e: KeyboardEvent, col: ColumnDef) {
  if (!col.sortable) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggleSort(col)
  }
}

function ariaSortValue(col: ColumnDef): 'none' | 'ascending' | 'descending' | 'other' | undefined {
  if (!col.sortable) return undefined
  if (props.sort?.column !== col.id) return 'none'
  return props.sort.direction === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <table data-rig-table>
    <thead data-rig-table-head>
      <tr>
        <th
          v-for="col in columns"
          :key="col.id"
          data-rig-table-header
          :data-sortable="col.sortable || undefined"
          :data-sort-direction="sort?.column === col.id ? sort?.direction : undefined"
          :data-align="col.align"
          :aria-sort="ariaSortValue(col)"
          :tabindex="col.sortable ? 0 : undefined"
          :role="col.sortable ? 'columnheader' : undefined"
          :style="
            col.width
              ? { width: col.width + 'px', minWidth: (col.minWidth ?? col.width) + 'px' }
              : undefined
          "
          @click="toggleSort(col)"
          @keydown="onHeaderKeydown($event, col)"
        >
          <slot :name="`header-${col.id}`" :column="col">
            {{ col.label }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody data-rig-table-body>
      <tr
        v-for="row in rows"
        :key="getRowId(row)"
        data-rig-table-row
        @click="emit('rowClick', row)"
        @dblclick="emit('rowDblclick', row)"
      >
        <td
          v-for="col in columns"
          :key="col.id"
          data-rig-table-cell
          :data-align="col.align"
          @click.stop="emit('cellClick', { row, column: col })"
        >
          <slot :name="`cell-${col.id}`" :row="row" :column="col" :value="row[col.id as keyof T]">
            {{ row[col.id as keyof T] }}
          </slot>
        </td>
      </tr>
      <tr v-if="rows.length === 0">
        <td :colspan="columns.length" data-rig-table-empty>
          <slot name="empty">No data</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>
