#!/usr/bin/env node
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars */

/**
 * create-rig — scaffold a new Vue 3 + Rig + Hex + Tailwind project.
 *
 * Usage:
 *   pnpm create rig my-app
 *   pnpm create rig my-app --theme vscode
 *   pnpm create rig my-app --nuxt
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith('--')) ?? 'my-rig-app'
const theme = args.includes('--theme')
  ? args[args.indexOf('--theme') + 1] ?? 'vscode'
  : 'vscode'
const useNuxt = args.includes('--nuxt')

const dest = resolve(process.cwd(), name)

if (existsSync(dest)) {
  console.error(`Error: directory "${name}" already exists.`)
  process.exit(1)
}

console.log(`\n  Creating ${name}...`)
console.log(`  Theme: ${theme}`)
console.log(`  Framework: ${useNuxt ? 'Nuxt' : 'Vue + Vite'}\n`)

mkdirSync(dest, { recursive: true })

// ── package.json ────────────────────────────────────────────────────────────

const pkg = {
  name,
  private: true,
  version: '0.0.0',
  type: 'module',
  scripts: useNuxt
    ? { dev: 'nuxt dev', build: 'nuxt build', preview: 'nuxt preview' }
    : { dev: 'vite', build: 'vue-tsc --noEmit && vite build', preview: 'vite preview' },
  dependencies: {
    vue: '^3.5.0',
    ...(useNuxt ? { nuxt: '^3.0.0' } : {}),
  },
  devDependencies: {
    '@amulet-laboratories/rig': '^0.2.0',
    '@amulet-laboratories/hex': '^0.2.0',
    ...(useNuxt
      ? { '@amulet-laboratories/rig-nuxt': '^0.2.0' }
      : {
          '@vitejs/plugin-vue': '^6.0.0',
          typescript: '^5.7.0',
          vite: '^7.0.0',
          'vue-tsc': '^2.2.0',
        }),
  },
}

writeFileSync(resolve(dest, 'package.json'), `${JSON.stringify(pkg, null, 2)  }\n`)

// ── tsconfig.json ───────────────────────────────────────────────────────────

if (!useNuxt) {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      jsx: 'preserve',
      resolveJsonModule: true,
      isolatedModules: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      paths: { '@/*': ['./src/*'] },
    },
    include: ['src/**/*.ts', 'src/**/*.vue'],
  }
  writeFileSync(resolve(dest, 'tsconfig.json'), `${JSON.stringify(tsconfig, null, 2)  }\n`)
}

// ── vite.config.ts (Vite only) ─────────────────────────────────────────────

if (!useNuxt) {
  writeFileSync(
    resolve(dest, 'vite.config.ts'),
    `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
})
`,
  )
}

// ── nuxt.config.ts (Nuxt only) ─────────────────────────────────────────────

if (useNuxt) {
  writeFileSync(
    resolve(dest, 'nuxt.config.ts'),
    `export default defineNuxtConfig({
  modules: ['@amulet-laboratories/rig-nuxt'],
  css: ['@amulet-laboratories/hex/${theme === 'vscode' ? '' : theme}'],
})
`,
  )
}

// ── index.html (Vite only) ──────────────────────────────────────────────────

if (!useNuxt) {
  writeFileSync(
    resolve(dest, 'index.html'),
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
  )
}

// ── src/ ────────────────────────────────────────────────────────────────────

const srcDir = resolve(dest, useNuxt ? 'app' : 'src')
mkdirSync(srcDir, { recursive: true })

if (!useNuxt) {
  const themeImport =
    theme === 'vscode'
      ? `import '@amulet-laboratories/hex'`
      : `import '@amulet-laboratories/hex/${theme}'`

  writeFileSync(
    resolve(srcDir, 'main.ts'),
    `import { createApp } from 'vue'
import App from './App.vue'

${themeImport}

createApp(App).mount('#app')
`,
  )
}

writeFileSync(
  resolve(srcDir, 'App.vue'),
  `<script setup lang="ts">
import { ref } from 'vue'
${useNuxt ? '' : "import { Button, Modal, ConfigProvider } from '@amulet-laboratories/rig'\n"}
const open = ref(false)
</script>

<template>
  <ConfigProvider dir="ltr" locale="en-US">
    <div style="padding: 2rem; font-family: var(--font-sans)">
      <h1 style="color: var(--foreground); margin-bottom: 1rem">
        Welcome to ${name}
      </h1>
      <Button variant="primary" @click="open = true">Open Modal</Button>
      <Modal v-model:open="open" aria-label="Welcome">
        <p style="padding: 1rem; color: var(--foreground)">
          Rig + Hex is working.
        </p>
      </Modal>
    </div>
  </ConfigProvider>
</template>
`,
)

// ── Done ────────────────────────────────────────────────────────────────────

console.log(`  Done! Next steps:\n`)
console.log(`    cd ${name}`)
console.log(`    pnpm install`)
console.log(`    pnpm dev\n`)
