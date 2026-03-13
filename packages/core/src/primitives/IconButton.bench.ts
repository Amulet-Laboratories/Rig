import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import IconButton from './IconButton.vue'

describe('IconButton mount', () => {
  bench('default mount', () => {
    const w = mount(IconButton, { props: { ariaLabel: 'Test' } })
    w.unmount()
  })
})
