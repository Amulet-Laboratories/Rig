# Config — @amulet-laboratories/config

Shared ESLint 9 flat config and Prettier config for all Amulet Laboratories repos.

## Structure

- `eslint.vue.js` — Full config for Vue 3 + TypeScript repos (Obelisk, Rig)
- `eslint.base.js` — Minimal config for non-Vue repos (Hex)
- `prettier.js` — Prettier config (no semis, single quotes, trailing commas, 2-space indent, 100 char width)

## Usage

Consumers add `@amulet-laboratories/config` as a devDependency via `"file:../Config"` and create thin config files that import and re-export:

```js
// eslint.config.js
import vue from '@amulet-laboratories/config/eslint/vue'
export default [...vue, { ignores: ['dist/'] }]
```

```js
// prettier.config.js
export { default } from '@amulet-laboratories/config/prettier'
```

## Conventions

- ESLint 9 flat config only — no legacy `.eslintrc`
- All style rules handled by Prettier — ESLint only enforces logic/correctness
- `eslint-config-prettier` disables conflicting ESLint rules
- Vue: `script-setup` only, `[script, template, style]` block order enforced
- TypeScript: consistent type imports, no explicit any (warn), unused vars (error with `_` prefix escape)
