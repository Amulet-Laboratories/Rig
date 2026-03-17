import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import { buildAliases } from './aliases'

export default defineConfig({
  plugins: [HstVue()],

  setupFile: './histoire.setup.ts',

  storyMatch: ['packages/*/src/**/*.story.vue', 'stories/**/*.story.vue'],
  storyIgnored: ['**/node_modules/**', '**/dist/**'],

  // ── Tree ──────────────────────────────────────────────────────────────
  // Stories use `title` for tree path (e.g. "Core/Button").
  // Groups separate component stories from full-page demos.
  tree: {
    file: 'title',
    order: 'asc',
    groups: [
      { id: 'top', title: '' },
      { id: 'core', title: 'Core' },
      { id: 'layout', title: 'Layout' },
      { id: 'nav', title: 'Navigation' },
      { id: 'editor', title: 'Editor' },
      { id: 'lists', title: 'Lists' },
      { id: 'menus', title: 'Menus' },
      { id: 'extras', title: 'Extras' },
      { id: 'shell', title: 'Shell' },
      { id: 'data', title: 'Data' },
      { id: 'spatial', title: 'Spatial' },
      { id: 'temporal', title: 'Temporal' },
    ],
  },

  // ── Theme ─────────────────────────────────────────────────────────────
  // Amulet brand: dark-first, bronze primary, parchment-to-ink gray scale.
  theme: {
    title: 'Rig',
    defaultColorScheme: 'dark',
    storeColorScheme: true,
    darkClass: 'dark',
    colors: {
      primary: {
        50: '#fdf5ef',
        100: '#fbe6d5',
        200: '#f6c9aa',
        300: '#f0a474',
        400: '#e8773c',
        500: '#c9956d',
        600: '#b07a50',
        700: '#8f5e3b',
        800: '#6d4530',
        900: '#4a2e21',
      },
      gray: {
        50: '#f5f1ed',
        100: '#e8e1d9',
        200: '#cdc2b5',
        300: '#b0a08e',
        400: '#8c7a66',
        500: '#6b5c4c',
        600: '#534738',
        700: '#3a3128',
        800: '#241e18',
        900: '#0f0d0a',
      },
    },
  },

  // ── Responsive viewports ──────────────────────────────────────────────
  responsivePresets: [
    { label: 'Mobile S', width: 320, height: 568 },
    { label: 'Mobile M', width: 375, height: 667 },
    { label: 'Mobile L', width: 414, height: 896 },
    { label: 'Tablet', width: 768, height: 1024 },
    { label: 'Laptop', width: 1280, height: 800 },
    { label: 'Desktop', width: 1920, height: 1080 },
  ],

  // ── Background presets ────────────────────────────────────────────────
  backgroundPresets: [
    { label: 'VSCode', color: '#1f1f1f', contrastColor: '#cccccc' },
    { label: 'Garden', color: '#372d3b', contrastColor: '#ffffde' },
    { label: 'Transparent', color: 'transparent', contrastColor: '#888888' },
  ],

  // Apply .dark to sandbox iframe for scaffold theme compatibility
  sandboxDarkClass: 'dark',

  routerMode: 'history',

  // ── Vite ──────────────────────────────────────────────────────────────
  // Mirror path aliases from vite.config.ts so stories resolve correctly.
  vite: {
    plugins: [
      {
        name: 'histoire-auto-select-default',
        // Dev: redirect bare `/` to the Introduction story via middleware.
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url === '/') {
              req.url = '/story/stories-introduction-story-vue'
            }
            next()
          })
        },
        // Patch Histoire to auto-select the first variant when opening a story
        // instead of requiring the user to click "Default" manually.
        // Histoire only does this when `variants.length === 1`; we widen it to >= 1.
        enforce: 'pre' as const,
        transform(code: string, id: string) {
          if (id.includes('StoryView.vue') && code.includes('.variants.length === 1')) {
            return code.replace('.variants.length === 1', '.variants.length >= 1')
          }
        },
      },
    ],
    resolve: {
      alias: buildAliases(import.meta.dirname!),
    },
  },
})
