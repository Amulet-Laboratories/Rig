// useGlobalTooltip — intercepts native `title` attributes across the entire app
// and routes them through Rig's tooltip system for consistent styling.

import { onMounted, onUnmounted } from 'vue'
import { useTooltip } from './useTooltip'

/**
 * Intercepts native `title` attributes across the entire app and
 * routes them through Rig's tooltip system for consistent styling.
 *
 * Call once at app root, after `useTooltip({ provide: true })`.
 *
 * Supports `data-tooltip-placement="top|bottom|left|right"` on
 * individual elements to override the default placement (top).
 *
 * @example
 * ```ts
 * // In your App.vue setup:
 * useTooltip({ provide: true })
 * useGlobalTooltip()
 * ```
 */
export function useGlobalTooltip() {
  const tooltip = useTooltip()

  let activeEl: HTMLElement | null = null
  let storedTitle = ''

  function findTarget(el: EventTarget | null): HTMLElement | null {
    let node = el as Element | null
    while (node instanceof HTMLElement) {
      if (node === activeEl) return node
      if (node.title) return node
      node = node.parentElement
    }
    return null
  }

  function activate(target: HTMLElement) {
    storedTitle = target.title
    target.title = '' // suppress native tooltip
    activeEl = target
    const placement =
      (target.dataset.tooltipPlacement as 'top' | 'bottom' | 'left' | 'right') ?? 'top'
    tooltip.show(target, storedTitle, placement)
  }

  function deactivate() {
    if (!activeEl) return
    activeEl.title = storedTitle
    activeEl = null
    storedTitle = ''
    tooltip.hide()
  }

  function onMouseOver(e: MouseEvent) {
    const target = findTarget(e.target)
    if (target === activeEl) return
    if (activeEl) deactivate()
    if (target) activate(target)
  }

  function onMouseOut(e: MouseEvent) {
    if (!activeEl) return
    if (e.relatedTarget && activeEl.contains(e.relatedTarget as Node)) return
    deactivate()
  }

  function onPointerDown() {
    deactivate()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') deactivate()
  }

  function onFocusIn(e: FocusEvent) {
    const target = e.target as HTMLElement
    if (target?.title) {
      if (activeEl) deactivate()
      activate(target)
    }
  }

  function onFocusOut() {
    deactivate()
  }

  onMounted(() => {
    document.addEventListener('mouseover', onMouseOver, true)
    document.addEventListener('mouseout', onMouseOut, true)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('focusin', onFocusIn, true)
    document.addEventListener('focusout', onFocusOut, true)
  })

  onUnmounted(() => {
    document.removeEventListener('mouseover', onMouseOver, true)
    document.removeEventListener('mouseout', onMouseOut, true)
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('keydown', onKeyDown, true)
    document.removeEventListener('focusin', onFocusIn, true)
    document.removeEventListener('focusout', onFocusOut, true)
  })
}
