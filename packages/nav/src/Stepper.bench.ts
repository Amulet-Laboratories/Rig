import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Stepper from './Stepper.vue'

describe('Stepper mount', () => {
  bench('default mount', () => {
    const w = mount(Stepper)
    w.unmount()
  })
})
