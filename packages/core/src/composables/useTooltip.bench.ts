import { describe, bench } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useTooltip } from './useTooltip'

describe('useTooltip', () => {
  bench('invoke useTooltip (standalone)', () => {
    useTooltip()
  })

  bench('create with provide', () => {
    const w = mount(
      defineComponent({
        setup() {
          useTooltip({ provide: true })
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })

  bench('show + hide cycle', () => {
    const w = mount(
      defineComponent({
        setup() {
          const tooltip = useTooltip()
          const el = document.createElement('div')
          el.getBoundingClientRect = () =>
            ({ left: 0, right: 100, top: 0, bottom: 30, width: 100, height: 30 }) as DOMRect
          tooltip.show(el, 'Tooltip text')
          tooltip.hide()
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })

  bench('rapid show calls (debounce)', () => {
    const w = mount(
      defineComponent({
        setup() {
          const tooltip = useTooltip()
          const el = document.createElement('div')
          el.getBoundingClientRect = () =>
            ({ left: 0, right: 100, top: 0, bottom: 30, width: 100, height: 30 }) as DOMRect
          for (let i = 0; i < 10; i++) {
            tooltip.show(el, `Tip ${i}`)
          }
          tooltip.hide()
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })
})
