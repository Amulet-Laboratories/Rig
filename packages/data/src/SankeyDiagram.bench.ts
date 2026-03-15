import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import SankeyDiagram from './SankeyDiagram.vue'

describe('SankeyDiagram mount', () => {
  bench('default mount', () => {
    const w = mount(SankeyDiagram)
    w.unmount()
  })
})
