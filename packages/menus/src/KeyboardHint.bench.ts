import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import KeyboardHint from './KeyboardHint.vue'

describe('KeyboardHint mount', () => {
  bench('default mount', () => {
    const w = mount(KeyboardHint, { props: { shortcut: 'Ctrl+S' } })
    w.unmount()
  })
})
