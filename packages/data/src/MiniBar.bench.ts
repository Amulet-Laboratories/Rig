import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import MiniBar from './MiniBar.vue'

describe('MiniBar mount', () => {
  bench('default mount', () => {
    const w = mount(MiniBar)
    w.unmount()
  })
})
