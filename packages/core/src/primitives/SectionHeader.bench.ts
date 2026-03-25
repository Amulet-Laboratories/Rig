import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionHeader from './SectionHeader.vue'

describe('SectionHeader mount', () => {
  bench('default mount', () => {
    const w = mount(SectionHeader)
    w.unmount()
  })
})
