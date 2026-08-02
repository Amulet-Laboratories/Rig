import { compression } from 'vite-plugin-compression2'

/**
 * Pre-compression plugins for Brotli and gzip.
 * Netlify serves these when the client supports them.
 *
 * @returns {import('vite').Plugin[]}
 */
export function compressionPlugins() {
  return [
    /** @type {import('vite').Plugin} */ (compression({ algorithm: 'brotliCompress' })),
    /** @type {import('vite').Plugin} */ (compression({ algorithm: 'gzip' })),
  ]
}
