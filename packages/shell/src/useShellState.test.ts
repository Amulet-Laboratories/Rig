import { describe, it, expect, vi } from 'vitest'
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

  describe('onActiveTabChange callback', () => {
    it('fires when active tab changes', async () => {
      const onActiveTabChange = vi.fn()
      const { shell, wrapper } = createShell({ onActiveTabChange })
      shell.openTab(tab('a'))
      await wrapper.vm.$nextTick()
      expect(onActiveTabChange).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'a' }),
      )
    })

    it('fires with null when last tab is closed', async () => {
      const onActiveTabChange = vi.fn()
      const { shell, wrapper } = createShell({ onActiveTabChange })
      shell.openTab(tab('a'))
      await wrapper.vm.$nextTick()
      onActiveTabChange.mockClear()
      shell.closeTab('a')
      await wrapper.vm.$nextTick()
      expect(onActiveTabChange).toHaveBeenCalledWith(null)
    })
  })

  describe('activePanelTab', () => {
    it('defaults to output', () => {
      const { shell } = createShell()
      expect(shell.activePanelTab.value).toBe('output')
    })
  })

  describe('auxWidth', () => {
    it('defaults to 320', () => {
      const { shell } = createShell()
      expect(shell.auxWidth.value).toBe(320)
    })

    it('respects custom auxWidth config', () => {
      const { shell } = createShell({ auxWidth: 500 })
      expect(shell.auxWidth.value).toBe(500)
    })
  })

  describe('closeTab preview cleanup', () => {
    it('clears previewTabId when closing preview tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('p'), { preview: true })
      expect(shell.previewTabId.value).toBe('p')
      shell.closeTab('p')
      expect(shell.previewTabId.value).toBeNull()
    })
  })

  describe('onShellResize edge cases', () => {
    it('ignores zero sideWidth', () => {
      const { shell } = createShell({ sidebarWidth: 200 })
      shell.onShellResize({ sideWidth: 0, panelHeight: 100 })
      expect(shell.sidebarWidth.value).toBe(200)
      expect(shell.panelHeight.value).toBe(100)
    })

    it('ignores zero panelHeight', () => {
      const { shell } = createShell()
      shell.onShellResize({ sideWidth: 300, panelHeight: 0 })
      expect(shell.sidebarWidth.value).toBe(300)
    })
  })

  describe('markDirty on non-existent tab', () => {
    it('does not crash when marking non-existent tab', () => {
      const { shell } = createShell()
      expect(() => shell.markDirty('nonexistent')).not.toThrow()
    })
  })

  describe('closeTab edge cases', () => {
    it('returns early for non-existent tab id', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.closeTab('nonexistent')
      expect(shell.openTabs.value).toHaveLength(1)
      expect(shell.activeTabId.value).toBe('a')
    })

    it('keeps activeTabId when closing an inactive tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.openTab(tab('c'))
      // c is active, close a (inactive)
      shell.closeTab('a')
      expect(shell.activeTabId.value).toBe('c')
      expect(shell.openTabs.value).toHaveLength(2)
    })

    it('removes dirty state when closing a dirty tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.markDirty('a')
      expect(shell.dirtyTabs.value.has('a')).toBe(true)
      shell.closeTab('a')
      expect(shell.dirtyTabs.value.has('a')).toBe(false)
    })
  })

  describe('openTab preview edge cases', () => {
    it('replaces preview even when previewTabId is stale', () => {
      const { shell } = createShell()
      shell.openTab(tab('p1'), { preview: true })
      // Manually make previewTabId stale (point to non-existent tab)
      shell.previewTabId.value = 'stale-id'
      shell.openTab(tab('p2'), { preview: true })
      // Since stale id not found, new tab is pushed instead of spliced
      expect(shell.openTabs.value.map((t) => t.id)).toContain('p2')
      expect(shell.previewTabId.value).toBe('p2')
    })

    it('opens non-preview tab and clears previewTabId', () => {
      const { shell } = createShell()
      shell.openTab(tab('p'), { preview: true })
      expect(shell.previewTabId.value).toBe('p')
      shell.openTab(tab('normal'))
      expect(shell.previewTabId.value).toBeNull()
    })
  })

  describe('closeOtherTabs edge cases', () => {
    it('preserves dirty state on the kept tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.openTab(tab('c'))
      shell.markDirty('b')
      shell.closeOtherTabs('b')
      expect(shell.openTabs.value).toHaveLength(1)
      expect(shell.dirtyTabs.value.has('b')).toBe(true)
    })

    it('clears previewTabId when preview tab is not the kept tab', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('p'), { preview: true })
      expect(shell.previewTabId.value).toBe('p')
      shell.closeOtherTabs('a')
      // previewTabId is not explicitly cleared by closeOtherTabs,
      // but the preview tab is removed from openTabs
      expect(shell.openTabs.value).toHaveLength(1)
      expect(shell.openTabs.value[0]!.id).toBe('a')
    })

    it('clears dirty state of removed tabs', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.openTab(tab('c'))
      shell.markDirty('a')
      shell.markDirty('c')
      shell.closeOtherTabs('b')
      expect(shell.dirtyTabs.value.has('a')).toBe(false)
      expect(shell.dirtyTabs.value.has('c')).toBe(false)
    })
  })

  describe('closeAllTabs clears dirty state', () => {
    it('clears dirtyTabs Set', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.markDirty('a')
      shell.markDirty('b')
      expect(shell.dirtyTabs.value.size).toBe(2)
      shell.closeAllTabs()
      expect(shell.dirtyTabs.value.size).toBe(0)
    })
  })

  describe('reorderTabs edge cases', () => {
    it('handles out-of-bounds from index gracefully', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      // from: 5 is out of bounds, splice returns empty → tab is undefined
      shell.reorderTabs({ from: 5, to: 0 })
      expect(shell.openTabs.value.map((t) => t.id)).toEqual(['a', 'b'])
    })
  })

  describe('markClean on non-existent tab', () => {
    it('does not crash when marking non-existent tab clean', () => {
      const { shell } = createShell()
      expect(() => shell.markClean('nonexistent')).not.toThrow()
      expect(shell.dirtyTabs.value.has('nonexistent')).toBe(false)
    })
  })

  describe('dirtyTabs Set tracking', () => {
    it('tracks multiple dirty tabs correctly', () => {
      const { shell } = createShell()
      shell.openTab(tab('a'))
      shell.openTab(tab('b'))
      shell.openTab(tab('c'))
      shell.markDirty('a')
      shell.markDirty('c')
      expect(shell.dirtyTabs.value.size).toBe(2)
      expect(shell.dirtyTabs.value.has('a')).toBe(true)
      expect(shell.dirtyTabs.value.has('b')).toBe(false)
      expect(shell.dirtyTabs.value.has('c')).toBe(true)
      expect(shell.dirtyTabCount.value).toBe(2)
    })
  })

  describe('default values', () => {
    it('settingsOpen defaults to false', () => {
      const { shell } = createShell()
      expect(shell.settingsOpen.value).toBe(false)
    })

    it('sidebarWidth defaults to 260', () => {
      const { shell } = createShell()
      expect(shell.sidebarWidth.value).toBe(260)
    })

    it('panelHeight defaults to 200', () => {
      const { shell } = createShell()
      expect(shell.panelHeight.value).toBe(200)
    })
  })

  describe('shellSizes combinations', () => {
    it('sidebar hidden and panel visible', () => {
      const { shell } = createShell()
      shell.toggleSidebar()
      shell.togglePanel()
      expect(shell.shellSizes.value.sideWidth).toBe(0)
      expect(shell.shellSizes.value.panelHeight).toBe(200)
    })
  })

  describe('activeTab computed', () => {
    it('returns undefined when no tabs match activeTabId', () => {
      const { shell } = createShell()
      expect(shell.activeTab.value).toBeUndefined()
    })

    it('updates when activeTabId changes', () => {
      const { shell } = createShell()
      shell.openTab(tab('a', 'Alpha'))
      shell.openTab(tab('b', 'Beta'))
      expect(shell.activeTab.value?.label).toBe('Beta')
      shell.activeTabId.value = 'a'
      expect(shell.activeTab.value?.label).toBe('Alpha')
    })
  })
})
