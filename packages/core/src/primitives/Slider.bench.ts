import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Slider from './Slider.vue'

describe('Slider mount', () => {
  bench('default mount', () => {
    const w = mount(Slider)
    w.unmount()
  })
})
