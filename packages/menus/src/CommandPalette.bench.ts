import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import CommandPalette from './CommandPalette.vue'
import type { ID } from '@core/types'

interface PaletteItem {
  id: ID
  label: string
}

function generateItems(count: number): PaletteItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `cmd-${i}`,
    label: `Command ${i}: Do something useful`,
  }))
}

describe('CommandPalette mount', () => {
  bench('closed with 100 items', () => {
    const w = mount(CommandPalette, {
      props: { open: false, items: generateItems(100) },
    })
    w.unmount()
  })

  bench('open with 100 items', () => {
    const w = mount(CommandPalette, {
      props: { open: true, items: generateItems(100) },
    })
    w.unmount()
  })

  bench('open with 500 items', () => {
    const w = mount(CommandPalette, {
      props: { open: true, items: generateItems(500) },
    })
    w.unmount()
  })
})
