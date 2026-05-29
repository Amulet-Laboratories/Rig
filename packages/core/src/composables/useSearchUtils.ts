// useSearchUtils — generic text search, snippet extraction, and highlight utilities.
// Pure TypeScript, no Vue dependency.

/**
 * Extract a text snippet around a query match within a larger body of text.
 * Strips markdown headings and truncates to ~80 characters with ellipsis.
 *
 * @example
 * ```ts
 * extractSnippet('Some long text with the keyword inside it...', 'keyword')
 * // "...text with the keyword inside..."
 * ```
 */
export function extractSnippet(text: string, query: string): string {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, 60)

  const lineStart = text.lastIndexOf('\n', idx) + 1
  let lineEnd = text.indexOf('\n', idx)
  if (lineEnd === -1) lineEnd = text.length

  let line = text.slice(lineStart, lineEnd).trim()
  line = line.replace(/^#+\s*/, '')

  if (line.length > 80) {
    const matchInLine = line.toLowerCase().indexOf(query.toLowerCase())
    const start = Math.max(0, matchInLine - 20)
    const end = Math.min(line.length, matchInLine + query.length + 40)
    line = (start > 0 ? '...' : '') + line.slice(start, end) + (end < line.length ? '...' : '')
  }

  return line
}

/**
 * Split text into before/match/after parts around a case-insensitive query.
 * Useful for rendering highlighted search results.
 *
 * @example
 * ```ts
 * const { before, match, after } = highlightParts('Hello World', 'world')
 * // { before: 'Hello ', match: 'World', after: '' }
 * ```
 */
export function highlightParts(
  text: string,
  query: string,
): { before: string; match: string; after: string } {
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  const idx = lower.indexOf(q)
  if (idx === -1) return { before: text, match: '', after: '' }
  return {
    before: text.slice(0, idx),
    match: text.slice(idx, idx + q.length),
    after: text.slice(idx + q.length),
  }
}
