import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import BarChart from './BarChart.vue'

describe('BarChart mount', () => {
  bench('default mount', () => {
    const w = mount(BarChart)
    w.unmount()
  })
})
