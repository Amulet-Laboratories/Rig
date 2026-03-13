import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: '/src/histoire/setup.ts',
  storyMatch: [
    'stories/core/**/*.story.vue',
    'stories/layout/**/*.story.vue',
    'stories/nav/**/*.story.vue',
    'stories/editor/**/*.story.vue',
    'stories/lists/**/*.story.vue',
    'stories/menus/**/*.story.vue',
    'stories/extras/**/*.story.vue',
  ],
  theme: {
    title: 'Rig — Component Library',
    colors: {
      primary: { 50: '#fdf4ee', 100: '#f9e3d0', 200: '#f3c49e', 300: '#eaa06a', 400: '#c9956d', 500: '#a0714a', 600: '#7d5639', 700: '#5c3f2b', 800: '#3e2b1e', 900: '#221812' },
    },
    defaultColorScheme: 'dark',
  },
  backgroundPresets: [
    { label: 'Scaffold', color: '#1a1a1a', contrastColor: '#d4d4d4' },
    { label: 'Ink', color: '#0f0d0a', contrastColor: '#f5f1ed' },
    { label: 'Parchment', color: '#f5f1ed', contrastColor: '#0f0d0a' },
    { label: 'Transparent', color: 'transparent', contrastColor: '#888' },
  ],
  tree: {
    groups: [
      { id: 'core', title: 'Core', include: (file) => file.path.includes('stories/core/') },
      { id: 'layout', title: 'Layout', include: (file) => file.path.includes('stories/layout/') },
      { id: 'nav', title: 'Navigation', include: (file) => file.path.includes('stories/nav/') },
      { id: 'lists', title: 'Lists', include: (file) => file.path.includes('stories/lists/') },
      { id: 'menus', title: 'Menus', include: (file) => file.path.includes('stories/menus/') },
      { id: 'editor', title: 'Editor', include: (file) => file.path.includes('stories/editor/') },
      { id: 'extras', title: 'Extras', include: (file) => file.path.includes('stories/extras/') },
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@core': resolve(import.meta.dirname!, 'packages/core/src'),
        '@layout': resolve(import.meta.dirname!, 'packages/layout/src'),
        '@nav': resolve(import.meta.dirname!, 'packages/nav/src'),
        '@editor': resolve(import.meta.dirname!, 'packages/editor/src'),
        '@lists': resolve(import.meta.dirname!, 'packages/lists/src'),
        '@menus': resolve(import.meta.dirname!, 'packages/menus/src'),
        '@extras': resolve(import.meta.dirname!, 'packages/extras/src'),
        '@shell': resolve(import.meta.dirname!, 'packages/shell/src'),
      },
    },
  },
})
