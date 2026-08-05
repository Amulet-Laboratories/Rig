import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { SortState } from '../types'

/**
 * The filter → sort → page → select pipeline behind a datatable, with no
 * opinion about how the rows are drawn.
 *
 * It exists because the library has two renderers for tabular data and they
 * are not interchangeable. `Table` is a semantic `<table>`, so the browser's
 * table layout sizes each column to its content; `DataGrid` is a div grid with
 * `role="grid"` and roving-cell keyboard navigation, so its columns are flex
 * and a column without a declared width shares the space equally. Dense,
 * read-mostly data wants the first; an interactive cell-navigable surface
 * wants the second. Neither is a strict upgrade, which is why picking one and
 * deleting the other was the wrong instinct — the duplication worth removing
 * is the *logic*, not the markup, and this is the logic.
 *
 * State is passed in rather than owned so a component using `defineModel` can
 * hand over its models and stay fully controllable, while a plainer consumer
 * can hand over `ref()`s and never think about it.
 */

/** How a column's values compare. Text is the default. */
export type DataTableValueType = 'text' | 'number' | 'date'

export interface DataTableColumnSpec {
  key: string
  type?: DataTableValueType
  filter?: 'text' | 'select'
  /** The value to sort, filter and search on — set it when the cell renders
   *  something other than the raw field. */
  accessor?: (row: Record<string, unknown>) => unknown
}

/**
 * Anything with a readable, writable `.value` — a `ref`, a writable `computed`,
 * or a `defineModel`.
 *
 * Deliberately not Vue's `Ref`. `Ref` carries a `unique symbol` brand, so it is
 * nominal: a consumer that resolves its own copy of `@vue/reactivity` gets a
 * structurally identical but *unassignable* type, and this library is consumed
 * that way — Obelisk aliases rig's source and pins a different patch of Vue,
 * which makes every ref handed across the boundary a type error. A structural
 * shape costs nothing here (the pipeline only ever reads and writes `.value`)
 * and keeps the API usable regardless of which Vue the consumer resolved.
 */
export interface WritableRef<T> {
  value: T
}

export interface DataTableState {
  sort: WritableRef<SortState | null>
  search: WritableRef<string>
  filters: WritableRef<Record<string, string>>
  selection: WritableRef<unknown[]>
  page: WritableRef<number>
}

export interface UseDataTableOptions {
  rows: () => Record<string, unknown>[]
  columns: () => DataTableColumnSpec[]
  state: DataTableState
  /** Columns the global search may match. Defaults to every column — pass a
   *  narrower set to keep search from hitting a column the user has hidden. */
  searchableColumns?: () => DataTableColumnSpec[]
  /** Rows per page. Unset means no paging. */
  pageSize?: () => number | undefined
  /** Row identity for selection. Defaults to the row's `id`. */
  rowKey?: (row: Record<string, unknown>) => unknown
}

export interface UseDataTableReturn {
  filtered: ComputedRef<Record<string, unknown>[]>
  sorted: ComputedRef<Record<string, unknown>[]>
  paged: ComputedRef<Record<string, unknown>[]>
  pageCount: ComputedRef<number>
  /** Offset of the rendered slice within the full sorted set, so a click can
   *  report the row's real index rather than its position on the page. */
  pageOffset: ComputedRef<number>
  hasActiveFilters: ComputedRef<boolean>
  allSelected: ComputedRef<boolean>
  someSelected: ComputedRef<boolean>
  valueOf: (row: Record<string, unknown>, column: DataTableColumnSpec) => unknown
  filterOptions: (column: DataTableColumnSpec) => string[]
  setFilter: (key: string, value: string) => void
  clearFilters: () => void
  toggleSort: (key: string) => SortState
  keyOf: (row: Record<string, unknown>) => unknown
  isSelected: (row: Record<string, unknown>) => boolean
  toggleRow: (row: Record<string, unknown>) => void
  toggleAll: () => void
  clampPage: () => void
}

function isBlank(v: unknown): boolean {
  return v === null || v === undefined || v === ''
}

/**
 * Compare two non-blank values. An explicit `type` picks the comparator; with
 * none, two real numbers still compare numerically — otherwise `-2` sorts
 * after `10` and a caller who never declared a type gets a silently wrong
 * order. Everything else falls back to natural-string collation.
 */
export function compareValues(a: unknown, b: unknown, type?: DataTableValueType): number {
  if (type === 'number') {
    const an = Number(a)
    const bn = Number(b)
    if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn
  } else if (type === 'date') {
    const at = Date.parse(String(a))
    const bt = Date.parse(String(b))
    if (!Number.isNaN(at) && !Number.isNaN(bt)) return at - bt
  } else if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

export function useDataTable(options: UseDataTableOptions): UseDataTableReturn {
  const { rows, columns, state, searchableColumns, pageSize, rowKey } = options
  const { sort, search, filters, selection, page } = state

  function valueOf(row: Record<string, unknown>, column: DataTableColumnSpec): unknown {
    return column.accessor ? column.accessor(row) : row[column.key]
  }

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    const active = Object.entries(filters.value).filter(([, v]) => v !== '' && v != null)
    if (!q && active.length === 0) return rows()

    const cols = columns()
    const searchable = searchableColumns ? searchableColumns() : cols

    return rows().filter((row) => {
      for (const [key, want] of active) {
        const col = cols.find((c) => c.key === key)
        if (!col) continue
        const got = valueOf(row, col)
        if (col.filter === 'select') {
          // Select filters are exact — the option came from the data, so a
          // substring match would silently include neighbours.
          if (String(got ?? '') !== want) return false
        } else if (
          !String(got ?? '')
            .toLowerCase()
            .includes(want.toLowerCase())
        ) {
          return false
        }
      }
      if (
        q &&
        !searchable.some((c) =>
          String(valueOf(row, c) ?? '')
            .toLowerCase()
            .includes(q),
        )
      ) {
        return false
      }
      return true
    })
  })

  const sorted = computed(() => {
    const s = sort.value
    if (!s) return filtered.value
    const col = columns().find((c) => c.key === s.column)
    if (!col) return filtered.value
    const dir = s.direction

    // Copy before sorting — `rows` is very often a store getter, and sorting
    // it in place would mutate the store from a render pass.
    return [...filtered.value].sort((a, b) => {
      const av = valueOf(a, col)
      const bv = valueOf(b, col)
      const ab = isBlank(av)
      const bb = isBlank(bv)
      // Blanks last in *both* directions, which is why these return before the
      // direction flip: a missing figure is not a small figure, and reversing
      // a sort should not bury the populated rows under a wall of em-dashes.
      if (ab && bb) return 0
      if (ab) return 1
      if (bb) return -1
      const cmp = compareValues(av, bv, col.type)
      return dir === 'asc' ? cmp : -cmp
    })
  })

  const size = computed(() => pageSize?.())
  const pageCount = computed(() =>
    size.value ? Math.max(1, Math.ceil(sorted.value.length / size.value)) : 1,
  )
  const pageOffset = computed(() => (size.value ? (page.value - 1) * size.value : 0))

  const paged = computed(() => {
    if (!size.value) return sorted.value
    return sorted.value.slice(pageOffset.value, pageOffset.value + size.value)
  })

  /** A filter that shortens the list past the current page would otherwise
   *  strand the view on an empty page with no way back. */
  function clampPage() {
    if (page.value > pageCount.value) page.value = pageCount.value
  }

  function filterOptions(column: DataTableColumnSpec): string[] {
    const seen = new Set<string>()
    for (const row of rows()) {
      const v = valueOf(row, column)
      if (!isBlank(v)) seen.add(String(v))
    }
    return [...seen].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }

  const hasActiveFilters = computed(
    () => search.value !== '' || Object.values(filters.value).some((v) => v !== '' && v != null),
  )

  function setFilter(key: string, value: string) {
    filters.value = { ...filters.value, [key]: value }
  }

  function clearFilters() {
    search.value = ''
    filters.value = {}
  }

  function toggleSort(key: string): SortState {
    const next: SortState =
      sort.value?.column === key
        ? { column: key, direction: sort.value.direction === 'asc' ? 'desc' : 'asc' }
        : { column: key, direction: 'asc' }
    sort.value = next
    return next
  }

  function keyOf(row: Record<string, unknown>): unknown {
    return rowKey ? rowKey(row) : row.id
  }

  function isSelected(row: Record<string, unknown>): boolean {
    return selection.value.includes(keyOf(row))
  }

  function toggleRow(row: Record<string, unknown>) {
    const k = keyOf(row)
    selection.value = selection.value.includes(k)
      ? selection.value.filter((s) => s !== k)
      : [...selection.value, k]
  }

  // Select-all acts on what is filtered, not on every row loaded: clearing a
  // filter should not silently widen a selection made while narrowed.
  const allSelected = computed(
    () => sorted.value.length > 0 && sorted.value.every((r) => isSelected(r)),
  )
  const someSelected = computed(() => !allSelected.value && sorted.value.some((r) => isSelected(r)))

  function toggleAll() {
    if (allSelected.value) {
      const drop = new Set(sorted.value.map(keyOf))
      selection.value = selection.value.filter((k) => !drop.has(k))
    } else {
      const add = sorted.value.map(keyOf).filter((k) => !selection.value.includes(k))
      selection.value = [...selection.value, ...add]
    }
  }

  return {
    filtered,
    sorted,
    paged,
    pageCount,
    pageOffset,
    hasActiveFilters,
    allSelected,
    someSelected,
    valueOf,
    filterOptions,
    setFilter,
    clearFilters,
    toggleSort,
    keyOf,
    isSelected,
    toggleRow,
    toggleAll,
    clampPage,
  }
}
