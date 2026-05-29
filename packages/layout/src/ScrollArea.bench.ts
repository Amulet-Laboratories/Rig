import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollArea from './ScrollArea.vue'

describe('ScrollArea mount', () => {
  bench('default mount', () => {
    const w = mount(ScrollArea)
    w.unmount()
  })

  bench('mount with vertical prop', () => {
    const w = mount(ScrollArea, { props: { vertical: true } })
    w.unmount()
  })

  bench('mount with both scrollbars', () => {
    const w = mount(ScrollArea, { props: { vertical: true, horizontal: true } })
    w.unmount()
  })

  bench('mount with slot content', () => {
    const w = mount(ScrollArea, {
      slots: { default: '<div style="height:2000px">Content</div>' },
    })
    w.unmount()
  })
})

describe('ScrollArea reactivity', () => {
  bench('toggle horizontal prop', async () => {
    const w = mount(ScrollArea, { props: { horizontal: false } })
    await w.setProps({ horizontal: true })
    w.unmount()
  })
})
