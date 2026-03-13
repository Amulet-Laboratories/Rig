import vue from '@amulet-laboratories/config/eslint/vue'

export default [
  ...vue,
  {
    ignores: ['dist/', 'demo/dist/', 'coverage/', 'node_modules/'],
  },
]
