import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card mount', () => {
  bench('default mount', () => {
    const w = mount(Card)
    w.unmount()
  })
})
