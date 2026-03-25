import { ref, onMounted, onUnmounted } from 'vue'

/**
 * useScrollNav — reactive scroll-state composable for navigation bars.
 *
 * Returns `scrolled` (true once the page scrolls past `threshold` pixels)
 * and `atTop` (true when scroll position is 0). Consumers use these to
 * toggle transparent / opaque nav bar styles without manual event wiring.
 *
 * @example
 * ```ts
 * const { scrolled, atTop } = useScrollNav({ threshold: 50 })
 * ```
 *
 * Pair with SiteNav's root data attributes in Hex for styling:
 * ```html
 * <SiteNav :data-scrolled="scrolled || undefined" :data-at-top="atTop || undefined" />
 * ```
 */

export interface UseScrollNavOptions {
  /** Pixel distance from top before `scrolled` becomes true. Defaults to 50. */
  threshold?: number
}

export function useScrollNav(options: UseScrollNavOptions = {}) {
  const { threshold = 50 } = options
  const scrolled = ref(false)
  const atTop = ref(true)

  function update() {
    const y = window.scrollY
    scrolled.value = y > threshold
    atTop.value = y === 0
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', update)
  })

  return { scrolled, atTop }
}
