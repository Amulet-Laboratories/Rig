import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import RadioGroup from './RadioGroup.vue'

describe('RadioGroup mount', () => {
  bench('default mount', () => {
    const w = mount(RadioGroup)
    w.unmount()
  })
})
