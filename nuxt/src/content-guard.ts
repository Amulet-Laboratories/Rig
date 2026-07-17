import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// @nuxtjs/mdc (0.20.x–0.22.x) does NOT honor `/>` on component tags: it parses
// `<ProductCardWrapper slug="x" />` as an OPEN tag and swallows every following
// sibling (prose, headings, later cards) as its children. These leaf components
// have no <slot/>, so the swallowed content is silently discarded at render — a
// roundup with N cards renders only the first. Author with an explicit close
// instead: `<ProductCardWrapper slug="x"></ProductCardWrapper>`.
//
// This guard runs at build time (see the module's `build:before` hook) and fails
// the build if any content file reintroduces the self-closing form.

// PascalCase tag (a Vue/MDC component), self-closing. Lowercase HTML voids like
// <br/> / <img/> are intentionally not matched — MDC handles those natively.
const SELF_CLOSING = /<([A-Z][A-Za-z0-9]*)\b[^>]*\/>/g

export interface ContentViolation {
  file: string
  line: number
  tag: string
  text: string
}

/** Scan a single markdown source string. Pure — the unit-tested core. */
export function scanSource(file: string, source: string): ContentViolation[] {
  const out: ContentViolation[] = []
  source.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(SELF_CLOSING)) {
      out.push({ file, line: i + 1, tag: m[1], text: m[0].trim() })
    }
  })
  return out
}

function walkMarkdown(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) out.push(...walkMarkdown(p))
    else if (p.endsWith('.md')) out.push(p)
  }
  return out
}

/** Walk a content directory and collect every self-closing-component violation. */
export function findSelfClosingComponents(contentDir: string): ContentViolation[] {
  const out: ContentViolation[] = []
  for (const file of walkMarkdown(contentDir)) {
    out.push(...scanSource(file, readFileSync(file, 'utf8')))
  }
  return out
}

/** Format violations into a build-error message. */
export function formatViolations(violations: ContentViolation[]): string {
  const lines = [
    `Found ${violations.length} self-closing component tag(s) in content.`,
    'MDC swallows following siblings into these — use an explicit close tag instead,',
    'e.g. <ProductCardWrapper slug="x"></ProductCardWrapper>',
    '',
  ]
  for (const v of violations) {
    lines.push(`  ${v.file}:${v.line}  ${v.text}  →  <${v.tag} ...></${v.tag}>`)
  }
  return lines.join('\n')
}
