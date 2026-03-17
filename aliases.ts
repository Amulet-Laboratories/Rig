import { resolve } from 'node:path'

const PACKAGES = [
  'core',
  'layout',
  'nav',
  'editor',
  'lists',
  'menus',
  'extras',
  'shell',
  'data',
  'spatial',
  'temporal',
] as const

/**
 * Build the `@core`, `@layout`, … path alias map used by Vite, Vitest, and Histoire.
 *
 * @param root – absolute path to the repo root (typically `import.meta.dirname`)
 */
export function buildAliases(root: string): Record<string, string> {
  return Object.fromEntries(
    PACKAGES.map((pkg) => [`@${pkg}`, resolve(root, `packages/${pkg}/src`)]),
  )
}
