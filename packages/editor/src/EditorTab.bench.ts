import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorTab from './EditorTab.vue'

describe('EditorTab mount', () => {
  bench('default mount', () => {
    const w = mount(EditorTab, { props: { tab: { id: 't1', label: 'Tab 1' } } })
    w.unmount()
  })
})
