import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelineScrubber from './TimelineScrubber.vue'

describe('TimelineScrubber mount', () => {
  bench('default mount', () => {
    const w = mount(TimelineScrubber)
    w.unmount()
  })
})
