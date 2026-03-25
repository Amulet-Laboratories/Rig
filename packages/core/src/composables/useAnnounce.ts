// composables/useAnnounce.ts
// Screen-reader announcements via an aria-live region.
//
// Usage:
//   Mount `<LiveRegion />` once in the app shell.
//   Call `announce('Record saved')` from anywhere.
//
// For multi-app isolation, call `useAnnounce({ provide: true })` at
// the app root. Otherwise falls back to a shared module-level singleton.

import { ref, inject, provide, type Ref } from 'vue'
import { AnnounceKey, type AnnounceState } from '../injection-keys'

// Module-level fallback for standalone / non-component usage
const fallbackMessage = ref('')
let fallbackTimer: ReturnType<typeof setTimeout> | null = null

function createAnnounceState(): AnnounceState {
  const message = ref('')
  let clearTimer: ReturnType<typeof setTimeout> | null = null

  function announce(text: string): void {
    message.value = ''
    setTimeout(() => {
      message.value = text
      if (clearTimer) clearTimeout(clearTimer)
      clearTimer = setTimeout(() => {
        message.value = ''
        clearTimer = null
      }, 5000)
    }, 0)
  }

  return { message, announce }
}

/**
 * Announce a message to screen readers (standalone function).
 * Uses the module-level singleton — prefer `useAnnounce()` in components.
 */
export function announce(text: string): void {
  fallbackMessage.value = ''
  setTimeout(() => {
    fallbackMessage.value = text
    if (fallbackTimer) clearTimeout(fallbackTimer)
    fallbackTimer = setTimeout(() => {
      fallbackMessage.value = ''
      fallbackTimer = null
    }, 5000)
  }, 0)
}

/**
 * Access the announce state. With `{ provide: true }`, creates a scoped
 * instance and provides it to descendants. Otherwise injects from an
 * ancestor, falling back to the module-level singleton.
 */
export function useAnnounce(options?: { provide?: boolean }): {
  message: Ref<string>
  announce: (text: string) => void
} {
  if (options?.provide) {
    const state = createAnnounceState()
    provide(AnnounceKey, state)
    return state
  }

  const injected = inject(AnnounceKey, null)
  if (injected) return injected

  return { message: fallbackMessage, announce }
}
