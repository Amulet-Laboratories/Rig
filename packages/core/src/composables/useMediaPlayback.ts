import { watch, onUnmounted, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'

export interface MediaPlaybackOptions {
  /**
   * Reactive condition that controls play/pause. When `true` the media
   * plays; when `false` it pauses. Typically wired to
   * `useScrollVisibility().isVisible`.
   */
  playWhen: Readonly<Ref<boolean>>

  /**
   * When `true` (default), the media will not auto-play if the user
   * prefers reduced motion.
   */
  respectReducedMotion?: boolean
}

/**
 * Composable that plays or pauses an `HTMLMediaElement` (video or audio)
 * based on a reactive boolean signal.
 *
 * Pairs naturally with `useScrollVisibility` to create scroll-triggered
 * video playback. Respects `prefers-reduced-motion` by default.
 *
 * SSR-safe — no-ops when refs are null.
 *
 * Usage:
 * ```ts
 * const { isVisible, elementRef } = useScrollVisibility({ threshold: 0.65 })
 * const videoRef = ref<HTMLVideoElement | null>(null)
 *
 * useMediaPlayback(videoRef, { playWhen: isVisible })
 * ```
 */
export function useMediaPlayback(
  mediaRef: Ref<HTMLMediaElement | null>,
  options: MediaPlaybackOptions,
): void {
  const { playWhen, respectReducedMotion = true } = options
  const prefersReduced = respectReducedMotion ? useReducedMotion() : { value: false }

  const stopWatch = watch(
    [playWhen, () => prefersReduced.value],
    ([shouldPlay, reduced]) => {
      const el = mediaRef.value
      if (!el) return

      if (shouldPlay && !reduced) {
        // play() returns a promise — catch to avoid unhandled rejection
        // when the browser blocks autoplay
        el.play().catch(() => {})
      } else {
        el.pause()
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    stopWatch()
    mediaRef.value?.pause()
  })
}
