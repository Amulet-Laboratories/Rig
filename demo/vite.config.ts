import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname!, '..')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Rig package source aliases (same as main vite.config + histoire)
      '@core': resolve(root, 'packages/core/src'),
      '@layout': resolve(root, 'packages/layout/src'),
      '@nav': resolve(root, 'packages/nav/src'),
      '@editor': resolve(root, 'packages/editor/src'),
      '@lists': resolve(root, 'packages/lists/src'),
      '@menus': resolve(root, 'packages/menus/src'),
      '@extras': resolve(root, 'packages/extras/src'),
      '@shell': resolve(root, 'packages/shell/src'),

      // Rig source styles (base + scaffold CSS)
      '@rig': resolve(root, 'src'),

      // Hex source alias (for theme tokens referenced in showcases)
      '@hex': resolve(root, '..', 'Hex', 'src'),

      // Hex dist alias (for built theme CSS loaded by theme switcher)
      '@hex-dist': resolve(root, '..', 'Hex', 'dist'),

      // Showcase source (now lives inside demo app)
      '@showcase': resolve(import.meta.dirname!, 'src/showcases'),

      // Demo app alias
      '@/demo': resolve(import.meta.dirname!, 'src'),
    },
  },
  server: {
    port: 4400,
  },
})
