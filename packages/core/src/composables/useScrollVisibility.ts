import { ref, readonly, onMounted, onUnmounted, type Ref } from 'vue'

export interface ScrollVisibilityOptions {
  /**
   * IntersectionObserver threshold — fraction of the element that must be
   * visible before `isVisible` becomes `true`. Defaults to `0`.
   */
  threshold?: number

  /**
   * IntersectionObserver `rootMargin`. Defaults to `'0px'`.
   */
  rootMargin?: string
}

export interface ScrollVisibilityReturn {
  /** Ref to attach to the target element. */
  elementRef: Ref<HTMLElement | null>

  /** Reactive boolean — `true` when the element meets the visibility threshold. */
  isVisible: Readonly<Ref<boolean>>

  /** Reactive intersection ratio (0..1) from the last observer callback. */
  ratio: Readonly<Ref<number>>
}

/**
 * Reactive wrapper around `IntersectionObserver`.
 *
 * Tracks whether an element is visible in the viewport and exposes the
 * current intersection ratio. SSR-safe — returns inert refs when
 * `IntersectionObserver` is unavailable.
 *
 * Usage:
 * ```ts
 * const { elementRef, isVisible, ratio } = useScrollVisibility({ threshold: 0.5 })
 * ```
 */
export function useScrollVisibility(options: ScrollVisibilityOptions = {}): ScrollVisibilityReturn {
  const { threshold = 0, rootMargin = '0px' } = options

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  const ratio = ref(0)

  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return { elementRef, isVisible: readonly(isVisible), ratio: readonly(ratio) }
  }

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        isVisible.value = entry.isIntersecting && entry.intersectionRatio >= threshold
        ratio.value = entry.intersectionRatio
      },
      { threshold, rootMargin },
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { elementRef, isVisible: readonly(isVisible), ratio: readonly(ratio) }
}
