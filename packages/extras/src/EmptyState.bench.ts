import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState mount', () => {
  bench('default mount', () => {
    const w = mount(EmptyState)
    w.unmount()
  })
})
