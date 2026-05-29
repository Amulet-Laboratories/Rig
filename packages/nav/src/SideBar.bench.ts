import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import SideBar from './SideBar.vue'

describe('SideBar mount', () => {
  bench('default mount', () => {
    const w = mount(SideBar)
    w.unmount()
  })
})
