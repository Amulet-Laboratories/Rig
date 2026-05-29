import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import PeekView from './PeekView.vue'

describe('PeekView mount', () => {
  bench('default mount', () => {
    const w = mount(PeekView)
    w.unmount()
  })
})
