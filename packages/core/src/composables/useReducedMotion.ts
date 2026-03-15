import { ref, readonly, onUnmounted, type Ref } from 'vue'

/**
 * Composable that tracks the user's `prefers-reduced-motion` OS preference.
 *
 * Returns a reactive readonly boolean that is `true` when the user prefers
 * reduced motion. Listens for changes so toggling the setting at the OS level
 * updates the value in real time.
 *
 * SSR-safe — returns `false` when `window.matchMedia` is unavailable.
 *
 * Usage:
 * ```ts
 * const prefersReduced = useReducedMotion()
 *
 * // In a template or computed
 * const transition = computed(() =>
 *   prefersReduced.value ? 'none' : 'transform 200ms ease',
 * )
 * ```
 */
export function useReducedMotion(): Readonly<Ref<boolean>> {
  const matches = ref(false)

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return readonly(matches)
  }

  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  matches.value = mql.matches

  function onChange(e: MediaQueryListEvent) {
    matches.value = e.matches
  }

  mql.addEventListener('change', onChange)

  onUnmounted(() => {
    mql.removeEventListener('change', onChange)
  })

  return readonly(matches)
}
