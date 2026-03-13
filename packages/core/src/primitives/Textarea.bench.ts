import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea from './Textarea.vue'

describe('Textarea mount', () => {
  bench('default mount', () => {
    const w = mount(Textarea)
    w.unmount()
  })
})
