import { describe, it, expect } from 'vitest'
import { extractSnippet, highlightParts } from './useSearchUtils'

describe('extractSnippet', () => {
  it('extracts snippet around a match', () => {
    const text =
      'This is a long paragraph that contains the keyword somewhere in the middle of all this text.'
    const result = extractSnippet(text, 'keyword')
    expect(result).toContain('keyword')
  })

  it('returns beginning of text if no match found', () => {
    const result = extractSnippet('Hello world, this is a test string.', 'xyz')
    expect(result).toBe('Hello world, this is a test string.')
  })

  it('strips markdown headings', () => {
    const text = '## Important Heading\nSome body text'
    const result = extractSnippet(text, 'Important')
    expect(result).not.toMatch(/^##/)
    expect(result).toContain('Important')
  })

  it('truncates long lines with ellipsis', () => {
    const text = `${'A'.repeat(50)}keyword${'B'.repeat(50)}`
    const result = extractSnippet(text, 'keyword')
    expect(result.length).toBeLessThan(text.length)
    expect(result).toContain('keyword')
  })
})

describe('highlightParts', () => {
  it('splits text around a case-insensitive match', () => {
    const result = highlightParts('Hello World', 'world')
    expect(result.before).toBe('Hello ')
    expect(result.match).toBe('World')
    expect(result.after).toBe('')
  })

  it('returns full text as before when no match', () => {
    const result = highlightParts('Hello World', 'xyz')
    expect(result.before).toBe('Hello World')
    expect(result.match).toBe('')
    expect(result.after).toBe('')
  })

  it('handles match at the start', () => {
    const result = highlightParts('Hello World', 'hello')
    expect(result.before).toBe('')
    expect(result.match).toBe('Hello')
    expect(result.after).toBe(' World')
  })

  it('handles match in the middle', () => {
    const result = highlightParts('foo bar baz', 'bar')
    expect(result.before).toBe('foo ')
    expect(result.match).toBe('bar')
    expect(result.after).toBe(' baz')
  })
})
