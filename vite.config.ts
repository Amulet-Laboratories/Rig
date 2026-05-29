import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { buildAliases } from './aliases'

// Per-package entry points so consumers can `import { Button } from
// '@amulet-laboratories/rig/core'` instead of pulling the entire 149-
// component barrel — which transitively drags in d3 / markdown-it /
// dompurify even when none of the chart, markdown, or sanitized-input
// components are used. The root barrel is preserved at `.` for backwards
// compatibility.
const PACKAGES = [
  'core',
  'layout',
  'nav',
  'editor',
  'lists',
  'menus',
  'extras',
  'shell',
  'data',
  'spatial',
  'temporal',
  'web',
] as const

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // Per-entry rolled-up .d.ts files. With multi-entry library mode the
      // `entryRoot` keeps one .d.ts per entry instead of trying to bundle
      // the whole project's type graph in one go (which OOMs).
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json',
      include: ['src/**/*.ts', 'packages/**/*.ts', 'packages/**/*.vue'],
      exclude: ['**/*.test.ts', '**/*.story.vue', '**/*.bench.ts'],
    }),
  ],
  resolve: {
    alias: buildAliases(__dirname),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...Object.fromEntries(
          PACKAGES.map((pkg) => [pkg, resolve(__dirname, `packages/${pkg}/src/index.ts`)]),
        ),
      },
      formats: ['es', 'cjs'],
      // index.mjs / index.cjs for the root barrel; core.mjs / core.cjs etc.
      // for the subpackage entries.
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'vue',
        '@iconify/vue',
        '@floating-ui/vue',
        'd3',
        /^d3-/,
        'dompurify',
        'markdown-it',
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@iconify/vue': 'IconifyVue',
          '@floating-ui/vue': 'FloatingUIVue',
          d3: 'd3',
          dompurify: 'DOMPurify',
          'markdown-it': 'markdownit',
        },
      },
    },
  },
})
