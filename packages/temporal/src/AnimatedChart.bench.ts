import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimatedChart from './AnimatedChart.vue'

describe('AnimatedChart mount', () => {
  bench('default mount', () => {
    const w = mount(AnimatedChart)
    w.unmount()
  })
})
