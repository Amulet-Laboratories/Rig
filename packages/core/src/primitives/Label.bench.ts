import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Label from './Label.vue'

describe('Label mount', () => {
  bench('default mount', () => {
    const w = mount(Label)
    w.unmount()
  })
})
