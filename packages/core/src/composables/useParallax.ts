import { ref, readonly, computed, onMounted, onUnmounted, type Ref, type CSSProperties } from 'vue'
import { useReducedMotion } from './useReducedMotion'

export interface ParallaxLayer {
  /** Unique identifier for this layer. */
  id: string

  /** Image source URL. Optional — only consumed by rendering components (e.g. ParallaxScene). */
  src?: string

  /**
   * Depth coefficient — `0` = fixed (no movement), `1` = moves at scroll
   * speed. Values between create the parallax effect. Defaults to `0`.
   */
  depth?: number

  /**
   * Optional static fallback image shown when reduced motion is preferred.
   * Typically a pre-composed version of the full scene.
   */
  fallback?: string
}

export interface ParallaxOptions {
  /** Layers to render, ordered back-to-front. */
  layers: ParallaxLayer[]

  /**
   * Global strength multiplier applied to all depth values.
   * `0` = no parallax, `1` = full effect. Defaults to `0.5`.
   */
  strength?: number

  /**
   * Honour `prefers-reduced-motion` — when `true`, disables the scroll
   * effect and returns static styles. Defaults to `true`.
   */
  respectReducedMotion?: boolean
}

export interface ParallaxReturn {
  /** Ref to attach to the scroll container element. */
  containerRef: Ref<HTMLElement | null>

  /** Returns a reactive inline style object for a given layer id. */
  getLayerStyle: (id: string) => CSSProperties

  /** Current scroll offset within the container (reactive). */
  scrollOffset: Readonly<Ref<number>>
}

/**
 * Composable for depth-sorted parallax scrolling.
 *
 * Each layer is translated on the Y axis proportionally to its `depth`
 * coefficient as the container scrolls through the viewport.
 *
 * Uses `IntersectionObserver` to activate only while the container is
 * visible, and `requestAnimationFrame` for smooth updates. Falls back
 * to static positioning when the user prefers reduced motion.
 *
 * SSR-safe — returns zero-offset styles when `window` is unavailable.
 *
 * Usage:
 * ```vue
 * <template>
 *   <div ref="containerRef" class="relative overflow-hidden h-screen">
 *     <div v-for="layer in layers" :key="layer.id" :style="getLayerStyle(layer.id)">
 *       <img :src="layer.src" />
 *     </div>
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * const { containerRef, getLayerStyle } = useParallax({
 *   layers: [
 *     { id: 'bg', src: '/sky.webp', depth: 0 },
 *     { id: 'fg', src: '/trees.webp', depth: 0.8 },
 *   ],
 * })
 * </script>
 * ```
 */
export function useParallax(options: ParallaxOptions): ParallaxReturn {
  const { layers, strength = 0.5, respectReducedMotion = true } = options

  const containerRef = ref<HTMLElement | null>(null)
  const scrollOffset = ref(0)
  const containerHeight = ref(0)
  const isActive = ref(false)

  const prefersReduced = respectReducedMotion ? useReducedMotion() : readonly(ref(false))

  // Pre-compute reactive style per layer
  const layerStyles = computed(() => {
    const styles = new Map<string, CSSProperties>()

    for (const layer of layers) {
      const depth = layer.depth ?? 0
      const offset = prefersReduced.value ? 0 : scrollOffset.value * depth * strength

      styles.set(layer.id, {
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: prefersReduced.value ? 'auto' : 'transform',
      })
    }

    return styles
  })

  function getLayerStyle(id: string): CSSProperties {
    return layerStyles.value.get(id) ?? {}
  }

  if (typeof window === 'undefined') {
    return { containerRef, getLayerStyle, scrollOffset: readonly(scrollOffset) }
  }

  let rafId: number | null = null
  let observer: IntersectionObserver | null = null

  function onScroll() {
    if (!isActive.value || !containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const viewportH = window.innerHeight
    // Normalise: 0 when container top hits viewport bottom,
    // negative as it scrolls up past viewport top
    scrollOffset.value = -(rect.top - viewportH)
  }

  function tick() {
    onScroll()
    if (isActive.value && !prefersReduced.value) {
      rafId = requestAnimationFrame(tick)
    }
  }

  function start() {
    if (rafId !== null) return
    isActive.value = true
    tick()
  }

  function stop() {
    isActive.value = false
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onMounted(() => {
    if (!containerRef.value || prefersReduced.value) return

    containerHeight.value = containerRef.value.offsetHeight

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) start()
        else stop()
      },
      { threshold: 0 },
    )

    observer.observe(containerRef.value)
  })

  onUnmounted(() => {
    stop()
    observer?.disconnect()
    observer = null
  })

  return { containerRef, getLayerStyle, scrollOffset: readonly(scrollOffset) }
}
