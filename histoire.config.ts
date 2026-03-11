import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: '/src/histoire/setup.ts',
  storyMatch: ['stories/**/*.story.vue'],
  theme: {
    title: 'Rig — Component Library',
    colors: {
      primary: { 50: '#fdf4ee', 100: '#f9e3d0', 200: '#f3c49e', 300: '#eaa06a', 400: '#c9956d', 500: '#a0714a', 600: '#7d5639', 700: '#5c3f2b', 800: '#3e2b1e', 900: '#221812' },
    },
  },
  tree: {
    groups: [
      { id: 'showcase', title: 'Showcase' },
      { id: 'core', title: 'Core' },
      { id: 'layout', title: 'Layout' },
      { id: 'nav', title: 'Navigation' },
      { id: 'lists', title: 'Lists' },
      { id: 'menus', title: 'Menus' },
      { id: 'editor', title: 'Editor' },
      { id: 'extras', title: 'Extras' },
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
      },
    },
  },
})
