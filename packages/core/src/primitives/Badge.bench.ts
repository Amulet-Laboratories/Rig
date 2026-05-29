import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from './Badge.vue'

describe('Badge mount', () => {
  bench('default mount', () => {
    const w = mount(Badge)
    w.unmount()
  })
})
