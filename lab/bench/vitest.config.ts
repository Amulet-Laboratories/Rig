/**
 * Component Comparison Benchmark Harness
 *
 * Installs, mounts and measures Rig components against Vue-compatible competitors.
 * Outputs .health/comparison.json for Lab consumption.
 *
 * Usage:
 *   pnpm bench:compare          # run benchmarks
 *   pnpm compare:generate       # static analysis + merge results
 */
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname!, '../..')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Rig packages
      '@core': resolve(root, 'packages/core/src'),
      '@layout': resolve(root, 'packages/layout/src'),
      '@nav': resolve(root, 'packages/nav/src'),
      '@editor': resolve(root, 'packages/editor/src'),
      '@lists': resolve(root, 'packages/lists/src'),
      '@menus': resolve(root, 'packages/menus/src'),
      '@extras': resolve(root, 'packages/extras/src'),
      '@shell': resolve(root, 'packages/shell/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['lab/bench/**/*.test.ts'],
    setupFiles: [resolve(import.meta.dirname!, 'setup.ts')],
  },
})
