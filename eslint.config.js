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
    ],
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
