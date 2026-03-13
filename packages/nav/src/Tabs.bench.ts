import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from './Tabs.vue'

describe('Tabs mount', () => {
  bench('default mount', () => {
    const w = mount(Tabs)
    w.unmount()
  })
})
