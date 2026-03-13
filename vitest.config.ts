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
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/*/src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,vue}'],
      exclude: [
        '**/*.test.ts',
        '**/*.bench.ts',
        '**/*.story.vue',
        '**/index.ts',
      ],
      reporter: ['text', 'lcov', 'json-summary'],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
    },
  },
  benchmark: {
    include: ['packages/*/src/**/*.bench.ts'],
  },
})
