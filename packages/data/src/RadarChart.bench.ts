import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import RadarChart from './RadarChart.vue'

describe('RadarChart mount', () => {
  bench('default mount', () => {
    const w = mount(RadarChart)
    w.unmount()
  })
})
