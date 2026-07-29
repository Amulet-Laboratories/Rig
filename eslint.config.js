import vue from '@amulet-laboratories/config/eslint/vue'

export default [
  ...vue,
  {
    ignores: [
      'dist/',
      'coverage/',
      'node_modules/',
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
