import { describe, bench } from 'vitest'
import { useNotifications, notification } from './useNotifications'

describe('useNotifications', () => {
  bench('invoke useNotifications', () => {
    useNotifications()
  })

  bench('push + dismiss cycle', () => {
    const id = notification.push({ message: 'bench', persistent: true })
    notification.dismiss(id)
  })

  bench('push + markRead + clear', () => {
    notification.push({ message: 'bench', persistent: true })
    notification.markAllRead()
    notification.clear()
  })
})
