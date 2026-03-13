import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionBar from './ActionBar.vue'

describe('ActionBar mount', () => {
  bench('default mount', () => {
    const w = mount(ActionBar, { props: { actions: [] } })
    w.unmount()
  })
})
