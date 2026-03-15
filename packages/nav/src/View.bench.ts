import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import View from './View.vue'

describe('View mount', () => {
  bench('default mount', () => {
    const w = mount(View, { props: { title: 'Test', actions: [] } })
    w.unmount()
  })
})
