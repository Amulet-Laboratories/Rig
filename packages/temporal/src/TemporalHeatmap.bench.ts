import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import TemporalHeatmap from './TemporalHeatmap.vue'

describe('TemporalHeatmap mount', () => {
  bench('default mount', () => {
    const w = mount(TemporalHeatmap)
    w.unmount()
  })
})
