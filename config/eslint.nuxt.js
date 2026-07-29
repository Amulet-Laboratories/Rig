// Shared ESLint config for the Nuxt content-network sites.
//
// This is `eslint/vue` plus the build directories a Nuxt app generates. Until
// 2026-07-28 each of the six affiliate sites carried its own 59-line
// `eslint.config.js`, all byte-identical and all a near-copy of `eslint.vue.js`
// in this package. A site's config is now:
//
//   export { default } from '@amulet-laboratories/config/eslint/nuxt'
//
// Add a site-specific block by spreading instead:
//
//   import nuxt from '@amulet-laboratories/config/eslint/nuxt'
//   export default [...nuxt, { rules: { … } }]
import vue from './eslint.vue.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['.nuxt/', '.output/', '.netlify/', 'dist/', 'node_modules/'],
  },
  ...vue,
  {
    rules: {
      // `eslint/vue` pulls in js.configs.recommended, which turns on `no-undef`.
      // Nuxt injects useHead/useSeoMeta/computed/… at build time, so they are
      // not declarable globals and every one reads as undefined — 42 errors on
      // a clean site. TypeScript already catches genuinely undefined
      // identifiers, so the rule earns nothing here.
      //
      // The alternative is the @nuxt/eslint module, which generates a config
      // with the auto-import globals filled in. Worth adopting if these sites
      // ever want the rule back.
      'no-undef': 'off',
    },
  },
]
