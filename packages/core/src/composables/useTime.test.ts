import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { timeAgo, todayStr } from './useTime'

describe('timeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for very recent dates', () => {
    expect(timeAgo('2025-06-15T11:59:45Z')).toBe('just now')
  })

  it('returns minutes ago for short intervals', () => {
    expect(timeAgo('2025-06-15T11:55:00Z')).toBe('5m ago')
  })

  it('returns hours ago for medium intervals', () => {
    expect(timeAgo('2025-06-15T09:00:00Z')).toBe('3h ago')
  })

  it('returns days ago for multi-day intervals', () => {
    expect(timeAgo('2025-06-12T12:00:00Z')).toBe('3d ago')
  })

  it('returns formatted date for 30+ days', () => {
    const result = timeAgo('2025-04-01T00:00:00Z')
    expect(result).not.toContain('ago')
  })
})

describe('todayStr', () => {
  it('returns YYYY-MM-DD format', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'))
    expect(todayStr()).toBe('2025-06-15')
    vi.useRealTimers()
  })

  it('returns a 10-character string', () => {
    expect(todayStr()).toHaveLength(10)
  })
})
