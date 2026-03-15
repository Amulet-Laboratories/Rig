import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeBlock from './CodeBlock.vue'

describe('CodeBlock mount', () => {
  bench('default mount', () => {
    const w = mount(CodeBlock)
    w.unmount()
  })
})
