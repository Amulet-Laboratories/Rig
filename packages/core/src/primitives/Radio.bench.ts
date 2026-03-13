import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Radio from './Radio.vue'

describe('Radio mount', () => {
  bench('default mount', () => {
    const w = mount(Radio, { props: { value: 'opt1', name: 'radio-group' } })
    w.unmount()
  })
})
