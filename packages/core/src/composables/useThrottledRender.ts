import { onUnmounted } from 'vue'

/**
 * Throttle render calls to at most one per animation frame.
 * Prevents visualizations from thrashing when reactive data
 * changes multiple times in the same tick.
 *
 * Usage:
 * ```ts
 * const scheduleRender = useThrottledRender(render)
 * watch(data, scheduleRender)
 * ```
 */
export function useThrottledRender(renderFn: () => void): () => void {
  let frameId: number | null = null

  function schedule() {
    if (frameId !== null) return
    frameId = requestAnimationFrame(() => {
      frameId = null
      renderFn()
    })
  }

  onUnmounted(() => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  })

  return schedule
}
