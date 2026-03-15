import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePicker from './DatePicker.vue'

describe('DatePicker mount', () => {
  bench('default mount', () => {
    const w = mount(DatePicker)
    w.unmount()
  })
})
