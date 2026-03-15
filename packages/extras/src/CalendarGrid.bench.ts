import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import CalendarGrid from './CalendarGrid.vue'

describe('CalendarGrid mount', () => {
  bench('default mount', () => {
    const w = mount(CalendarGrid)
    w.unmount()
  })
})
