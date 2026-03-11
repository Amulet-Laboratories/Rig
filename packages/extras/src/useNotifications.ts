import { ref, computed } from 'vue'

export interface NotificationOptions {
  id?: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  /** If true, notification persists until manually dismissed */
  persistent?: boolean
  /** Auto-dismiss after this many ms (0 = no auto-dismiss). Default: 0 for persistent, 10000 otherwise */
  duration?: number
}

export interface NotificationEntry {
  id: string
  message: string
  variant: 'info' | 'success' | 'warning' | 'error'
  persistent: boolean
  timestamp: number
  read: boolean
  timer?: ReturnType<typeof setTimeout>
}

const notifications = ref<NotificationEntry[]>([])
let counter = 0

function push(options: NotificationOptions): string {
  const id = options.id ?? `notif-${++counter}`

  // Replace existing with same ID
  const existingIdx = notifications.value.findIndex((n) => n.id === id)
  if (existingIdx > -1) {
    const existing = notifications.value[existingIdx]!
    if (existing.timer) clearTimeout(existing.timer)
    notifications.value.splice(existingIdx, 1)
  }

  const persistent = options.persistent ?? false
  const entry: NotificationEntry = {
    id,
    message: options.message,
    variant: options.variant ?? 'info',
    persistent,
    timestamp: Date.now(),
    read: false,
  }

  const duration = options.duration ?? (persistent ? 0 : 10_000)
  if (duration > 0) {
    entry.timer = setTimeout(() => dismiss(id), duration)
  }

  notifications.value.push(entry)
  return id
}

function dismiss(id: string) {
  const idx = notifications.value.findIndex((n) => n.id === id)
  if (idx > -1) {
    const entry = notifications.value[idx]!
    if (entry.timer) clearTimeout(entry.timer)
    notifications.value.splice(idx, 1)
  }
}

function markRead(id: string) {
  const entry = notifications.value.find((n) => n.id === id)
  if (entry) entry.read = true
}

function markAllRead() {
  notifications.value.forEach((n) => {
    n.read = true
  })
}

function clear() {
  notifications.value.forEach((n) => {
    if (n.timer) clearTimeout(n.timer)
  })
  notifications.value = []
}

/** Module-level notification API — import and call directly */
export const notification = { push, dismiss, markRead, markAllRead, clear }

/** Reactive notification state for the NotificationCenter component */
export function useNotifications() {
  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

  return {
    notifications,
    unreadCount,
    push,
    dismiss,
    markRead,
    markAllRead,
    clear,
  }
}
