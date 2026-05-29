import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import PointCloud from './PointCloud.vue'

describe('PointCloud mount', () => {
  bench('default mount', () => {
    const w = mount(PointCloud)
    w.unmount()
  })
})
