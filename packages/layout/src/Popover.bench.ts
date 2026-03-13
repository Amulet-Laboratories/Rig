import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Popover from './Popover.vue'

describe('Popover mount', () => {
  bench('default mount', () => {
    const w = mount(Popover)
    w.unmount()
  })
})
