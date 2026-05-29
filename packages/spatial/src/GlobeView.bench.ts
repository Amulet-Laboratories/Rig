import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import GlobeView from './GlobeView.vue'

describe('GlobeView mount', () => {
  bench('default mount', () => {
    const w = mount(GlobeView)
    w.unmount()
  })
})
