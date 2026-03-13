import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Toggle from './Toggle.vue'

describe('Toggle mount', () => {
  bench('default mount', () => {
    const w = mount(Toggle)
    w.unmount()
  })
})
