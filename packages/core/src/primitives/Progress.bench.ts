import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Progress from './Progress.vue'

describe('Progress mount', () => {
  bench('default mount', () => {
    const w = mount(Progress)
    w.unmount()
  })
})
