// useTime — lightweight date/time utility functions.

/**
 * Format a date string as a relative time description.
 *
 * @example
 * ```ts
 * timeAgo('2025-01-01T00:00:00Z') // "3d ago"
 * timeAgo(new Date().toISOString()) // "just now"
 * ```
 */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

/**
 * Get today's date as an ISO date string (YYYY-MM-DD).
 */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}
