import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from './Divider.vue'

describe('Divider mount', () => {
  bench('default mount', () => {
    const w = mount(Divider)
    w.unmount()
  })
})
