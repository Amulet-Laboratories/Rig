import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import EditorWorkbench from './EditorWorkbench.vue'

describe('EditorWorkbench mount', () => {
  bench('default mount', () => {
    const w = mount(EditorWorkbench, { props: { tabs: [] } })
    w.unmount()
  })
})
