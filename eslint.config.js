import vue from '@amulet-laboratories/config/eslint/vue'

export default [
  ...vue,
  {
    ignores: ['dist/', 'coverage/', 'node_modules/', 'hex/', 'config/'],
  },
]
