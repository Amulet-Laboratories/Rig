import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Dot from './Dot.vue'

describe('Dot mount', () => {
  bench('default mount', () => {
    const w = mount(Dot)
    w.unmount()
  })
})
