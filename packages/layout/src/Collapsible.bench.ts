import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Collapsible from './Collapsible.vue'

describe('Collapsible mount', () => {
  bench('default mount', () => {
    const w = mount(Collapsible)
    w.unmount()
  })
})
