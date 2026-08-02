# @amulet-laboratories/config

Shared lint, format, TypeScript and Vite configuration for Amulet Laboratories repositories.

This package lives at `Rig/config` and is published from the Rig repo. The standalone
`Config` repository is retired — it never got past three exports and nothing pointed at it.

## Install

```bash
pnpm add -D @amulet-laboratories/config eslint prettier
```

Or for local development with `file:` linking:

```json
{
  "devDependencies": {
    "@amulet-laboratories/config": "file:../Rig/config"
  }
}
```

## Exports

| Export                           | Purpose                                                                  |
| -------------------------------- | ------------------------------------------------------------------------ |
| `eslint/vue`                     | Vue 3 + TypeScript apps and libraries                                    |
| `eslint/nuxt`                    | `eslint/vue` + Nuxt build dirs, `no-undef` off                           |
| `eslint/base`                    | JS-only, no Vue                                                          |
| `prettier`                       | No semis, single quotes, trailing commas, 2-space, 100 cols              |
| `stylelint/base`                 | `stylelint-config-standard` + Tailwind at-rules, `postcss-html` for SFCs |
| `commitlint/base`                | Conventional commits                                                     |
| `tsconfig/base` · `tsconfig/vue` | Strict TS baselines                                                      |
| `vite/base`                      | Shared `resolve.alias` + terser build settings                           |
| `vite/compression`               | Brotli + gzip pre-compression plugins                                    |
| `vite/obfuscation`               | `javascript-obfuscator` settings for release builds                      |

## ESLint

### Vue + TypeScript (Obelisk, Rig)

Create `eslint.config.js`:

```js
import vue from '@amulet-laboratories/config/eslint/vue'

export default [...vue, { ignores: ['dist/', 'coverage/'] }]
```

`eslint/vue` declares `globals.browser` itself. Node-side files (build scripts, CLIs)
need their own block:

```js
{
  files: ['scripts/**/*.{js,mjs,ts}'],
  languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
}
```

### Nuxt sites (the content network)

Create `eslint.config.js`:

```js
export { default } from '@amulet-laboratories/config/eslint/nuxt'
```

That is the whole file. `eslint/nuxt` is `eslint/vue` plus the directories a Nuxt
app generates (`.nuxt/`, `.output/`, `.netlify/`, `dist/`), and it turns
`no-undef` off — Nuxt injects `useHead`, `useSeoMeta`, `computed` and friends at
build time, so they are not declarable globals and the rule reports every one of
them. TypeScript already catches genuinely undefined identifiers.

Add site-specific rules by spreading instead:

```js
import nuxt from '@amulet-laboratories/config/eslint/nuxt'

export default [...nuxt, { rules: { 'no-console': 'off' } }]
```

### Base / JS-only (Hex)

Create `eslint.config.js`:

```js
import base from '@amulet-laboratories/config/eslint/base'

export default [...base, { ignores: ['dist/'] }]
```

## Prettier

Create `prettier.config.js`:

```js
export { default } from '@amulet-laboratories/config/prettier'
```

Settings: no semicolons, single quotes, trailing commas, 2-space indent, 100-char print width.

## Stylelint

```js
export { default } from '@amulet-laboratories/config/stylelint/base'
```

Extend it by spreading `ignoreFiles` or overriding `rules`.

## Commitlint

```js
export { default } from '@amulet-laboratories/config/commitlint/base'
```

## Vite

```ts
import { baseConfig } from '@amulet-laboratories/config/vite/base'
import { compressionPlugins } from '@amulet-laboratories/config/vite/compression'

export default defineConfig({
  ...baseConfig,
  plugins: [vue(), ...compressionPlugins()],
})
```

`vite/base` sets `drop_console` and top-level mangling — it is a production-build
posture, not a neutral default. Merge it deliberately.

`vite/obfuscation` is a plain settings object, applied by a post-build script:

```js
import { obfuscationConfig } from '@amulet-laboratories/config/vite/obfuscation'
```

All three are plain JS with JSDoc types, not TypeScript — Node will not strip types
from files under `node_modules`, and the obfuscation script is plain Node.
