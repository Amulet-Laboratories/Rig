import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Sparkline from './Sparkline.vue'

describe('Sparkline mount', () => {
  bench('default mount', () => {
    const w = mount(Sparkline)
    w.unmount()
  })
})
