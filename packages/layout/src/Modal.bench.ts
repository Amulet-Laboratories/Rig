import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'

describe('Modal mount', () => {
  bench('mount with open=false', () => {
    const w = mount(Modal, { props: { open: false } })
    w.unmount()
  })

  bench('mount with open=true', () => {
    const w = mount(Modal, {
      props: { open: true, ariaLabel: 'Benchmark modal' },
      global: { stubs: { teleport: true } },
    })
    w.unmount()
  })
})

describe('Modal toggle', () => {
  bench('open/close cycle', async () => {
    const w = mount(Modal, {
      props: { open: false },
      global: { stubs: { teleport: true } },
    })
    await w.setProps({ open: true })
    await w.setProps({ open: false })
    w.unmount()
  })
})
