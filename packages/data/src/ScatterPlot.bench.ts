import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ScatterPlot from './ScatterPlot.vue'

describe('ScatterPlot mount', () => {
  bench('default mount', () => {
    const w = mount(ScatterPlot)
    w.unmount()
  })
})
