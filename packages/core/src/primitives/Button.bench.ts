import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button mount', () => {
  bench('default button', () => {
    const w = mount(Button, { slots: { default: 'Click' } })
    w.unmount()
  })

  bench('button with variant + size', () => {
    const w = mount(Button, {
      props: { variant: 'primary', size: 'lg' },
      slots: { default: 'Submit' },
    })
    w.unmount()
  })

  bench('disabled + loading button', () => {
    const w = mount(Button, {
      props: { disabled: true, loading: true },
      slots: { default: 'Loading...' },
    })
    w.unmount()
  })
})
