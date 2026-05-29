import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import SplitView from './SplitView.vue'

describe('SplitView mount', () => {
  bench('2 panels', () => {
    const w = mount(SplitView, { props: { sizes: [200, 200] } })
    w.unmount()
  })

  bench('3 panels', () => {
    const w = mount(SplitView, { props: { sizes: [200, 200, 200] } })
    w.unmount()
  })

  bench('4 panels', () => {
    const w = mount(SplitView, { props: { sizes: [200, 200, 200, 200] } })
    w.unmount()
  })

  bench('5 panels', () => {
    const w = mount(SplitView, { props: { sizes: [200, 200, 200, 200, 200] } })
    w.unmount()
  })
})

describe('SplitView resize', () => {
  bench('update sizes prop', async () => {
    const w = mount(SplitView, { props: { sizes: [300, 300] } })
    await w.setProps({ sizes: [400, 200] })
    w.unmount()
  })
})
