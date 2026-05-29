import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Kbd from './Kbd.vue'

describe('Kbd mount', () => {
  bench('default mount', () => {
    const w = mount(Kbd)
    w.unmount()
  })
})
