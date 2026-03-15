import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import PulseIndicator from './PulseIndicator.vue'

describe('PulseIndicator mount', () => {
  bench('default mount', () => {
    const w = mount(PulseIndicator)
    w.unmount()
  })
})
