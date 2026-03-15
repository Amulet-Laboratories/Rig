import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

const __dirname = import.meta.dirname!

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'packages/core/src'),
      '@layout': resolve(__dirname, 'packages/layout/src'),
      '@nav': resolve(__dirname, 'packages/nav/src'),
      '@editor': resolve(__dirname, 'packages/editor/src'),
      '@lists': resolve(__dirname, 'packages/lists/src'),
      '@menus': resolve(__dirname, 'packages/menus/src'),
      '@extras': resolve(__dirname, 'packages/extras/src'),
      '@shell': resolve(__dirname, 'packages/shell/src'),
      '@data': resolve(__dirname, 'packages/data/src'),
      '@spatial': resolve(__dirname, 'packages/spatial/src'),
      '@temporal': resolve(__dirname, 'packages/temporal/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['scripts/generate-comparison.test.ts'],
  },
})
