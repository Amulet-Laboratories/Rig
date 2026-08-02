# Config — @amulet-laboratories/config

Shared lint, format, TypeScript and Vite config for all Amulet Laboratories repos.
Lives here, in the Rig monorepo, and publishes from it. **The standalone `Config`
repo is retired** — it stalled at three exports and nothing ever consumed it.

## Structure

- `eslint.vue.js` — Vue 3 + TypeScript (Rig, Obelisk, AmuletLabs.org)
- `eslint.nuxt.js` — `eslint.vue.js` + Nuxt build dirs, `no-undef` off (the 7 content sites)
- `eslint.base.js` — JS-only, no Vue (Hex)
- `prettier.js` — no semis, single quotes, trailing commas, 2-space, 100 cols
- `stylelint/base.js` — standard + Tailwind at-rules + `postcss-html` for SFCs
- `commitlint/base.js` — conventional commits
- `tsconfig/{base,vue}.json` — strict TS baselines
- `vite/{base,compression,obfuscation}.js` — build posture for the Vite SPAs

## Usage

Consumers depend on `@amulet-laboratories/config` from npm and write thin re-exports:

```js
// eslint.config.js
import vue from '@amulet-laboratories/config/eslint/vue'
export default [...vue, { ignores: ['dist/'] }]
```

```js
// prettier.config.js
export { default } from '@amulet-laboratories/config/prettier'
```

Inside this monorepo, packages use `workspace:*` instead.

## Conventions

- ESLint 9/10 flat config only — no legacy `.eslintrc`
- All style rules handled by Prettier — ESLint only enforces logic/correctness
- `eslint-config-prettier` disables conflicting ESLint rules
- Vue: `script-setup` only, `[script, template, style]` block order enforced
- TypeScript: consistent type imports, no explicit any (warn), unused vars (error with `_` prefix escape)

## Gotchas

**`eslint/vue` owns `globals.browser`, explicitly.** eslint-plugin-vue 9 shipped browser
globals inside its own `flat/base`, so consumers got them without asking. v10 dropped
that, and `no-undef` — which this config turns on via `js.configs.recommended` — then
fired on `window`/`document`/`HTMLElement` fleet-wide (338 errors in Rig alone). The
globals are declared here now. Don't remove them expecting a plugin to cover it.

**Don't add an export without a consumer.** Before 0.3.0 this package had 13 exports and
8 of them were imported by nothing — `vite/security-headers` generated Netlify headers
for a site whose `netlify.toml` says in a comment that `public/_headers` is the single
source of truth, and `tsconfig/node` had an `outDir`/`declaration` shape no repo here
wants. Both were removed. An export nobody imports is drift waiting to happen.

**The Vite exports are plain JS with JSDoc, not TypeScript.** `vite/obfuscation` is
imported by a plain Node post-build script, and Node refuses to strip types from
anything under `node_modules` — a `.ts` file there is unimportable, exactly the trap
`nuxt/src/runtime/**` already hit in this repo. All three stay `.js` so the rule is
one rule and not a per-file judgement call.

## Releasing

Publishing is CI-only, from the Rig repo, on a `v*` tag via trusted publishing (OIDC).
Never `npm publish` by hand. A version bump here ships with whatever Rig tag comes next.
