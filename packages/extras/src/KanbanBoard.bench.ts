import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanBoard from './KanbanBoard.vue'

describe('KanbanBoard mount', () => {
  bench('default mount', () => {
    const w = mount(KanbanBoard)
    w.unmount()
  })
})
