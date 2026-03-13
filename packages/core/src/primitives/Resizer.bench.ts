import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Resizer from './Resizer.vue'

describe('Resizer mount', () => {
  bench('default mount', () => {
    const w = mount(Resizer)
    w.unmount()
  })

  bench('mount horizontal', () => {
    const w = mount(Resizer, { props: { orientation: 'horizontal' } })
    w.unmount()
  })

  bench('mount vertical', () => {
    const w = mount(Resizer, { props: { orientation: 'vertical' } })
    w.unmount()
  })

  bench('mount with constraints', () => {
    const w = mount(Resizer, {
      props: { orientation: 'horizontal', minPosition: 100, maxPosition: 500 },
    })
    w.unmount()
  })
})

describe('Resizer keyboard interaction', () => {
  bench('keydown ArrowRight', async () => {
    const w = mount(Resizer, { props: { orientation: 'horizontal' } })
    await w.trigger('keydown', { key: 'ArrowRight' })
    w.unmount()
  })

  bench('keydown ArrowDown vertical', async () => {
    const w = mount(Resizer, { props: { orientation: 'vertical' } })
    await w.trigger('keydown', { key: 'ArrowDown' })
    w.unmount()
  })
})
