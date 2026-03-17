import vue from '@amulet-laboratories/rig-config/eslint/vue'

export default [
  ...vue,
  {
    ignores: ['dist/', 'coverage/', 'node_modules/', 'hex/', 'config/', '.histoire/'],
  },
  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', __dirname: 'readonly' },
    },
    rules: {
      'no-console': 'off',
    },
  },
]
