import { resolve } from 'node:path'
import type { UserConfig } from 'vite'

/**
 * Shared Vite base configuration for all Amulet Laboratories projects.
 * Consumers merge this with their project-specific config.
 */
export const baseConfig: UserConfig = {
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
    },
  },
  build: {
    sourcemap: 'hidden',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
  },
}
