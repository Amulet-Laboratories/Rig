# @amulet-laboratories/config

Shared ESLint 9 and Prettier configuration for Amulet Laboratories repositories.

## Install

```bash
pnpm add -D @amulet-laboratories/config eslint prettier
```

Or for local development with `file:` linking:

```json
{
  "devDependencies": {
    "@amulet-laboratories/config": "file:../Config"
  }
}
```

## ESLint

### Vue + TypeScript (Obelisk, Rig)

Create `eslint.config.js`:

```js
import vue from '@amulet-laboratories/config/eslint/vue'

export default [
  ...vue,
  { ignores: ['dist/', 'coverage/'] },
]
```

### Base / JS-only (Hex)

Create `eslint.config.js`:

```js
import base from '@amulet-laboratories/config/eslint/base'

export default [
  ...base,
  { ignores: ['dist/'] },
]
```

## Prettier

Create `prettier.config.js`:

```js
export { default } from '@amulet-laboratories/config/prettier'
```

Settings: no semicolons, single quotes, trailing commas, 2-space indent, 100-char print width.
