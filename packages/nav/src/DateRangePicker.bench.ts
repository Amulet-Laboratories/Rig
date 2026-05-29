import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import DateRangePicker from './DateRangePicker.vue'

describe('DateRangePicker mount', () => {
  bench('default mount', () => {
    const w = mount(DateRangePicker)
    w.unmount()
  })
})
