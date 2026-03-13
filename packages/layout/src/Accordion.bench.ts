import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Accordion from './Accordion.vue'

describe('Accordion mount', () => {
  bench('default mount', () => {
    const w = mount(Accordion)
    w.unmount()
  })
})
