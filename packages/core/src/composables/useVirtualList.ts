import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'

export interface VirtualItem<T> {
  item: T
  index: number
  offsetTop: number
}

export interface VirtualState<T> {
  totalHeight: number
  items: VirtualItem<T>[]
  paddingTop: number
  paddingBottom: number
}

/**
 * Windowed / virtual scrolling composable.
 * Attach `containerRef` to the scrollable element. When `source` returns an
 * empty array the composable is effectively inactive (used to disable virtual
 * mode without breaking call-order rules).
 */
export function useVirtualList<T>(
  source: () => T[],
  options: { itemHeight: number; overscan?: number },
): {
  containerRef: Ref<HTMLElement | null>
  virtualState: ComputedRef<VirtualState<T>>
  onScroll: () => void
} {
  const { itemHeight, overscan = 5 } = options
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  const containerHeight = ref(300)

  function onScroll() {
    scrollTop.value = containerRef.value?.scrollTop ?? 0
  }

  function measure() {
    containerHeight.value = containerRef.value?.clientHeight || 300
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

  // Split into two cheaper computeds so scroll-only changes don't rebuild spacer heights
  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan),
  )

  const endIndex = computed(() => {
    const list = source()
    return Math.min(
      list.length - 1,
      Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + overscan,
    )
  })

  const virtualState = computed<VirtualState<T>>(() => {
    const list = source()
    const start = startIndex.value
    const end = endIndex.value
    const items: VirtualItem<T>[] = []
    for (let i = start; i <= end; i++) {
      items.push({ item: list[i]!, index: i, offsetTop: i * itemHeight })
    }
    return {
      totalHeight: list.length * itemHeight,
      items,
      paddingTop: start * itemHeight,
      paddingBottom: Math.max(0, (list.length - 1 - end) * itemHeight),
    }
  })

  return { containerRef, virtualState, onScroll }
}
