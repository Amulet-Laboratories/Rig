import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import DiffViewer from './DiffViewer.vue'

describe('DiffViewer mount', () => {
  bench('default mount', () => {
    const w = mount(DiffViewer)
    w.unmount()
  })
})
