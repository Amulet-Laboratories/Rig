import { describe, bench } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useGlobalState } from './useGlobalState'

describe('useGlobalState', () => {
  bench('invoke useGlobalState (standalone)', () => {
    useGlobalState()
  })

  bench('create with provide', () => {
    const w = mount(
      defineComponent({
        setup() {
          useGlobalState({ provide: true })
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })

  bench('open 10 editors', () => {
    const w = mount(
      defineComponent({
        setup() {
          const state = useGlobalState({ provide: true })
          for (let i = 0; i < 10; i++) {
            state.openEditor({ id: `file-${i}`, label: `file-${i}.ts` })
          }
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })

  bench('open + close editors', () => {
    const w = mount(
      defineComponent({
        setup() {
          const state = useGlobalState({ provide: true })
          for (let i = 0; i < 10; i++) {
            state.openEditor({ id: `f-${i}`, label: `f-${i}.ts` })
          }
          for (let i = 9; i >= 0; i--) {
            state.closeEditor(`f-${i}`)
          }
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })

  bench('toggle sidebar + panel', () => {
    const w = mount(
      defineComponent({
        setup() {
          const state = useGlobalState({ provide: true })
          for (let i = 0; i < 20; i++) {
            state.toggleSidebar()
            state.togglePanel()
          }
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })
})
