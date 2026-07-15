import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'

/**
 * Nitro does not transpile this package's TypeScript when it is imported from a
 * consumer's node_modules — Rollup parses these runtime files as plain
 * JavaScript. One type annotation therefore breaks every consumer build with a
 * bare `Expected ',', got ':'`, while Rig's own CI stays green: `nuxt/` is not
 * in the root tsconfig `include`, so `pnpm typecheck` never reads it.
 *
 * That is precisely how rig-nuxt 0.5.0 shipped and broke all seven sites — it
 * carried the only runtime file that had ever contained real TypeScript.
 *
 * These files must stay parseable as JavaScript. Use JSDoc for types.
 */

const SERVER_DIR = join(import.meta.dirname, '..')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) return walk(p)
    return p.endsWith('.ts') && !p.endsWith('.test.ts') ? [p] : []
  })
}

/**
 * Report TypeScript-only constructs using TypeScript's own parser.
 * Regexes are not viable here — `)` followed by `:` is a ternary as often as a
 * return type, and a naive pattern flags correct code.
 */
function typeScriptOnlySyntax(source: string, fileName: string): string[] {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const found: string[] = []
  const at = (node: ts.Node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1

  const visit = (node: ts.Node): void => {
    if (ts.isInterfaceDeclaration(node)) found.push(`line ${at(node)}: interface declaration`)
    else if (ts.isTypeAliasDeclaration(node)) found.push(`line ${at(node)}: type alias`)
    else if (ts.isEnumDeclaration(node)) found.push(`line ${at(node)}: enum`)
    else if (ts.isAsExpression(node)) found.push(`line ${at(node)}: as-cast`)
    else if (ts.isTypeAssertionExpression(node)) found.push(`line ${at(node)}: type assertion`)
    else if (
      (ts.isParameter(node) || ts.isVariableDeclaration(node) || ts.isPropertyDeclaration(node)) &&
      node.type
    ) {
      found.push(`line ${at(node)}: type annotation`)
    } else if (ts.isFunctionLike(node) && node.type) {
      found.push(`line ${at(node)}: return type annotation`)
    }
    ts.forEachChild(node, visit)
  }

  visit(sf)
  return found
}

describe('server runtime files stay JS-parseable', () => {
  const files = walk(SERVER_DIR)

  it('has files to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const file of files) {
    it(`${relative(SERVER_DIR, file)} contains no TypeScript-only syntax`, () => {
      const offenders = typeScriptOnlySyntax(readFileSync(file, 'utf8'), file)
      expect(
        offenders,
        `TypeScript-only syntax breaks consumer Rollup builds:\n  ${offenders.join('\n  ')}`,
      ).toEqual([])
    })
  }
})
