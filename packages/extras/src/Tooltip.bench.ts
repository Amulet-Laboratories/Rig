import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from './Tooltip.vue'

describe('Tooltip mount', () => {
  bench('default mount', () => {
    const w = mount(Tooltip)
    w.unmount()
  })
})
