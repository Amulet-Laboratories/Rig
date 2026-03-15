import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import AvatarGroup from './AvatarGroup.vue'

describe('AvatarGroup mount', () => {
  bench('default mount', () => {
    const w = mount(AvatarGroup)
    w.unmount()
  })
})
