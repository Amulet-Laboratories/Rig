import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { notification, useNotifications } from './useNotifications'
import NotificationCenter from './NotificationCenter.vue'

describe('useNotifications', () => {
  beforeEach(() => {
    notification.clear()
  })

  it('pushes a notification', () => {
    const { notifications } = useNotifications()
    notification.push({ message: 'Hello' })
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0].message).toBe('Hello')
  })

  it('assigns unique IDs', () => {
    notification.push({ message: 'A' })
    notification.push({ message: 'B' })
    const { notifications } = useNotifications()
    expect(notifications.value[0].id).not.toBe(notifications.value[1].id)
  })

  it('replaces existing notification with same ID', () => {
    notification.push({ id: 'sync', message: 'Syncing...' })
    notification.push({ id: 'sync', message: 'Sync complete' })
    const { notifications } = useNotifications()
    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0].message).toBe('Sync complete')
  })

  it('dismisses a notification', () => {
    const id = notification.push({ message: 'Gone' })
    notification.dismiss(id)
    expect(useNotifications().notifications.value).toHaveLength(0)
  })

  it('marks as read', () => {
    const id = notification.push({ message: 'Msg' })
    const { unreadCount } = useNotifications()
    expect(unreadCount.value).toBe(1)
    notification.markRead(id)
    expect(unreadCount.value).toBe(0)
  })

  it('marks all read', () => {
    notification.push({ message: 'A' })
    notification.push({ message: 'B' })
    const { unreadCount } = useNotifications()
    expect(unreadCount.value).toBe(2)
    notification.markAllRead()
    expect(unreadCount.value).toBe(0)
  })

  it('auto-dismisses non-persistent after duration', () => {
    vi.useFakeTimers()
    notification.push({ message: 'Temp', duration: 100 })
    expect(useNotifications().notifications.value).toHaveLength(1)
    vi.advanceTimersByTime(150)
    expect(useNotifications().notifications.value).toHaveLength(0)
    vi.useRealTimers()
  })

  it('does not auto-dismiss persistent notifications', () => {
    vi.useFakeTimers()
    notification.push({ message: 'Sticky', persistent: true })
    vi.advanceTimersByTime(60_000)
    expect(useNotifications().notifications.value).toHaveLength(1)
    vi.useRealTimers()
  })
})

describe('NotificationCenter', () => {
  beforeEach(() => {
    notification.clear()
  })

  it('renders bell button', () => {
    const wrapper = mount(NotificationCenter)
    expect(wrapper.find('[data-rig-notification-bell]').exists()).toBe(true)
  })

  it('shows unread badge when notifications exist', () => {
    notification.push({ message: 'Hi', persistent: true, duration: 0 })
    const wrapper = mount(NotificationCenter)
    expect(wrapper.find('[data-rig-notification-badge]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-notification-badge]').text()).toBe('1')
  })

  it('opens panel on bell click', async () => {
    notification.push({ message: 'Test', persistent: true, duration: 0 })
    const wrapper = mount(NotificationCenter)
    await wrapper.find('[data-rig-notification-bell]').trigger('click')
    expect(wrapper.find('[data-rig-notification-panel]').exists()).toBe(true)
  })

  it('shows empty state when no notifications', async () => {
    const wrapper = mount(NotificationCenter)
    await wrapper.find('[data-rig-notification-bell]').trigger('click')
    expect(wrapper.find('[data-rig-notification-empty]').exists()).toBe(true)
  })
})
