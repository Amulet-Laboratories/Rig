import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from './Skeleton.vue'

describe('Skeleton mount', () => {
  bench('default mount', () => {
    const w = mount(Skeleton)
    w.unmount()
  })
})
