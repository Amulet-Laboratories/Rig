import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input mount', () => {
  bench('default mount', () => {
    const w = mount(Input)
    w.unmount()
  })
})
