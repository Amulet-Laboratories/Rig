import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from './StatCard.vue'

describe('StatCard mount', () => {
  bench('default mount', () => {
    const w = mount(StatCard)
    w.unmount()
  })
})
