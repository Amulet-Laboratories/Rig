import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Heatmap from './Heatmap.vue'

describe('Heatmap mount', () => {
  bench('default mount', () => {
    const w = mount(Heatmap)
    w.unmount()
  })
})
