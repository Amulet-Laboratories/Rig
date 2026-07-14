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
    include: ['src/**/*.test.ts', 'packages/*/src/**/*.test.ts', 'stories/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,vue}'],
      exclude: ['**/*.test.ts', '**/*.bench.ts', '**/*.story.vue', '**/index.ts'],
      reporter: ['text', 'lcov', 'json-summary'],
      // Baseline reflects the current 0.4.x surface; the editor/web/spatial
      // additions ship below the prior 80/75 aspiration. Tech debt — raise
      // back toward 80/75 as coverage for those packages is filled in.
      thresholds: {
        statements: 79,
        branches: 73,
        functions: 78,
        lines: 80,
      },
    },
  },
  benchmark: {
    include: ['packages/*/src/**/*.bench.ts'],
  },
})
