import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import InlineEditor from './InlineEditor.vue'

describe('InlineEditor mount', () => {
  bench('default mount', () => {
    const w = mount(InlineEditor)
    w.unmount()
  })
})
