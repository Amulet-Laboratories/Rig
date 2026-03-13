import { describe, bench } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { provideDragDrop, useDragDrop } from './useDragDrop'

describe('useDragDrop', () => {
  bench('invoke useDragDrop (standalone)', () => {
    useDragDrop()
  })

  bench('provideDragDrop setup', () => {
    const w = mount(
      defineComponent({
        setup() {
          provideDragDrop()
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })

  bench('drag lifecycle: start + end', () => {
    const w = mount(
      defineComponent({
        setup() {
          const dd = provideDragDrop()
          dd.startDrag('item')
          dd.endDrag()
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })

  bench('create dragAttributes', () => {
    const w = mount(
      defineComponent({
        setup() {
          const dd = provideDragDrop()
          for (let i = 0; i < 10; i++) {
            dd.dragAttributes('list', i, { id: i })
          }
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })

  bench('create dropZoneHandlers', () => {
    const w = mount(
      defineComponent({
        setup() {
          const dd = provideDragDrop()
          for (let i = 0; i < 5; i++) {
            dd.dropZoneHandlers(`zone-${i}`, () => 0)
          }
          return () => h('div')
        },
      }),
    )
    w.unmount()
  })
})
