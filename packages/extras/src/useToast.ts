import { ref } from 'vue'

export interface ToastOptions {
  id?: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  dismissible?: boolean
}

export interface ToastEntry {
  id: string
  message: string
  variant: 'info' | 'success' | 'warning' | 'error'
  dismissible: boolean
  timer?: ReturnType<typeof setTimeout>
}

const toasts = ref<ToastEntry[]>([])
let counter = 0

function add(options: ToastOptions): string {
  const id = options.id ?? `toast-${++counter}`
  const entry: ToastEntry = {
    id,
    message: options.message,
    variant: options.variant ?? 'info',
    dismissible: options.dismissible ?? true,
  }

  if (options.duration !== 0) {
    entry.timer = setTimeout(() => dismiss(id), options.duration ?? 5000)
  }

  toasts.value.push(entry)
  return id
}

function dismiss(id: string) {
  const idx = toasts.value.findIndex((t) => t.id === id)
  if (idx > -1) {
    const entry = toasts.value[idx]!
    if (entry.timer) clearTimeout(entry.timer)
    toasts.value.splice(idx, 1)
  }
}

function clear() {
  toasts.value.forEach((t) => {
    if (t.timer) clearTimeout(t.timer)
  })
  toasts.value = []
}

/**
 * Module-level toast API — import and call directly.
 * No provide/inject needed.
 */
export const toast = { add, dismiss, clear }

/** Reactive toast list for the Toast component */
export function useToast() {
  return { toasts, add, dismiss, clear }
}
