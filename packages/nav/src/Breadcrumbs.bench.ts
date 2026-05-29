import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumbs from './Breadcrumbs.vue'

describe('Breadcrumbs mount', () => {
  bench('default mount', () => {
    const w = mount(Breadcrumbs)
    w.unmount()
  })
})
