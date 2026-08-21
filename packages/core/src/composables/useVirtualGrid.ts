import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'

export interface VirtualGridCell<T> {
  item: T
  index: number
}

export interface VirtualGridRow<T> {
  row: number
  offsetTop: number
  cells: VirtualGridCell<T>[]
}

export interface VirtualGridState<T> {
  totalHeight: number
  rows: VirtualGridRow<T>[]
  paddingTop: number
  paddingBottom: number
}

export interface VirtualGridOptions {
  /**
   * Column count derives from the measured container width: as many columns of
   * at least this width as fit, never fewer than one. Ignored when `columns`
   * is set.
   */
  minColumnWidth?: number | (() => number)
  /** Fixed column count. Takes precedence over `minColumnWidth`. */
  columns?: number | (() => number)
  /**
   * Row height in px, or a function of the measured column width — a square
   * thumbnail with a caption under it is `(w) => w + captionHeight`.
   */
  rowHeight: number | ((columnWidth: number) => number)
  /** Gap between cells and between rows, px. */
  gap?: number
  /** Extra rows rendered above and below the viewport. */
  overscan?: number
}

/**
 * Two-dimensional windowed scrolling: `useVirtualList`'s spacer maths applied
 * to rows of N cells, with the column count responsive to container width.
 *
 * Attach `containerRef` to the scrollable element and `onScroll` to its scroll
 * event; render `virtualState.rows` between `paddingTop` / `paddingBottom`
 * spacers. Every row is `rowHeight + gap` tall in the spacer maths (the last
 * row keeps its trailing gap as invisible padding — a constant stride is what
 * keeps scroll math exact at fifty thousand cells).
 */
export function useVirtualGrid<T>(
  source: () => T[],
  options: VirtualGridOptions,
): {
  containerRef: Ref<HTMLElement | null>
  /** Measured viewport height, px. Holds its default until observed. */
  viewportHeight: Ref<number>
  columnCount: ComputedRef<number>
  columnWidth: ComputedRef<number>
  rowHeight: ComputedRef<number>
  virtualState: ComputedRef<VirtualGridState<T>>
  onScroll: () => void
  scrollToIndex: (index: number, align?: 'auto' | 'center') => void
} {
  const { gap = 8, overscan = 2 } = options
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  // Defaults hold until the ResizeObserver reports; they also make the maths
  // deterministic under jsdom, where nothing ever measures.
  const containerWidth = ref(600)
  const containerHeight = ref(300)

  const num = (v: number | (() => number) | undefined) => (typeof v === 'function' ? v() : v)

  function onScroll() {
    scrollTop.value = containerRef.value?.scrollTop ?? 0
  }

  function measure() {
    if (!containerRef.value) return
    containerWidth.value = containerRef.value.clientWidth || containerWidth.value
    containerHeight.value = containerRef.value.clientHeight || containerHeight.value
  }

  let ro: ResizeObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return
    containerRef.value.addEventListener('scroll', onScroll, { passive: true })
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure)
      ro.observe(containerRef.value)
    }
    measure()
  })

  onUnmounted(() => {
    containerRef.value?.removeEventListener('scroll', onScroll)
    ro?.disconnect()
  })

  const columnCount = computed(() => {
    const fixed = num(options.columns)
    if (fixed) return Math.max(1, Math.floor(fixed))
    const min = num(options.minColumnWidth) ?? 120
    return Math.max(1, Math.floor((containerWidth.value + gap) / (min + gap)))
  })

  const columnWidth = computed(() => {
    const cols = columnCount.value
    return Math.max(0, (containerWidth.value - (cols - 1) * gap) / cols)
  })

  const rowHeight = computed(() => {
    const h = options.rowHeight
    return typeof h === 'function' ? h(columnWidth.value) : h
  })

  const stride = computed(() => rowHeight.value + gap)

  const rowCount = computed(() => Math.ceil(source().length / columnCount.value))

  // Split into two cheaper computeds so scroll-only changes don't rebuild spacer heights
  const startRow = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / stride.value) - overscan),
  )

  const endRow = computed(() =>
    Math.min(
      rowCount.value - 1,
      Math.ceil((scrollTop.value + containerHeight.value) / stride.value) + overscan,
    ),
  )

  const virtualState = computed<VirtualGridState<T>>(() => {
    const list = source()
    const cols = columnCount.value
    const start = startRow.value
    const end = endRow.value
    const rows: VirtualGridRow<T>[] = []
    for (let r = start; r <= end; r++) {
      const cells: VirtualGridCell<T>[] = []
      for (let i = r * cols; i < Math.min((r + 1) * cols, list.length); i++) {
        cells.push({ item: list[i]!, index: i })
      }
      rows.push({ row: r, offsetTop: r * stride.value, cells })
    }
    return {
      totalHeight: rowCount.value * stride.value,
      rows,
      paddingTop: start * stride.value,
      paddingBottom: Math.max(0, (rowCount.value - 1 - end) * stride.value),
    }
  })

  function scrollToIndex(index: number, align: 'auto' | 'center' = 'auto') {
    const el = containerRef.value
    if (!el) return
    const top = Math.floor(index / columnCount.value) * stride.value
    const bottom = top + rowHeight.value
    if (align === 'center') {
      el.scrollTop = Math.max(0, top - (containerHeight.value - rowHeight.value) / 2)
    } else if (top < el.scrollTop) {
      el.scrollTop = top
    } else if (bottom > el.scrollTop + containerHeight.value) {
      el.scrollTop = bottom - containerHeight.value
    }
    onScroll()
  }

  return {
    containerRef,
    viewportHeight: containerHeight,
    columnCount,
    columnWidth,
    rowHeight,
    virtualState,
    onScroll,
    scrollToIndex,
  }
}
