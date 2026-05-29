import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { announce, useAnnounce } from './useAnnounce'

describe('useAnnounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sets message reactively', () => {
    const { message } = useAnnounce()

    announce('Record saved')
    vi.advanceTimersByTime(16)

    expect(message.value).toBe('Record saved')
  })

  it('clears message after timeout', () => {
    const { message } = useAnnounce()

    announce('Deleted')
    vi.advanceTimersByTime(16)
    expect(message.value).toBe('Deleted')

    vi.advanceTimersByTime(5000)
    expect(message.value).toBe('')
  })

  it('replaces previous message', () => {
    const { message } = useAnnounce()

    announce('First')
    vi.advanceTimersByTime(16)
    expect(message.value).toBe('First')

    announce('Second')
    vi.advanceTimersByTime(16)
    expect(message.value).toBe('Second')
  })
})
