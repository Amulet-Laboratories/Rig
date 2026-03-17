import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { buildAliases } from '../aliases'

const repoRoot = resolve(import.meta.dirname, '..')

export default defineConfig({
  root: import.meta.dirname,
  plugins: [vue()],
  resolve: {
    alias: buildAliases(repoRoot),
  },
  server: {
    port: 5200,
    strictPort: true,
  },
})
