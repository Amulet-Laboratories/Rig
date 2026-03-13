import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import PanelBar from './PanelBar.vue'

describe('PanelBar mount', () => {
  bench('default mount', () => {
    const w = mount(PanelBar, { props: { tabs: [] } })
    w.unmount()
  })
})
