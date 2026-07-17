import { describe, it, expect } from 'vitest'
import { scanSource, formatViolations } from './content-guard'

describe('scanSource', () => {
  it('flags a self-closing PascalCase component', () => {
    const v = scanSource('a.md', '<ProductCardWrapper slug="x" />')
    expect(v).toHaveLength(1)
    expect(v[0]).toMatchObject({ file: 'a.md', line: 1, tag: 'ProductCardWrapper' })
  })

  it('flags the no-space variant', () => {
    expect(scanSource('a.md', '<ProductCardWrapper slug="x"/>')).toHaveLength(1)
  })

  it('does not flag an explicit close tag', () => {
    expect(scanSource('a.md', '<ProductCardWrapper slug="x"></ProductCardWrapper>')).toHaveLength(0)
  })

  it('ignores lowercase HTML void elements', () => {
    expect(scanSource('a.md', 'line<br/> and <img src="x" />')).toHaveLength(0)
  })

  it('reports the correct line number across a multi-line doc', () => {
    const src = ['# Title', '', 'prose', '<QuizEmbedWrapper id="q" />'].join('\n')
    const v = scanSource('a.md', src)
    expect(v).toHaveLength(1)
    expect(v[0]).toMatchObject({ line: 4, tag: 'QuizEmbedWrapper' })
  })

  it('flags multiple violations on one line', () => {
    expect(scanSource('a.md', '<A x="1" /><B y="2" />')).toHaveLength(2)
  })
})

describe('formatViolations', () => {
  it('includes the count and a fix suggestion', () => {
    const msg = formatViolations(scanSource('a.md', '<ProductCardWrapper slug="x" />'))
    expect(msg).toContain('Found 1 self-closing component tag(s)')
    expect(msg).toContain('a.md:1')
    expect(msg).toContain('</ProductCardWrapper>')
  })
})
