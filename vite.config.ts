import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { buildAliases } from './aliases'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  resolve: {
    alias: buildAliases(__dirname),
  },
  build: {
    sourcemap: true,
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
