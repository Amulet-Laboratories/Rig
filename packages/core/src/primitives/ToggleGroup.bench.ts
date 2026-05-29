import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ToggleGroup from './ToggleGroup.vue'

describe('ToggleGroup mount', () => {
  bench('default mount', () => {
    const w = mount(ToggleGroup, { props: { modelValue: '' } })
    w.unmount()
  })
})
