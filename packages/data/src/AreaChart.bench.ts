import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import AreaChart from './AreaChart.vue'

describe('AreaChart mount', () => {
  bench('default mount', () => {
    const w = mount(AreaChart)
    w.unmount()
  })
})
