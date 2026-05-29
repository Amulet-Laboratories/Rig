import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ResizablePanel from './ResizablePanel.vue'

describe('ResizablePanel mount', () => {
  bench('default mount', () => {
    const w = mount(ResizablePanel)
    w.unmount()
  })
})
