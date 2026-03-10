import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'packages/core/src'),
      '@layout': resolve(__dirname, 'packages/layout/src'),
      '@nav': resolve(__dirname, 'packages/nav/src'),
      '@editor': resolve(__dirname, 'packages/editor/src'),
      '@lists': resolve(__dirname, 'packages/lists/src'),
      '@menus': resolve(__dirname, 'packages/menus/src'),
      '@extras': resolve(__dirname, 'packages/extras/src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Rig',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', '@iconify/vue', '@floating-ui/vue'],
      output: {
        globals: {
          vue: 'Vue',
          '@iconify/vue': 'IconifyVue',
          '@floating-ui/vue': 'FloatingUIVue',
        },
      },
    },
  },
})
