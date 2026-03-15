import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import LineChart from './LineChart.vue'

describe('LineChart mount', () => {
  bench('default mount', () => {
    const w = mount(LineChart)
    w.unmount()
  })
})
