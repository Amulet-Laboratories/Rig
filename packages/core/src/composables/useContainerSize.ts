import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Tracks the content dimensions of a container element via ResizeObserver.
 * Returns reactive `width` and `height` refs that update whenever the
 * element is resized.
 *
 * Usage:
 * ```ts
 * const containerRef = ref<HTMLElement | null>(null)
 * const { width, height } = useContainerSize(containerRef)
 * ```
 */
export function useContainerSize(containerRef: Ref<HTMLElement | null>) {
  const width = ref(0)
  const height = ref(0)
  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width: w, height: h } = entry.contentRect
      width.value = w
      height.value = h
    })
    resizeObserver.observe(containerRef.value)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
  })

  return { width, height }
}
