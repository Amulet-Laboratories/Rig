import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ContextMenu from './ContextMenu.vue'

describe('ContextMenu mount', () => {
  bench('default mount', () => {
    const w = mount(ContextMenu, { props: { items: [] } })
    w.unmount()
  })
})
