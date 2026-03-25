// useZoom — CSS zoom management with keyboard shortcuts and localStorage persistence.

import { ref, onMounted, onUnmounted } from 'vue'

export interface ZoomOptions {
  /** localStorage key for persisting zoom level */
  storageKey?: string
  /** Default zoom level (default: 1.0) */
  defaultZoom?: number
  /** Minimum zoom level (default: 0.5) */
  min?: number
  /** Maximum zoom level (default: 2.0) */
  max?: number
  /** Zoom increment per step (default: 0.1) */
  step?: number
  /** CSS selector for the element to zoom (default: '#app') */
  target?: string
}

/**
 * Install zoom keyboard shortcuts (Ctrl+=/Ctrl+-/Ctrl+0) and apply persisted zoom.
 * Captures key events before the webview/browser handles them.
 *
 * @example
 * ```ts
 * // In your App.vue setup:
 * const { zoomLevel } = useZoom({ defaultZoom: 0.9, storageKey: 'myapp:zoom' })
 * ```
 */
export function useZoom(options: ZoomOptions = {}) {
  const {
    storageKey = 'rig:zoom',
    defaultZoom = 1.0,
    min = 0.5,
    max = 2.0,
    step = 0.1,
    target = '#app',
  } = options

  const zoomLevel = ref(parseFloat(localStorage.getItem(storageKey) ?? String(defaultZoom)))

  function applyZoom(): void {
    const el = document.querySelector(target) as HTMLElement | null
    if (el) el.style.zoom = String(zoomLevel.value)
    localStorage.setItem(storageKey, String(zoomLevel.value))
  }

  function zoomIn(): void {
    zoomLevel.value = Math.min(+(zoomLevel.value + step).toFixed(1), max)
    applyZoom()
  }

  function zoomOut(): void {
    zoomLevel.value = Math.max(+(zoomLevel.value - step).toFixed(1), min)
    applyZoom()
  }

  function zoomReset(): void {
    zoomLevel.value = defaultZoom
    applyZoom()
  }

  function handleKeydown(e: KeyboardEvent): void {
    const mod = e.ctrlKey || e.metaKey
    if (!mod) return
    if (e.key === '=' || e.key === '+') {
      e.preventDefault()
      zoomIn()
    } else if (e.key === '-') {
      e.preventDefault()
      zoomOut()
    } else if (e.key === '0') {
      e.preventDefault()
      zoomReset()
    }
  }

  onMounted(() => {
    applyZoom()
    window.addEventListener('keydown', handleKeydown, { capture: true })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown, { capture: true })
  })

  return { zoomLevel, zoomIn, zoomOut, zoomReset }
}
