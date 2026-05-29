import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBar from './StatusBar.vue'

describe('StatusBar mount', () => {
  bench('default mount', () => {
    const w = mount(StatusBar)
    w.unmount()
  })
})
