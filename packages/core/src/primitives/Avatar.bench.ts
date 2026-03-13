import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'

describe('Avatar mount', () => {
  bench('default mount', () => {
    const w = mount(Avatar, { props: { name: 'Test User' } })
    w.unmount()
  })
})
