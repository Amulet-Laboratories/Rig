import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from './Toast.vue'

describe('Toast mount', () => {
  bench('default mount', () => {
    const w = mount(Toast)
    w.unmount()
  })
})
