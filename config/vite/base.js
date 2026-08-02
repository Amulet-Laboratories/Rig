import { resolve } from 'node:path'

/**
 * Shared Vite base configuration for all Amulet Laboratories projects.
 * Consumers merge this with their project-specific config.
 *
 * This is a production-build posture, not a neutral default: it drops
 * `console`/`debugger` and mangles top-level names. Merge it deliberately.
 *
 * Plain JS with JSDoc on purpose — see this package's CLAUDE.md. Vite could
 * compile a `.ts` file here, but `vite/obfuscation` is imported by a plain
 * Node script, and Node refuses to strip types from anything under
 * `node_modules`. Keeping all three consistent avoids the trap.
 *
 * @type {import('vite').UserConfig}
 */
export const baseConfig = {
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
