import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import DropdownMenu from './DropdownMenu.vue'

describe('DropdownMenu mount', () => {
  bench('default mount', () => {
    const w = mount(DropdownMenu, { props: { items: [] } })
    w.unmount()
  })
})
