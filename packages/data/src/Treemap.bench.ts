import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Treemap from './Treemap.vue'

describe('Treemap mount', () => {
  bench('default mount', () => {
    const w = mount(Treemap)
    w.unmount()
  })
})
