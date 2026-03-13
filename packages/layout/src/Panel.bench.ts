import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Panel from './Panel.vue'

describe('Panel mount', () => {
  bench('default mount', () => {
    const w = mount(Panel)
    w.unmount()
  })
})
