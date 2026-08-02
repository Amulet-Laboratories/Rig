import vue from '@amulet-laboratories/config/eslint/vue'

export default [
  ...vue,
  {
    ignores: [
      // Glob-prefixed on purpose: in ESLint flat config a bare `dist/` matches
      // only the root directory, so nested build output (demos/dist) was still
      // being linted. Building the demos locally produced ~1350 phantom errors
      // in minified bundles — invisible in CI, which never builds before
      // linting, and thoroughly confusing anywhere else.
      '**/dist/',
      '**/coverage/',
      '**/node_modules/',
      'hex/',
      'config/',
      '.histoire/',
      'deploy/',
      'landing/',
      'nuxt/',
      'src/generated/',
    ],
  },
  {
    // Node-side tooling: build scripts and the `rig` CLI. Both legitimately use
    // process/console, which the browser-oriented base config does not declare.
    files: ['scripts/**/*.{js,mjs,ts}', 'bin/**/*.{js,mjs}'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', __dirname: 'readonly' },
    },
    rules: {
      'no-console': 'off',
    },
  },
]
