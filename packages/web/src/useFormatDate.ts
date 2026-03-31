/**
 * useFormatDate — Date formatting utility for content sites.
 *
 * Returns a `formatDate` function that formats ISO date strings
 * using the Intl.DateTimeFormat API.
 *
 * @example
 * const { formatDate } = useFormatDate()
 * formatDate('2025-06-15')          // "Jun 15"
 * formatDate('2025-06-15', 'long')  // "June 15, 2025"
 */

export type FormatDateStyle = 'short' | 'long'

export function useFormatDate() {
  function formatDate(dateStr: string, style: FormatDateStyle = 'short') {
    const options: Intl.DateTimeFormatOptions =
      style === 'long'
        ? { year: 'numeric', month: 'long', day: 'numeric' }
        : { month: 'short', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString('en-US', options)
  }

  return { formatDate }
}
