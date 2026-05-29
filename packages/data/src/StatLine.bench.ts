import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import StatLine from './StatLine.vue'

describe('StatLine mount', () => {
  bench('default mount', () => {
    const w = mount(StatLine)
    w.unmount()
  })
})
