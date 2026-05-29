# @amulet-laboratories/rig-nuxt

Nuxt module for [@amulet-laboratories/rig](https://github.com/Amulet-Laboratories/rig) — auto-imports all 98 components and 16 composables with full tree-shaking and SSR support.

## Install

```bash
pnpm add @amulet-laboratories/rig @amulet-laboratories/rig-nuxt
# Optional — theme CSS
pnpm add @amulet-laboratories/hex
```

## Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@amulet-laboratories/rig-nuxt'],

  // Optional configuration
  rig: {
    // prefix: 'Rig',      // RigButton, RigModal, etc.
    // composables: true,   // auto-import composables (default)
  },
})
```

## Usage

Components and composables are available everywhere without imports:

```vue
<template>
  <Button variant="primary" @click="open = true">Open</Button>
  <Modal v-model:open="open" aria-label="Example">
    <p>Content</p>
  </Modal>
</template>

<script setup lang="ts">
const open = ref(false)
const { activeShortcuts } = useKeyboard({ 'Mod+K': () => (open.value = true) })
</script>
```

## Theming

Import a Hex theme in your Nuxt app entry:

```ts
// plugins/hex.client.ts
import '@amulet-laboratories/hex/vscode'
```

Or in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['@amulet-laboratories/hex/vscode'],
})
```

## Prefix

Avoid name collisions with the `prefix` option:

```ts
export default defineNuxtConfig({
  rig: { prefix: 'Rig' },
})
```

Then use `<RigButton>`, `<RigModal>`, etc. in templates.
