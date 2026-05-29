import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeSlider from './RangeSlider.vue'

describe('RangeSlider mount', () => {
  bench('default mount', () => {
    const w = mount(RangeSlider)
    w.unmount()
  })
})
