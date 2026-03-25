// useMarkdown — safe markdown rendering with DOMPurify sanitization and LRU cache.

import DOMPurify from 'dompurify'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
})

// Block javascript: protocol in linkified URLs
md.linkify.set({ fuzzyLink: false })
md.disable('html_block')
md.disable('html_inline')

// LRU-style cache: Map preserves insertion order, we evict oldest on overflow.
const DEFAULT_CACHE_MAX = 128
let cacheMax = DEFAULT_CACHE_MAX
const renderCache = new Map<string, string>()

/**
 * Configure the maximum cache size for rendered markdown.
 * Call before any rendering to adjust the default (128).
 */
export function setMarkdownCacheSize(max: number): void {
  cacheMax = max
}

/**
 * Render markdown to sanitized HTML safe for `v-html` binding.
 * Results are cached — repeated calls with the same input return instantly.
 */
export function renderMarkdown(raw: string): string {
  const cached = renderCache.get(raw)
  if (cached !== undefined) return cached

  const result = DOMPurify.sanitize(md.render(raw))

  if (renderCache.size >= cacheMax) {
    // Evict oldest entry (first key in Map)
    const oldest = renderCache.keys().next().value
    if (oldest !== undefined) renderCache.delete(oldest)
  }
  renderCache.set(raw, result)

  return result
}

/**
 * Clear the markdown render cache.
 */
export function clearMarkdownCache(): void {
  renderCache.clear()
}
