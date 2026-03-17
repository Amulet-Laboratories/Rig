import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { buildAliases } from './aliases'

const __dirname = import.meta.dirname!

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: buildAliases(__dirname),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/*/src/**/*.test.ts', 'stories/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,vue}'],
      exclude: ['**/*.test.ts', '**/*.bench.ts', '**/*.story.vue', '**/index.ts'],
      reporter: ['text', 'lcov', 'json-summary'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
  benchmark: {
    include: ['packages/*/src/**/*.bench.ts'],
  },
})
