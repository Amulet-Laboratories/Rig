import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Menubar from './Menubar.vue'

describe('Menubar mount', () => {
  bench('default mount', () => {
    const w = mount(Menubar, { props: { items: [] } })
    w.unmount()
  })
})
