import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ChartEmpty from './ChartEmpty.vue'

describe('ChartEmpty mount', () => {
  bench('default mount', () => {
    const w = mount(ChartEmpty)
    w.unmount()
  })
})
