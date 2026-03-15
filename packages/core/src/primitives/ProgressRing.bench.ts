import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressRing from './ProgressRing.vue'

describe('ProgressRing mount', () => {
  bench('default mount', () => {
    const w = mount(ProgressRing)
    w.unmount()
  })
})
