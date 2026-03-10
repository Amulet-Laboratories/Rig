import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

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
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/*/src/**/*.test.ts'],
  },
})
