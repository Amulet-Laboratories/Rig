import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationCenter from './NotificationCenter.vue'

describe('NotificationCenter mount', () => {
  bench('default mount', () => {
    const w = mount(NotificationCenter)
    w.unmount()
  })
})
