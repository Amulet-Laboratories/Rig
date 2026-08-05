import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useDataTable, compareValues } from './useDataTable'
import type { DataTableColumnSpec, DataTableState } from './useDataTable'

function makeState(overrides: Partial<Record<keyof DataTableState, unknown>> = {}): DataTableState {
  return {
    sort: (overrides.sort as DataTableState['sort']) ?? ref(null),
    search: (overrides.search as DataTableState['search']) ?? ref(''),
    filters: (overrides.filters as DataTableState['filters']) ?? ref({}),
    selection: (overrides.selection as DataTableState['selection']) ?? ref([]),
    page: (overrides.page as DataTableState['page']) ?? ref(1),
  }
}

const COLUMNS: DataTableColumnSpec[] = [
  { key: 'name', filter: 'text' },
  { key: 'kind', filter: 'select' },
  { key: 'amount', type: 'number' },
  { key: 'due', type: 'date' },
]

const ROWS = [
  { id: 'a', name: 'alpha', kind: 'tool', amount: 100, due: '2026-03-01' },
  { id: 'b', name: 'beta', kind: 'site', amount: 9, due: '2025-12-31' },
  { id: 'c', name: 'gamma', kind: 'tool', amount: 20, due: null },
]

function setup(opts: Partial<Parameters<typeof useDataTable>[0]> = {}) {
  const state = (opts.state as DataTableState) ?? makeState()
  const table = useDataTable({
    rows: () => ROWS,
    columns: () => COLUMNS,
    state,
    ...opts,
  })
  return { table, state }
}

describe('compareValues', () => {
  it('compares real numbers numerically even with no declared type', () => {
    // Without this, an untyped column runs String().localeCompare and -2 sorts
    // after 10. Callers that never declared a type got a silently wrong order.
    expect(compareValues(-2, 10)).toBeLessThan(0)
    expect(compareValues(100, 9)).toBeGreaterThan(0)
  })

  it('honours an explicit numeric type over numeric strings', () => {
    expect(compareValues('9', '100', 'number')).toBeLessThan(0)
  })

  it('compares dates chronologically', () => {
    expect(compareValues('2026-03-01', '2025-12-31', 'date')).toBeGreaterThan(0)
  })

  it('falls back to natural-string collation for unparseable values', () => {
    expect(compareValues('item2', 'item10', 'date')).toBeLessThan(0)
  })
})

describe('useDataTable sorting', () => {
  it('leaves rows untouched with no sort state', () => {
    const { table } = setup()
    expect(table.sorted.value).toEqual(ROWS)
  })

  it('sorts numerically and reverses', () => {
    const state = makeState()
    const { table } = setup({ state })
    state.sort.value = { column: 'amount', direction: 'asc' }
    expect(table.sorted.value.map((r) => r.amount)).toEqual([9, 20, 100])
    state.sort.value = { column: 'amount', direction: 'desc' }
    expect(table.sorted.value.map((r) => r.amount)).toEqual([100, 20, 9])
  })

  it('keeps blanks last in both directions', () => {
    const state = makeState()
    const { table } = setup({ state })
    state.sort.value = { column: 'due', direction: 'asc' }
    expect(table.sorted.value.map((r) => r.id)).toEqual(['b', 'a', 'c'])
    state.sort.value = { column: 'due', direction: 'desc' }
    expect(table.sorted.value.map((r) => r.id)).toEqual(['a', 'b', 'c'])
  })

  it('does not sort the source array in place', () => {
    // `rows` is usually a store getter; sorting it would mutate the store
    // from a render pass.
    const state = makeState()
    const { table } = setup({ state })
    state.sort.value = { column: 'amount', direction: 'asc' }
    void table.sorted.value
    expect(ROWS.map((r) => r.id)).toEqual(['a', 'b', 'c'])
  })

  it('ignores a sort naming a column that does not exist', () => {
    const state = makeState()
    const { table } = setup({ state })
    state.sort.value = { column: 'nope', direction: 'asc' }
    expect(table.sorted.value).toEqual(ROWS)
  })

  it('toggleSort cycles asc → desc and resets to asc on a new column', () => {
    const state = makeState()
    const { table } = setup({ state })
    expect(table.toggleSort('amount')).toEqual({ column: 'amount', direction: 'asc' })
    expect(table.toggleSort('amount')).toEqual({ column: 'amount', direction: 'desc' })
    expect(table.toggleSort('name')).toEqual({ column: 'name', direction: 'asc' })
  })

  it('sorts on the accessor rather than the raw field', () => {
    const state = makeState({ sort: ref({ column: 'label', direction: 'asc' as const }) })
    const table = useDataTable({
      rows: () => [
        { label: 'low', rank: 3 },
        { label: 'high', rank: 1 },
        { label: 'medium', rank: 2 },
      ],
      columns: () => [{ key: 'label', type: 'number', accessor: (r) => r.rank }],
      state,
    })
    expect(table.sorted.value.map((r) => r.label)).toEqual(['high', 'medium', 'low'])
  })
})

describe('useDataTable filtering', () => {
  it('matches text filters as a substring and select filters exactly', () => {
    const state = makeState({ filters: ref({ name: 'mm' }) })
    const { table } = setup({ state })
    expect(table.filtered.value.map((r) => r.id)).toEqual(['c'])

    state.filters.value = { kind: 'tool' }
    expect(table.filtered.value.map((r) => r.id)).toEqual(['a', 'c'])
  })

  it('treats an empty filter value as no filter', () => {
    const { table } = setup({ state: makeState({ filters: ref({ kind: '' }) }) })
    expect(table.filtered.value).toHaveLength(3)
  })

  it('applies global search across every column by default', () => {
    const { table } = setup({ state: makeState({ search: ref('site') }) })
    expect(table.filtered.value.map((r) => r.id)).toEqual(['b'])
  })

  it('restricts search to searchableColumns when given', () => {
    const { table } = setup({
      state: makeState({ search: ref('site') }),
      searchableColumns: () => [COLUMNS[0]!],
    })
    expect(table.filtered.value).toHaveLength(0)
  })

  it('combines a column filter and a search with AND', () => {
    const { table } = setup({
      state: makeState({ filters: ref({ kind: 'tool' }), search: ref('alpha') }),
    })
    expect(table.filtered.value.map((r) => r.id)).toEqual(['a'])
  })

  it('lists distinct non-blank values as filter options, sorted', () => {
    const { table } = setup()
    expect(table.filterOptions(COLUMNS[1]!)).toEqual(['site', 'tool'])
    expect(table.filterOptions(COLUMNS[3]!)).toEqual(['2025-12-31', '2026-03-01'])
  })

  it('reports and clears active filters', () => {
    const state = makeState({ search: ref('x'), filters: ref({ kind: 'tool' }) })
    const { table } = setup({ state })
    expect(table.hasActiveFilters.value).toBe(true)
    table.clearFilters()
    expect(state.search.value).toBe('')
    expect(state.filters.value).toEqual({})
    expect(table.hasActiveFilters.value).toBe(false)
  })
})

describe('useDataTable paging', () => {
  const many = Array.from({ length: 25 }, (_, i) => ({ id: i, n: i + 1 }))

  function paged(pageRef = ref(1)) {
    const state = makeState({ page: pageRef })
    return {
      state,
      table: useDataTable({
        rows: () => many,
        columns: () => [{ key: 'n', type: 'number' }],
        state,
        pageSize: () => 10,
      }),
    }
  }

  it('slices to the page and reports the offset', () => {
    const { table } = paged(ref(3))
    expect(table.paged.value.map((r) => r.n)).toEqual([21, 22, 23, 24, 25])
    expect(table.pageOffset.value).toBe(20)
    expect(table.pageCount.value).toBe(3)
  })

  it('returns everything when no pageSize is given', () => {
    const { table } = setup()
    expect(table.paged.value).toHaveLength(3)
    expect(table.pageCount.value).toBe(1)
    expect(table.pageOffset.value).toBe(0)
  })

  it('clampPage pulls a stranded page back into range', () => {
    const page = ref(3)
    const { state, table } = paged(page)
    state.filters.value = {}
    table.clampPage()
    expect(page.value).toBe(3)

    // Narrow to one page worth of rows, then clamp.
    const narrow = useDataTable({
      rows: () => many.slice(0, 5),
      columns: () => [{ key: 'n', type: 'number' }],
      state,
      pageSize: () => 10,
    })
    narrow.clampPage()
    expect(page.value).toBe(1)
  })
})

describe('useDataTable selection', () => {
  it('toggles a row by its id', () => {
    const state = makeState()
    const { table } = setup({ state })
    table.toggleRow(ROWS[1]!)
    expect(state.selection.value).toEqual(['b'])
    table.toggleRow(ROWS[1]!)
    expect(state.selection.value).toEqual([])
  })

  it('uses a custom rowKey', () => {
    const state = makeState()
    const table = useDataTable({
      rows: () => ROWS,
      columns: () => COLUMNS,
      state,
      rowKey: (r) => r.name,
    })
    table.toggleRow(ROWS[0]!)
    expect(state.selection.value).toEqual(['alpha'])
  })

  it('select-all covers the filtered set only, and leaves the rest alone', () => {
    // Clearing a filter must not silently widen a selection made while narrowed.
    const state = makeState({ filters: ref({ kind: 'site' }) })
    const { table } = setup({ state })
    table.toggleAll()
    expect(state.selection.value).toEqual(['b'])

    state.filters.value = { kind: 'tool' }
    table.toggleAll()
    expect(state.selection.value).toEqual(['b', 'a', 'c'])
  })

  it('deselect-all removes only the filtered rows', () => {
    const state = makeState({ selection: ref(['a', 'b', 'c']), filters: ref({ kind: 'tool' }) })
    const { table } = setup({ state })
    expect(table.allSelected.value).toBe(true)
    table.toggleAll()
    expect(state.selection.value).toEqual(['b'])
  })

  it('reports a partial selection as indeterminate, not all', () => {
    const state = makeState({ selection: ref(['a']) })
    const { table } = setup({ state })
    expect(table.allSelected.value).toBe(false)
    expect(table.someSelected.value).toBe(true)
  })

  it('an empty table is neither all- nor partly-selected', () => {
    const state = makeState()
    const table = useDataTable({ rows: () => [], columns: () => COLUMNS, state })
    expect(table.allSelected.value).toBe(false)
    expect(table.someSelected.value).toBe(false)
  })
})
