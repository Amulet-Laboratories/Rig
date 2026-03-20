// composables/useAnnounce.ts
// Screen-reader announcements via an aria-live region.
//
// Usage:
//   Mount `<LiveRegion />` once in the app shell.
//   Call `announce('Record saved')` from anywhere.

import { ref } from 'vue'

const message = ref('')
let clearTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Announce a message to screen readers.
 * Clears automatically after 5 seconds so the region doesn't accumulate text.
 */
export function announce(text: string): void {
  // Force re-announce by briefly clearing, then setting via microtask
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

/**
 * Reactive message ref for the LiveRegion component.
 */
export function useAnnounce() {
  return { message, announce }
}
