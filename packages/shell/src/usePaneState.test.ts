import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { usePaneState } from './usePaneState'
import type { TabItem } from '@core/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeTab(id: string): TabItem {
  return { id, label: id, dirty: false }
}

function createPanes(config: Parameters<typeof usePaneState>[0] = {}) {
  let panes: ReturnType<typeof usePaneState>

  const Wrapper = defineComponent({
    setup() {
      panes = usePaneState({ provide: true, ...config })
      return { panes }
    },
    render() {
      return h('div')
    },
  })

  const wrapper = mount(Wrapper)
  return { wrapper, panes: panes! }
}

// ── Initial state ─────────────────────────────────────────────────────────────

describe('usePaneState — initial state', () => {
  it('tl pane is always present', () => {
    const { panes } = createPanes()
    expect(panes.activePanes.value.has('tl')).toBe(true)
    expect(panes.activePanes.value.size).toBe(1)
  })

  it('focusedPaneId defaults to tl', () => {
    const { panes } = createPanes()
    expect(panes.focusedPaneId.value).toBe('tl')
  })

  it('layout starts with no right, no bottom', () => {
    const { panes } = createPanes()
    expect(panes.layout.value).toEqual({ hasRight: false, hasBottom: false, hasBottomRight: false })
  })

  it('tl group starts with empty tabs', () => {
    const { panes } = createPanes()
    const tl = panes.activePanes.value.get('tl')!
    expect(tl.tabs.value).toHaveLength(0)
    expect(tl.activeTabId.value).toBeNull()
  })
})

// ── openTabInPane ─────────────────────────────────────────────────────────────

describe('openTabInPane', () => {
  it('adds a tab to tl', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    const tl = panes.activePanes.value.get('tl')!
    expect(tl.tabs.value).toHaveLength(1)
    expect(tl.activeTabId.value).toBe('a')
  })

  it('does not duplicate existing tab', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.openTabInPane('tl', makeTab('a'))
    expect(panes.activePanes.value.get('tl')!.tabs.value).toHaveLength(1)
  })

  it('activates existing tab when re-opened', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.openTabInPane('tl', makeTab('b'))
    // b is now active; re-open a
    panes.openTabInPane('tl', makeTab('a'))
    expect(panes.activePanes.value.get('tl')!.activeTabId.value).toBe('a')
  })

  it('no-ops when pane does not exist', () => {
    const { panes } = createPanes()
    // tr does not exist
    expect(() => panes.openTabInPane('tr', makeTab('a'))).not.toThrow()
  })
})

// ── closeTabInPane ────────────────────────────────────────────────────────────

describe('closeTabInPane', () => {
  it('removes tab and updates activeTabId', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.openTabInPane('tl', makeTab('b'))
    panes.closeTabInPane('tl', 'b')
    const tl = panes.activePanes.value.get('tl')!
    expect(tl.tabs.value).toHaveLength(1)
    expect(tl.tabs.value[0].id).toBe('a')
  })

  it('tl pane stays open when last tab closed', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.closeTabInPane('tl', 'a')
    expect(panes.activePanes.value.has('tl')).toBe(true)
    expect(panes.activePanes.value.get('tl')!.tabs.value).toHaveLength(0)
  })

  it('secondary pane auto-closes when last tab removed', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('x'))
    expect(panes.activePanes.value.has('tr')).toBe(true)
    panes.closeTabInPane('tr', 'x')
    expect(panes.activePanes.value.has('tr')).toBe(false)
  })

  it('focuses tl when focused pane auto-closes', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('x'))
    panes.focusPane('tr')
    panes.closeTabInPane('tr', 'x')
    expect(panes.focusedPaneId.value).toBe('tl')
  })
})

// ── closePane (cascade) ───────────────────────────────────────────────────────

describe('closePane cascade', () => {
  it('closing tr also removes br', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('a'))
    panes.openPane('bl', makeTab('b'))
    panes.openPane('br', makeTab('c'))
    panes.closePane('tr')
    expect(panes.activePanes.value.has('tr')).toBe(false)
    expect(panes.activePanes.value.has('br')).toBe(false)
    expect(panes.activePanes.value.has('bl')).toBe(true)
  })

  it('closing bl also removes br', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('a'))
    panes.openPane('bl', makeTab('b'))
    panes.openPane('br', makeTab('c'))
    panes.closePane('bl')
    expect(panes.activePanes.value.has('bl')).toBe(false)
    expect(panes.activePanes.value.has('br')).toBe(false)
    expect(panes.activePanes.value.has('tr')).toBe(true)
  })

  it('closing br does not cascade', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('a'))
    panes.openPane('br', makeTab('b'))
    panes.closePane('br')
    expect(panes.activePanes.value.has('tr')).toBe(true)
    expect(panes.activePanes.value.has('br')).toBe(false)
  })
})

// ── splitRight ────────────────────────────────────────────────────────────────

describe('splitRight', () => {
  it('moves tab from tl to tr', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.splitRight('tl', 'a')
    expect(panes.activePanes.value.get('tl')!.tabs.value).toHaveLength(0)
    expect(panes.activePanes.value.has('tr')).toBe(true)
    expect(panes.activePanes.value.get('tr')!.tabs.value[0].id).toBe('a')
  })

  it('moves tab from bl to tr', () => {
    const { panes } = createPanes()
    panes.openPane('bl', makeTab('a'))
    panes.splitRight('bl', 'a')
    expect(panes.activePanes.value.has('tr')).toBe(true)
    expect(panes.activePanes.value.get('tr')!.tabs.value[0].id).toBe('a')
    // bl auto-closed since it had 1 tab
    expect(panes.activePanes.value.has('bl')).toBe(false)
  })

  it('moves tab from tr to br when bottom row exists', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('a'))
    panes.openPane('bl', makeTab('b'))
    // tr has tab x
    panes.openTabInPane('tr', makeTab('x'))
    panes.splitRight('tr', 'x')
    expect(panes.activePanes.value.has('br')).toBe(true)
    expect(panes.activePanes.value.get('br')!.tabs.value[0].id).toBe('x')
  })

  it('no-ops on br', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('a'))
    panes.openPane('bl', makeTab('b'))
    panes.openPane('br', makeTab('c'))
    const before = panes.activePanes.value.size
    panes.splitRight('br', 'c')
    expect(panes.activePanes.value.size).toBe(before)
  })

  it('layout updates to hasRight after splitRight from tl', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.splitRight('tl', 'a')
    expect(panes.layout.value.hasRight).toBe(true)
  })
})

// ── splitDown ─────────────────────────────────────────────────────────────────

describe('splitDown', () => {
  it('moves tab from tl to bl', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.splitDown('tl', 'a')
    expect(panes.activePanes.value.get('tl')!.tabs.value).toHaveLength(0)
    expect(panes.activePanes.value.has('bl')).toBe(true)
    expect(panes.activePanes.value.get('bl')!.tabs.value[0].id).toBe('a')
  })

  it('moves tab from tr to br when bottom row exists', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('a'))
    panes.openPane('bl', makeTab('b'))
    panes.openTabInPane('tr', makeTab('x'))
    panes.splitDown('tr', 'x')
    expect(panes.activePanes.value.has('br')).toBe(true)
    expect(panes.activePanes.value.get('br')!.tabs.value[0].id).toBe('x')
  })

  it('moves tab from tr to bl when no bottom row exists', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('a'))
    panes.openTabInPane('tr', makeTab('x'))
    panes.splitDown('tr', 'x')
    // No bl existed, so creates bl
    expect(panes.activePanes.value.has('bl')).toBe(true)
    expect(panes.activePanes.value.get('bl')!.tabs.value[0].id).toBe('x')
  })

  it('no-ops on bl', () => {
    const { panes } = createPanes()
    panes.openPane('bl', makeTab('a'))
    const sizeBefore = panes.activePanes.value.size
    panes.splitDown('bl', 'a')
    expect(panes.activePanes.value.size).toBe(sizeBefore)
  })

  it('no-ops on br', () => {
    const { panes } = createPanes()
    panes.openPane('tr', makeTab('a'))
    panes.openPane('br', makeTab('b'))
    const sizeBefore = panes.activePanes.value.size
    panes.splitDown('br', 'b')
    expect(panes.activePanes.value.size).toBe(sizeBefore)
  })
})

// ── findTabPane / isPaneOpen ──────────────────────────────────────────────────

describe('utility methods', () => {
  it('findTabPane returns correct pane', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.openPane('tr', makeTab('b'))
    expect(panes.findTabPane('a')).toBe('tl')
    expect(panes.findTabPane('b')).toBe('tr')
    expect(panes.findTabPane('unknown')).toBeNull()
  })

  it('isPaneOpen reflects pane existence', () => {
    const { panes } = createPanes()
    expect(panes.isPaneOpen('tl')).toBe(true)
    expect(panes.isPaneOpen('tr')).toBe(false)
    panes.openPane('tr', makeTab('a'))
    expect(panes.isPaneOpen('tr')).toBe(true)
  })
})

// ── dirty / editing state ─────────────────────────────────────────────────────

describe('dirty and editing state', () => {
  it('markPaneDirty sets dirty flag on tab', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.markPaneDirty('tl', 'a')
    const tab = panes.activePanes.value.get('tl')!.tabs.value.find((t) => t.id === 'a')
    expect(tab?.dirty).toBe(true)
  })

  it('markPaneClean clears dirty flag', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.markPaneDirty('tl', 'a')
    panes.markPaneClean('tl', 'a')
    const tab = panes.activePanes.value.get('tl')!.tabs.value.find((t) => t.id === 'a')
    expect(tab?.dirty).toBe(false)
  })

  it('setPaneEditing true marks dirty', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.setPaneEditing('tl', 'a', true)
    expect(panes.isPaneEditing('tl', 'a')).toBe(true)
    const tab = panes.activePanes.value.get('tl')!.tabs.value.find((t) => t.id === 'a')
    expect(tab?.dirty).toBe(true)
  })

  it('setPaneEditing false removes editing', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.setPaneEditing('tl', 'a', true)
    panes.setPaneEditing('tl', 'a', false)
    expect(panes.isPaneEditing('tl', 'a')).toBe(false)
  })
})

// ── reorderPaneTabs ───────────────────────────────────────────────────────────

describe('reorderPaneTabs', () => {
  it('reorders tabs within a pane', () => {
    const { panes } = createPanes()
    panes.openTabInPane('tl', makeTab('a'))
    panes.openTabInPane('tl', makeTab('b'))
    panes.openTabInPane('tl', makeTab('c'))
    // Tabs prepended via unshift: [c, b, a]
    // Move last item (a, index 2) to the front (index 0)
    panes.reorderPaneTabs('tl', { from: 2, to: 0 })
    const ids = panes.activePanes.value.get('tl')!.tabs.value.map((t) => t.id)
    expect(ids[0]).toBe('a')
  })
})

// ── provide / inject ──────────────────────────────────────────────────────────

describe('provide / inject', () => {
  it('child component injects the same pane state', () => {
    let parentPanes: ReturnType<typeof usePaneState>
    let childPanes: ReturnType<typeof usePaneState>

    const Child = defineComponent({
      setup() {
        childPanes = usePaneState()
        return {}
      },
      render() {
        return h('div')
      },
    })

    const Parent = defineComponent({
      setup() {
        parentPanes = usePaneState({ provide: true })
        return {}
      },
      render() {
        return h('div', null, [h(Child)])
      },
    })

    mount(Parent)

    expect(childPanes!).toBe(parentPanes!)
  })
})
