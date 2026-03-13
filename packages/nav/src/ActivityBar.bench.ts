import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityBar from './ActivityBar.vue'

describe('ActivityBar mount', () => {
  bench('default mount', () => {
    const w = mount(ActivityBar, { props: { items: [] } })
    w.unmount()
  })
})
