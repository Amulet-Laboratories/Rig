import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarNavList from './SidebarNavList.vue'

const items = [
  { id: 'a', label: 'Alpha', icon: 'mdi:home' },
  { id: 'b', label: 'Beta', icon: 'mdi:cog' },
  { id: 'c', label: 'Gamma', icon: 'mdi:chart' },
]

describe('SidebarNavList mount', () => {
  bench('default mount', () => {
    const w = mount(SidebarNavList, { props: { items } })
    w.unmount()
  })
})
