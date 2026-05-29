import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Timeline from './Timeline.vue'

describe('Timeline mount', () => {
  bench('default mount', () => {
    const w = mount(Timeline)
    w.unmount()
  })
})
