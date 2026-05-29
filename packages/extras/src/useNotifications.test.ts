import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { notification, useNotifications } from './useNotifications'

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    notification.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with empty notifications', () => {
    const { notifications } = useNotifications()
    expect(notifications.value).toHaveLength(0)
  })

  it('push() adds a notification and returns its id', () => {
    const id = notification.push({ message: 'Alert' })
    expect(id).toBeTypeOf('string')
    const { notifications } = useNotifications()
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0]!.message).toBe('Alert')
  })

  it('uses info variant by default', () => {
    notification.push({ message: 'Default' })
    const { notifications } = useNotifications()
    expect(notifications.value[0]!.variant).toBe('info')
  })

  it('uses custom variant', () => {
    notification.push({ message: 'Err', variant: 'error' })
    const { notifications } = useNotifications()
    expect(notifications.value[0]!.variant).toBe('error')
  })

  it('notifications start unread', () => {
    notification.push({ message: 'New' })
    const { notifications } = useNotifications()
    expect(notifications.value[0]!.read).toBe(false)
  })

  it('includes a timestamp', () => {
    const now = Date.now()
    notification.push({ message: 'Timed' })
    const { notifications } = useNotifications()
    expect(notifications.value[0]!.timestamp).toBeGreaterThanOrEqual(now)
  })

  it('auto-dismisses non-persistent notifications after 10s', () => {
    notification.push({ message: 'Temp' })
    const { notifications } = useNotifications()
    expect(notifications.value).toHaveLength(1)
    vi.advanceTimersByTime(10_100)
    expect(notifications.value).toHaveLength(0)
  })

  it('does not auto-dismiss persistent notifications', () => {
    notification.push({ message: 'Sticky', persistent: true })
    const { notifications } = useNotifications()
    vi.advanceTimersByTime(60_000)
    expect(notifications.value).toHaveLength(1)
  })

  it('respects custom duration', () => {
    notification.push({ message: 'Quick', duration: 2000 })
    const { notifications } = useNotifications()
    vi.advanceTimersByTime(2100)
    expect(notifications.value).toHaveLength(0)
  })

  it('dismiss() removes a specific notification', () => {
    const id = notification.push({ message: 'A', persistent: true })
    notification.push({ message: 'B', persistent: true })
    notification.dismiss(id)
    const { notifications } = useNotifications()
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0]!.message).toBe('B')
  })

  it('replaces existing notification with same id', () => {
    notification.push({ id: 'dup', message: 'First', persistent: true })
    notification.push({ id: 'dup', message: 'Second', persistent: true })
    const { notifications } = useNotifications()
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0]!.message).toBe('Second')
  })

  it('markRead() marks a notification as read', () => {
    const id = notification.push({ message: 'Read me', persistent: true })
    const { notifications } = useNotifications()
    expect(notifications.value[0]!.read).toBe(false)
    notification.markRead(id)
    expect(notifications.value[0]!.read).toBe(true)
  })

  it('markAllRead() marks all notifications as read', () => {
    notification.push({ message: 'A', persistent: true })
    notification.push({ message: 'B', persistent: true })
    const { notifications } = useNotifications()
    notification.markAllRead()
    expect(notifications.value.every((n) => n.read)).toBe(true)
  })

  it('unreadCount reflects unread notifications', () => {
    notification.push({ message: 'A', persistent: true })
    notification.push({ message: 'B', persistent: true })
    const { unreadCount } = useNotifications()
    expect(unreadCount.value).toBe(2)
    notification.markAllRead()
    expect(unreadCount.value).toBe(0)
  })

  it('clear() removes all notifications', () => {
    notification.push({ message: 'A', persistent: true })
    notification.push({ message: 'B', persistent: true })
    notification.clear()
    const { notifications } = useNotifications()
    expect(notifications.value).toHaveLength(0)
  })

  it('useNotifications() shares the same state', () => {
    const a = useNotifications()
    const b = useNotifications()
    notification.push({ message: 'Shared', persistent: true })
    expect(a.notifications.value).toHaveLength(1)
    expect(b.notifications.value).toHaveLength(1)
    expect(a.notifications).toBe(b.notifications)
  })
})
