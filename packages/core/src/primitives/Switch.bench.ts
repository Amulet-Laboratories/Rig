import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from './Switch.vue'

describe('Switch mount', () => {
  bench('default mount', () => {
    const w = mount(Switch)
    w.unmount()
  })
})
