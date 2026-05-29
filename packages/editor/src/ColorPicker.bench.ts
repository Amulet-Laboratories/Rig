import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPicker from './ColorPicker.vue'

describe('ColorPicker mount', () => {
  bench('default mount', () => {
    const w = mount(ColorPicker)
    w.unmount()
  })
})
