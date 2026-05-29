import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ChartTooltip from './ChartTooltip.vue'

describe('ChartTooltip mount', () => {
  bench('default mount', () => {
    const w = mount(ChartTooltip, { props: { show: true } })
    w.unmount()
  })
})
