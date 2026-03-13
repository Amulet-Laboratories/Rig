import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from './Checkbox.vue'

describe('Checkbox mount', () => {
  bench('default mount', () => {
    const w = mount(Checkbox)
    w.unmount()
  })
})
