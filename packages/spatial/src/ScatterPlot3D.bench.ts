import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ScatterPlot3D from './ScatterPlot3D.vue'

describe('ScatterPlot3D mount', () => {
  bench('default mount', () => {
    const w = mount(ScatterPlot3D)
    w.unmount()
  })
})
