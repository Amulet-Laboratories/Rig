import { describe, it, expect } from 'vitest'
import { useFormatDate } from './useFormatDate'

describe('useFormatDate', () => {
  const { formatDate } = useFormatDate()

  // Use full ISO timestamps with T12:00 to avoid timezone edge cases
  describe('short format (default)', () => {
    it('formats a date string as "Mon D"', () => {
      const result = formatDate('2025-06-15T12:00:00')
      expect(result).toBe('Jun 15')
    })

    it('handles different months', () => {
      expect(formatDate('2025-01-15T12:00:00')).toBe('Jan 15')
      expect(formatDate('2025-12-25T12:00:00')).toBe('Dec 25')
    })
  })

  describe('long format', () => {
    it('formats a date string as "Month D, YYYY"', () => {
      const result = formatDate('2025-06-15T12:00:00', 'long')
      expect(result).toBe('June 15, 2025')
    })

    it('handles year boundaries', () => {
      expect(formatDate('2024-12-15T12:00:00', 'long')).toBe('December 15, 2024')
      expect(formatDate('2025-03-20T12:00:00', 'long')).toBe('March 20, 2025')
    })
  })
})
