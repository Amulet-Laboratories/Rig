import { fileURLToPath } from 'node:url'
import postcssHtml from 'postcss-html'

// Resolved from *this* package, not the consumer's.
//
// stylelint resolves `extends` strings and `customSyntax` strings against
// `configBasedir`, which defaults to the directory of the config file that
// stylelint actually loaded — the consumer's `stylelint.config.js`. A shared
// config that spreads this object therefore re-parents both lookups, and the
// consumer gets `Could not find "stylelint-config-standard"` unless it also
// installs a dependency it never asked for. Handing stylelint an absolute path
// and a syntax object instead keeps the resolution where the dependency is
// declared.
const standard = fileURLToPath(import.meta.resolve('stylelint-config-standard'))

/** @type {import('stylelint').Config} */
export default {
  extends: [standard],
  ignoreFiles: ['dist/**', 'node_modules/**'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: postcssHtml,
    },
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'config', 'theme', 'source', 'utility'],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ],
    'import-notation': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'declaration-block-single-line-max-declarations': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
  },
}
