import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ShellGrid from './ShellGrid.vue'

describe('ShellGrid mount', () => {
  bench('default mount', () => {
    const w = mount(ShellGrid)
    w.unmount()
  })
})
