import base from '@amulet-laboratories/config/eslint/base'

export default [
  ...base,
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    files: ['**/*.mjs', '**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
]
