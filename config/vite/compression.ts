import { compression } from 'vite-plugin-compression2'
import type { Plugin } from 'vite'

/**
 * Pre-compression plugins for Brotli and gzip.
 * Netlify serves these when the client supports them.
 */
export function compressionPlugins(): Plugin[] {
  return [
    compression({ algorithm: 'brotliCompress' }) as Plugin,
    compression({ algorithm: 'gzip' }) as Plugin,
  ]
}
