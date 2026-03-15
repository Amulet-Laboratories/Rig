import { type Ref, watch, nextTick, onUnmounted } from 'vue'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface FocusTrapOptions {
  /** Ref to the container element that traps focus */
  containerRef: Ref<HTMLElement | null>
  /** Reactive boolean controlling when the trap is active */
  active: Ref<boolean>
  /** Called when Escape is pressed (optional — caller handles close logic) */
  onEscape?: () => void
  /** Whether to auto-focus the first focusable element on activation (default: true) */
  autoFocus?: boolean
  /** Whether to restore focus to the previously focused element on deactivation (default: true) */
  restoreFocus?: boolean
}

/**
 * Composable that traps keyboard focus within a container element.
 *
 * - Tab/Shift+Tab cycle within focusable descendants
 * - Optionally auto-focuses the first focusable on activation
 * - Optionally restores focus to the previously focused element on deactivation
 * - Optionally handles Escape key
 *
 * Usage:
 * ```ts
 * const containerRef = ref<HTMLElement | null>(null)
 * const isOpen = ref(false)
 *
 * useFocusTrap({
 *   containerRef,
 *   active: isOpen,
 *   onEscape: () => { isOpen.value = false },
 * })
 * ```
 */
export function useFocusTrap(options: FocusTrapOptions) {
  const { containerRef, active, onEscape, autoFocus = true, restoreFocus = true } = options

  let previousFocus: HTMLElement | null = null

  function getFocusableElements(): HTMLElement[] {
    if (!containerRef.value) return []
    return Array.from(containerRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onEscape) {
      e.stopPropagation()
      onEscape()
      return
    }

    if (e.key !== 'Tab') return

    const focusable = getFocusableElements()
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!

    if (e.shiftKey) {
      if (
        document.activeElement === first ||
        !containerRef.value?.contains(document.activeElement)
      ) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (
        document.activeElement === last ||
        !containerRef.value?.contains(document.activeElement)
      ) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  function activate() {
    previousFocus = document.activeElement as HTMLElement

    if (autoFocus) {
      nextTick(() => {
        const first = getFocusableElements()[0]
        first?.focus()
      })
    }

    document.addEventListener('keydown', onKeydown, true)
  }

  function deactivate() {
    document.removeEventListener('keydown', onKeydown, true)

    if (restoreFocus && previousFocus) {
      previousFocus.focus()
      previousFocus = null
    }
  }

  watch(
    active,
    async (isActive) => {
      if (isActive) {
        await nextTick()
        activate()
      } else {
        deactivate()
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown, true)
  })
}
