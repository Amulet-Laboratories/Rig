import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname!, '..')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Rig package source aliases
      '@core': resolve(root, 'packages/core/src'),
      '@layout': resolve(root, 'packages/layout/src'),
      '@nav': resolve(root, 'packages/nav/src'),
      '@editor': resolve(root, 'packages/editor/src'),
      '@lists': resolve(root, 'packages/lists/src'),
      '@menus': resolve(root, 'packages/menus/src'),
      '@extras': resolve(root, 'packages/extras/src'),
      '@shell': resolve(root, 'packages/shell/src'),

      // Rig source styles
      '@rig': resolve(root, 'src'),

      // Hex
      '@hex': resolve(root, '..', 'Hex', 'src'),
      '@hex-dist': resolve(root, '..', 'Hex', 'dist'),

      // Lab app alias
      '@/lab': resolve(import.meta.dirname!, 'src'),

      // Health manifest -- served as static JSON
      '@health': resolve(root, '.health'),
    },
  },
  server: {
    port: 4410,
  },
})
