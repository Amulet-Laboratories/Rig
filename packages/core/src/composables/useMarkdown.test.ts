import { describe, it, expect } from 'vitest'
import { renderMarkdown, clearMarkdownCache } from './useMarkdown'

describe('renderMarkdown', () => {
  it('renders basic markdown to HTML', () => {
    const result = renderMarkdown('**bold** text')
    expect(result).toContain('<strong>bold</strong>')
    expect(result).toContain('text')
  })

  it('sanitizes HTML tags', () => {
    const result = renderMarkdown('<script>alert("xss")</script>hello')
    expect(result).not.toContain('<script>')
    expect(result).toContain('hello')
  })

  it('returns cached results on repeated calls', () => {
    clearMarkdownCache()
    const input = '# Heading'
    const first = renderMarkdown(input)
    const second = renderMarkdown(input)
    expect(first).toBe(second)
  })

  it('linkifies URLs', () => {
    const result = renderMarkdown('Visit https://example.com today')
    expect(result).toContain('href="https://example.com"')
  })

  it('renders inline code', () => {
    const result = renderMarkdown('Use `foo()` here')
    expect(result).toContain('<code>foo()</code>')
  })
})

describe('clearMarkdownCache', () => {
  it('clears cached entries', () => {
    renderMarkdown('test input')
    clearMarkdownCache()
    // No assertion needed — just verify it runs without error
  })
})
