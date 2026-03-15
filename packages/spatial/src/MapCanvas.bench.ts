import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import MapCanvas from './MapCanvas.vue'

describe('MapCanvas mount', () => {
  bench('default mount', () => {
    const w = mount(MapCanvas)
    w.unmount()
  })
})
