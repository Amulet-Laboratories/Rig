import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useShellState } from './useShellState'
import type { TabItem } from '@core/types'

function tab(id: string, label?: string): TabItem {
  return { id, label: label ?? id }
}

/**
 * Mount a component that calls useShellState with { provide: true }
 * so we can test in a proper component context (provide/inject work).
 */
function createShell(config = {}) {
  let shell: ReturnType<typeof useShellState>

  const Wrapper = defineComponent({
    setup() {
      shell = useShellState({ provide: true, ...config })
      return { shell }
    },
    render() {
      return h('div')
    },
  })

  const wrapper = mount(Wrapper)
  return { wrapper, shell: shell! }
}

describe('useShellState', () => {
  describe('tabs', () => {
    it('starts with no open tabs', () => {
      const { shell } = createShell()
      expect(shell.openTabs.value).toHaveLength(0)
      expect(shell.activeTabId.value).toBeNull()
    })

    it('openTab() adds a tab and activates it', () => {
      const { shell } = createShell()
      shell.openTab(tab('a', 'File A'))
      expect(shell.openTabs.value).toHaveLength(1)
      expect(shell.activeTabId.value).toBe('a')
      expect(shell.activeTab.value?.label).toBe('File A')
    })

    it('openTab() does not duplicate existing tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.openTab(tab('a'))
      expect(shell.openTabs.value).toHaveLength(2)
      expect(shell.activeTabId.value).toBe('a')
    })

    it('openTab() with preview replaces previous preview', () => {
      const { shell } = createShell()
      shell.openTab(tab('preview-1'), { preview: true })
      expect(shell.previewTabId.value).toBe('preview-1')

      shell.openTab(tab('preview-2'), { preview: true })
      expect(shell.openTabs.value).toHaveLength(1)
      expect(shell.previewTabId.value).toBe('preview-2')
    })

    it('openTab() un-previews a preview tab when opened normally', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'), { preview: true })
      expect(shell.previewTabId.value).toBe('a')

      shell.openTab(tab('a'))
      expect(shell.previewTabId.value).toBeNull()
    })

    it('closeTab() removes tab and selects neighbor', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.openTab(tab('c'))
      shell.closeTab('b')
      expect(shell.openTabs.value).toHaveLength(2)
      expect(shell.activeTabId.value).toBe('c')
    })

    it('closeTab() selects previous when closing last', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.closeTab('b')
      expect(shell.activeTabId.value).toBe('a')
    })

    it('closeTab() clears activeTabId when closing only tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.closeTab('a')
      expect(shell.activeTabId.value).toBeNull()
    })

    it('closeOtherTabs() keeps only the specified tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.openTab(tab('c'))
      shell.closeOtherTabs('b')
      expect(shell.openTabs.value).toHaveLength(1)
      expect(shell.openTabs.value[0]!.id).toBe('b')
      expect(shell.activeTabId.value).toBe('b')
    })

    it('closeAllTabs() empties everything', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.closeAllTabs()
      expect(shell.openTabs.value).toHaveLength(0)
      expect(shell.activeTabId.value).toBeNull()
      expect(shell.previewTabId.value).toBeNull()
    })

    it('reorderTabs() moves a tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.openTab(tab('c'))
      shell.reorderTabs({ from: 0, to: 2 })
      expect(shell.openTabs.value.map((t) => t.id)).toEqual(['b', 'c', 'a'])
    })
  })

  describe('dirty state', () => {
    it('markDirty() and markClean() toggle dirty flag', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.markDirty('a')
      expect(shell.dirtyTabCount.value).toBe(1)
      expect(shell.openTabs.value[0]!.dirty).toBe(true)

      shell.markClean('a')
      expect(shell.dirtyTabCount.value).toBe(0)
      expect(shell.openTabs.value[0]!.dirty).toBe(false)
    })
  })

  describe('sidebar', () => {
    it('sidebar is visible by default', () => {
      const { shell } = createShell()
      expect(shell.sidebarVisible.value).toBe(true)
    })

    it('toggleSidebar() flips visibility', () => {
      const { shell } = createShell()
      shell.toggleSidebar()
      expect(shell.sidebarVisible.value).toBe(false)
      shell.toggleSidebar()
      expect(shell.sidebarVisible.value).toBe(true)
    })
  })

  describe('panel', () => {
    it('panel is hidden by default', () => {
      const { shell } = createShell()
      expect(shell.panelVisible.value).toBe(false)
    })

    it('togglePanel() flips visibility', () => {
      const { shell } = createShell()
      shell.togglePanel()
      expect(shell.panelVisible.value).toBe(true)
    })
  })

  describe('auxiliary panel', () => {
    it('aux is closed by default', () => {
      const { shell } = createShell()
      expect(shell.auxOpen.value).toBe(false)
    })

    it('toggleAux() flips state', () => {
      const { shell } = createShell()
      shell.toggleAux()
      expect(shell.auxOpen.value).toBe(true)
      shell.toggleAux()
      expect(shell.auxOpen.value).toBe(false)
    })
  })

  describe('settings', () => {
    it('openSettings() sets settingsOpen and clears activeTabId', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openSettings()
      expect(shell.settingsOpen.value).toBe(true)
      expect(shell.activeTabId.value).toBeNull()
    })

    it('openTab() clears settingsOpen', () => {
      const { shell } = createShell()
      shell.openSettings()
      shell.openTab(tab('a'))
      expect(shell.settingsOpen.value).toBe(false)
    })
  })

  describe('shellSizes', () => {
    it('reflects sidebar and panel dimensions', () => {
      const { shell } = createShell({ sidebarWidth: 300, panelHeight: 150 })
      expect(shell.shellSizes.value.sideWidth).toBe(300)
      // Panel hidden by default
      expect(shell.shellSizes.value.panelHeight).toBe(0)
      shell.togglePanel()
      expect(shell.shellSizes.value.panelHeight).toBe(150)
    })

    it('sideWidth is 0 when sidebar hidden', () => {
      const { shell } = createShell()
      shell.toggleSidebar()
      expect(shell.shellSizes.value.sideWidth).toBe(0)
    })

    it('onShellResize updates dimensions', () => {
      const { shell } = createShell()
      shell.onShellResize({ sideWidth: 400, panelHeight: 250 })
      expect(shell.sidebarWidth.value).toBe(400)
      expect(shell.panelHeight.value).toBe(250)
    })
  })

  describe('activity', () => {
    it('uses explorer as default activity', () => {
      const { shell } = createShell()
      expect(shell.activeActivity.value).toBe('explorer')
    })

    it('respects defaultActivity config', () => {
      const { shell } = createShell({ defaultActivity: 'search' })
      expect(shell.activeActivity.value).toBe('search')
    })
  })

  describe('provide/inject', () => {
    it('provides state to child components via ShellKey', () => {
      let injectedShell: ReturnType<typeof useShellState> | undefined

      const Child = defineComponent({
        setup() {
          injectedShell = useShellState()
          return {}
        },
        render() {
          return h('div')
        },
      })

      const Parent = defineComponent({
        setup() {
          useShellState({ provide: true })
          return {}
        },
        render() {
          return h('div', [h(Child)])
        },
      })

      mount(Parent)
      expect(injectedShell).toBeDefined()
      expect(injectedShell!.openTab).toBeTypeOf('function')
    })

    it('falls back to standalone state when no provider', () => {
      let shell: ReturnType<typeof useShellState> | undefined

      const Standalone = defineComponent({
        setup() {
          shell = useShellState()
          return {}
        },
        render() {
          return h('div')
        },
      })

      mount(Standalone)
      expect(shell).toBeDefined()
      expect(shell!.openTab).toBeTypeOf('function')
    })
  })
})
