import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from './Icon.vue'

describe('Icon mount', () => {
  bench('default mount', () => {
    const w = mount(Icon)
    w.unmount()
  })
})
