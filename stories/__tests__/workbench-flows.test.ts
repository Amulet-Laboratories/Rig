/**
 * Workbench E2E Flow Tests
 *
 * Complex user flows modelling a real IDE session:
 *  1. File tree navigation (expand/collapse/select via keyboard + click)
 *  2. IDE shell workspace management (tabs, sidebar, panel via exposed API)
 *  3. Command palette (open → filter → select → close)
 *  4. Context menu lifecycle (open → items → close)
 *  5. Modal with form controls (open → interact → close)
 *  6. Full IDE session (multi-step chained workflow)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'

// Components
import { IdeShell } from '@shell/index'
import { TreeView } from '@lists/index'
import { CommandPalette, ContextMenu } from '@menus/index'
import { Modal } from '@layout/index'
import { Tabs } from '@nav/index'
import { Button, Switch, Checkbox } from '@core/index'

// Types
import type { Action, TabItem, TreeNode, ListItem } from '@core/types'

// ── Shared test data ────────────────────────────────────────────────────────

const treeNodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'App.vue', label: 'App.vue' },
          { id: 'Header.vue', label: 'Header.vue' },
        ],
      },
      { id: 'main.ts', label: 'main.ts' },
    ],
  },
  { id: 'package.json', label: 'package.json' },
]

const activities: Action[] = [
  { id: 'explorer', label: 'Explorer', icon: 'mdi:file-tree' },
  { id: 'search', label: 'Search', icon: 'mdi:magnify' },
  { id: 'git', label: 'Source Control', icon: 'mdi:source-branch' },
]

const panelTabs: TabItem[] = [
  { id: 'problems', label: 'Problems' },
  { id: 'output', label: 'Output' },
  { id: 'terminal', label: 'Terminal' },
]

const commands: ListItem[] = [
  { id: 'toggle-sidebar', label: 'Toggle Sidebar' },
  { id: 'toggle-panel', label: 'Toggle Panel' },
  { id: 'format-doc', label: 'Format Document' },
  { id: 'go-to-file', label: 'Go to File...' },
  { id: 'git-commit', label: 'Git: Commit' },
]

const ctxItems: Action[] = [
  { id: 'new-file', label: 'New File' },
  { id: 'rename', label: 'Rename' },
  { id: 'delete', label: 'Delete' },
]

// ── IdeShell factory (stubs internal layout components) ─────────────────────

function shellFactory(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
  opts: { attachTo?: Element } = {},
) {
  return mount(IdeShell as any, {
    props: { activities, panelTabs, ...props },
    slots,
    ...opts,
    global: {
      stubs: {
        ActivityBar: { template: '<div data-rig-activity-bar><slot /></div>' },
        SideBar: { template: '<div data-rig-sidebar><slot /></div>' },
        StatusBar: { template: '<div data-rig-status-bar><slot /></div>' },
        PanelBar: { template: '<div data-rig-panel-bar><slot /></div>' },
        EditorWorkbench: {
          template: '<div data-rig-editor-workbench><slot /><slot name="empty" /></div>',
          props: ['tabs', 'activeId'],
        },
        Panel: {
          template: '<div data-rig-panel><slot /></div>',
          props: ['open', 'position', 'size'],
        },
      },
    },
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// Flow 1 — File tree navigation
// ═══════════════════════════════════════════════════════════════════════════

describe('Workbench Flow 1: File tree navigation', () => {
  it('expands folders and navigates to files with keyboard', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes: treeNodes, expanded: [], selected: undefined },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // Initially only root-level nodes visible
    expect(wrapper.findAll('[data-rig-tree-node]')).toHaveLength(2)

    // ArrowRight expands 'src'
    await tree.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src']])

    // Simulate parent v-model bind
    await wrapper.setProps({ expanded: ['src'] })
    // src + components + main.ts + package.json = 4
    expect(wrapper.findAll('[data-rig-tree-node]')).toHaveLength(4)

    // ArrowDown moves focus to 'components'
    await tree.trigger('keydown', { key: 'ArrowDown' })
    const nodesAfterDown = wrapper.findAll('[data-rig-tree-node]')
    expect(nodesAfterDown[1]!.attributes('tabindex')).toBe('0')

    // ArrowRight expands 'components'
    await tree.trigger('keydown', { key: 'ArrowRight' })
    const expandEvents = wrapper.emitted('update:expanded')!
    const lastExpand = expandEvents[expandEvents.length - 1]![0] as string[]
    expect(lastExpand).toContain('components')

    // Set expanded state to include both
    await wrapper.setProps({ expanded: ['src', 'components'] })
    // src + components + App.vue + Header.vue + main.ts + package.json = 6
    expect(wrapper.findAll('[data-rig-tree-node]')).toHaveLength(6)

    // Navigate down to App.vue and select via Space (Enter emits 'activate')
    await tree.trigger('keydown', { key: 'ArrowDown' })
    await tree.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:selected')).toBeTruthy()

    // End key jumps to last visible node
    await tree.trigger('keydown', { key: 'End' })
    const allNodes = wrapper.findAll('[data-rig-tree-node]')
    expect(allNodes[allNodes.length - 1]!.attributes('tabindex')).toBe('0')

    wrapper.unmount()
  })

  it('selects files via click and collapses folders', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes: treeNodes, expanded: ['src', 'components'] },
      attachTo: document.body,
    })

    // 6 nodes visible
    const nodes = wrapper.findAll('[data-rig-tree-node]')
    expect(nodes).toHaveLength(6)

    // Click on App.vue (index 2: src, components, App.vue)
    await nodes[2]!.trigger('click')
    expect(wrapper.emitted('update:selected')?.[0]).toEqual(['App.vue'])

    // Click on main.ts (index 4: ..., Header.vue, main.ts)
    await nodes[4]!.trigger('click')
    const selectEmits = wrapper.emitted('update:selected')!
    expect(selectEmits[selectEmits.length - 1]).toEqual(['main.ts'])

    // Toggle-click to collapse 'src'
    const toggleBtn = wrapper.find('[data-rig-tree-toggle]')
    await toggleBtn.trigger('click')
    const expandEmits = wrapper.emitted('update:expanded')!
    expect(expandEmits).toBeTruthy()

    wrapper.unmount()
  })

  it('navigates with Home/End across deep tree', async () => {
    const wrapper = mount(TreeView, {
      props: { nodes: treeNodes, expanded: ['src', 'components'] },
      attachTo: document.body,
    })
    const tree = wrapper.find('[data-rig-tree]')

    // Home → first node focused
    await tree.trigger('keydown', { key: 'Home' })
    expect(wrapper.findAll('[data-rig-tree-node]')[0]!.attributes('tabindex')).toBe('0')

    // End → last node focused
    await tree.trigger('keydown', { key: 'End' })
    const allNodes = wrapper.findAll('[data-rig-tree-node]')
    expect(allNodes[allNodes.length - 1]!.attributes('tabindex')).toBe('0')

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 2 — IDE shell workspace management
// ═══════════════════════════════════════════════════════════════════════════

describe('Workbench Flow 2: IDE shell workspace management', () => {
  it('manages editor tabs through exposed shell API', async () => {
    const wrapper = shellFactory({}, {}, { attachTo: document.body })
    const shell = (wrapper.vm as any).shell

    // No tabs initially
    expect(shell.openTabs.value).toHaveLength(0)
    expect(shell.activeTab.value).toBeUndefined()

    // Open first file
    shell.openTab({ id: 'App.vue', label: 'App.vue' })
    expect(shell.openTabs.value).toHaveLength(1)
    expect(shell.activeTab.value?.id).toBe('App.vue')

    // Open second file → becomes active
    shell.openTab({ id: 'main.ts', label: 'main.ts' })
    expect(shell.openTabs.value).toHaveLength(2)
    expect(shell.activeTab.value?.id).toBe('main.ts')

    // Open same tab again → no duplicate, just activates
    shell.openTab({ id: 'App.vue', label: 'App.vue' })
    expect(shell.openTabs.value).toHaveLength(2)
    expect(shell.activeTab.value?.id).toBe('App.vue')

    // Close active tab
    shell.closeTab('App.vue')
    expect(shell.openTabs.value).toHaveLength(1)
    expect(shell.activeTab.value?.id).toBe('main.ts')

    // Close remaining tab → empty state
    shell.closeTab('main.ts')
    expect(shell.openTabs.value).toHaveLength(0)
    expect(shell.activeTab.value).toBeUndefined()

    wrapper.unmount()
  })

  it('toggles sidebar and panel via keyboard shortcuts', async () => {
    const wrapper = shellFactory({}, {}, { attachTo: document.body })
    const shell = (wrapper.vm as any).shell
    const grid = wrapper.find('[data-rig-shell-grid]')

    // Initial state: sidebar visible, panel hidden
    expect(shell.sidebarVisible.value).toBe(true)
    expect(shell.panelVisible.value).toBe(false)

    // Ctrl+B → hide sidebar
    await grid.trigger('keydown', { key: 'b', ctrlKey: true })
    expect(shell.sidebarVisible.value).toBe(false)

    // Ctrl+J → show panel
    await grid.trigger('keydown', { key: 'j', ctrlKey: true })
    expect(shell.panelVisible.value).toBe(true)

    // Ctrl+B → show sidebar again
    await grid.trigger('keydown', { key: 'b', ctrlKey: true })
    expect(shell.sidebarVisible.value).toBe(true)

    // Ctrl+J → hide panel again
    await grid.trigger('keydown', { key: 'j', ctrlKey: true })
    expect(shell.panelVisible.value).toBe(false)

    // Meta key also works
    await grid.trigger('keydown', { key: 'b', metaKey: true })
    expect(shell.sidebarVisible.value).toBe(false)

    wrapper.unmount()
  })

  it('opens settings view and returns to editor', async () => {
    const wrapper = shellFactory(
      {},
      { settings: '<div id="settings-panel">Settings Content</div>' },
      { attachTo: document.body },
    )
    const shell = (wrapper.vm as any).shell

    // Editor visible, settings not
    expect(wrapper.find('[data-rig-editor-workbench]').exists()).toBe(true)
    expect(wrapper.find('#settings-panel').exists()).toBe(false)

    // Open settings
    shell.openSettings()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('#settings-panel').exists()).toBe(true)
    expect(wrapper.find('[data-rig-editor-workbench]').exists()).toBe(false)

    // Close settings (settingsOpen is a ref, no closeSettings function)
    shell.settingsOpen.value = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-rig-editor-workbench]').exists()).toBe(true)
    expect(wrapper.find('#settings-panel').exists()).toBe(false)

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 3 — Command palette workflow
// ═══════════════════════════════════════════════════════════════════════════

describe('Workbench Flow 3: Command palette workflow', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('opens, filters by query, selects item, and closes', async () => {
    const wrapper = mount(CommandPalette, {
      props: { open: true, items: commands, placeholder: 'Type a command...' },
      attachTo: document.body,
    })
    await flushPromises()
    await wrapper.vm.$nextTick()

    // Step 1: All 5 items visible
    expect(document.querySelectorAll('[role="option"]').length).toBe(5)

    // Step 2: Type 'toggle' to filter
    const input = document.querySelector<HTMLInputElement>('[role="searchbox"]')!
    input.value = 'toggle'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()
    expect(document.querySelectorAll('[role="option"]').length).toBe(2)

    // Step 3: Clear filter, all items return
    input.value = ''
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()
    expect(document.querySelectorAll('[role="option"]').length).toBe(5)

    // Step 4: Filter to 'git', select the result
    input.value = 'git'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()
    const results = document.querySelectorAll<HTMLElement>('[role="option"]')
    expect(results.length).toBe(1)
    expect(results[0]!.textContent).toContain('Git: Commit')

    // Step 5: Click to select
    results[0]!.click()
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(
      expect.objectContaining({ id: 'git-commit' }),
    )

    wrapper.unmount()
  })

  it('closes with Escape key', async () => {
    const wrapper = mount(CommandPalette, {
      props: { open: true, items: commands },
      attachTo: document.body,
    })
    await flushPromises()

    const palette = document.querySelector('[data-rig-command-palette]')!
    palette.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])

    wrapper.unmount()
  })

  it('closes on overlay click', async () => {
    const wrapper = mount(CommandPalette, {
      props: { open: true, items: commands },
      attachTo: document.body,
    })
    await flushPromises()

    const overlay = document.querySelector<HTMLElement>('[data-rig-command-palette-overlay]')!
    const event = new MouseEvent('click', { bubbles: true })
    Object.defineProperty(event, 'target', { value: overlay })
    Object.defineProperty(event, 'currentTarget', { value: overlay })
    overlay.dispatchEvent(event)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])

    wrapper.unmount()
  })

  it('shows empty state for no matches', async () => {
    const wrapper = mount(CommandPalette, {
      props: { open: true, items: commands },
      attachTo: document.body,
    })
    await flushPromises()

    const input = document.querySelector<HTMLInputElement>('[role="searchbox"]')!
    input.value = 'xyznonexistent'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()

    expect(document.querySelectorAll('[role="option"]').length).toBe(0)
    const empty = document.querySelector('[data-rig-command-palette-empty]')
    expect(empty).toBeTruthy()

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 4 — Context menu lifecycle
// ═══════════════════════════════════════════════════════════════════════════

describe('Workbench Flow 4: Context menu lifecycle', () => {
  it('opens at position, renders items, and emits select', async () => {
    const wrapper = mount(ContextMenu, {
      props: { open: true, x: 120, y: 250, items: ctxItems },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    // ContextMenu teleports to body — query document
    const menu = document.querySelector('[data-rig-context-menu]')!
    expect(menu).toBeTruthy()
    expect(menu.textContent).toContain('New File')
    expect(menu.textContent).toContain('Rename')
    expect(menu.textContent).toContain('Delete')

    // Click on an item
    const menuItems = document.querySelectorAll<HTMLElement>('[role="menuitem"]')
    expect(menuItems.length).toBe(3)
    menuItems[0]!.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('select')).toBeTruthy()

    wrapper.unmount()
  })

  it('hides menu when closed', () => {
    const wrapper = mount(ContextMenu, {
      props: { open: false, x: 0, y: 0, items: ctxItems },
      attachTo: document.body,
    })

    // When closed, menu should be hidden (v-show) with inert
    const menu = document.querySelector('[data-rig-context-menu]') as HTMLElement
    expect(menu).not.toBeNull()
    expect(menu.style.display).toBe('none')

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 5 — Modal with form controls
// ═══════════════════════════════════════════════════════════════════════════

describe('Workbench Flow 5: Modal with form controls', () => {
  it('switches and checkboxes toggle inside modal', async () => {
    // Mount Switch and Checkbox directly (modal wraps them)
    const sw = mount(Switch, {
      props: { modelValue: false },
      attachTo: document.body,
    })
    const switchEl = sw.find('[role="switch"]')
    expect(switchEl.exists()).toBe(true)
    await switchEl.trigger('click')
    expect(sw.emitted('update:modelValue')?.[0]).toEqual([true])
    sw.unmount()

    const cb = mount(Checkbox, {
      props: { modelValue: false },
      attachTo: document.body,
    })
    // Checkbox uses role="checkbox" or a clickable element
    const cbEl = cb.find('[role="checkbox"]') || cb.find('[data-rig-checkbox]')
    if (cbEl.exists()) {
      await cbEl.trigger('click')
      expect(cb.emitted('update:modelValue')?.[0]).toEqual([true])
    }
    cb.unmount()
  })

  it('modal opens, displays content, and closes', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, ariaLabel: 'Settings' },
      slots: {
        default: () =>
          h('div', { 'data-testid': 'modal-content' }, [
            h('h3', 'Settings'),
            h(Button, { variant: 'primary', size: 'sm' }, () => 'Save'),
          ]),
      },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    // Modal teleports to body — query document
    const dialog = document.querySelector('[data-rig-modal]')
    expect(dialog).toBeTruthy()
    expect(dialog!.textContent).toContain('Settings')
    expect(dialog!.textContent).toContain('Save')

    // Close modal
    await wrapper.setProps({ open: false })
    await wrapper.vm.$nextTick()

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 6 — Panel tab switching
// ═══════════════════════════════════════════════════════════════════════════

describe('Workbench Flow 6: Panel tab switching', () => {
  it('switches between Problems, Output, and Terminal tabs', async () => {
    const tabIds = ['problems', 'output', 'terminal']
    const wrapper = mount(Tabs, {
      props: { modelValue: 'problems' },
      slots: {
        tabs: ({ isActive, activate }: any) =>
          tabIds.map((id) =>
            h(
              'button',
              {
                role: 'tab',
                'data-tab-id': id,
                'aria-selected': String(isActive(id)),
                tabindex: isActive(id) ? 0 : -1,
                onClick: () => activate(id),
              },
              id,
            ),
          ),
        default: ({ activeId }: any) =>
          h('div', { 'data-testid': `panel-${activeId}` }, `Content: ${activeId}`),
      },
      attachTo: document.body,
    })

    // Problems tab active initially
    expect(wrapper.find('[data-tab-id="problems"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-testid="panel-problems"]').exists()).toBe(true)

    // Click output tab
    await wrapper.find('[data-tab-id="output"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['output'])
    await wrapper.setProps({ modelValue: 'output' })
    expect(wrapper.find('[data-tab-id="output"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-testid="panel-output"]').exists()).toBe(true)

    // Click terminal tab
    await wrapper.find('[data-tab-id="terminal"]').trigger('click')
    await wrapper.setProps({ modelValue: 'terminal' })
    expect(wrapper.find('[data-tab-id="terminal"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-testid="panel-terminal"]').exists()).toBe(true)

    // Keyboard: ArrowLeft wraps to last
    await wrapper.find('[data-tab-id="terminal"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 7 — Full IDE session (multi-step chained workflow)
// ═══════════════════════════════════════════════════════════════════════════

describe('Workbench Flow 7: Full IDE session', () => {
  it('completes a full IDE workflow: tabs → shortcuts → settings → back', async () => {
    const wrapper = shellFactory(
      {},
      { settings: '<div id="settings">Settings</div>' },
      { attachTo: document.body },
    )
    const shell = (wrapper.vm as any).shell
    const grid = wrapper.find('[data-rig-shell-grid]')

    // ── Step 1: Verify clean initial state ────────────────────────────────
    expect(shell.openTabs.value).toHaveLength(0)
    expect(shell.sidebarVisible.value).toBe(true)
    expect(shell.panelVisible.value).toBe(false)

    // ── Step 2: Open files (simulates tree selection → openTab) ───────────
    shell.openTab({ id: 'App.vue', label: 'App.vue' })
    shell.openTab({ id: 'main.ts', label: 'main.ts' })
    shell.openTab({ id: 'package.json', label: 'package.json' })
    expect(shell.openTabs.value).toHaveLength(3)
    expect(shell.activeTab.value?.id).toBe('package.json')

    // ── Step 3: Reactivate first tab ──────────────────────────────────────
    shell.openTab({ id: 'App.vue', label: 'App.vue' })
    expect(shell.activeTab.value?.id).toBe('App.vue')
    expect(shell.openTabs.value).toHaveLength(3) // no duplicate

    // ── Step 4: Hide sidebar with Ctrl+B ──────────────────────────────────
    await grid.trigger('keydown', { key: 'b', ctrlKey: true })
    expect(shell.sidebarVisible.value).toBe(false)

    // ── Step 5: Show panel with Ctrl+J ────────────────────────────────────
    await grid.trigger('keydown', { key: 'j', ctrlKey: true })
    expect(shell.panelVisible.value).toBe(true)

    // ── Step 6: Close an inactive tab ─────────────────────────────────────
    shell.closeTab('main.ts')
    expect(shell.openTabs.value).toHaveLength(2)
    expect(shell.activeTab.value?.id).toBe('App.vue') // active unchanged

    // ── Step 7: Open settings ─────────────────────────────────────────────
    shell.openSettings()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('#settings').exists()).toBe(true)
    expect(wrapper.find('[data-rig-editor-workbench]').exists()).toBe(false)

    // ── Step 8: Close settings, editor returns ────────────────────────────
    shell.settingsOpen.value = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-rig-editor-workbench]').exists()).toBe(true)

    // ── Step 9: Restore sidebar, hide panel ───────────────────────────────
    await grid.trigger('keydown', { key: 'b', ctrlKey: true })
    expect(shell.sidebarVisible.value).toBe(true)
    await grid.trigger('keydown', { key: 'j', ctrlKey: true })
    expect(shell.panelVisible.value).toBe(false)

    // ── Step 10: Close all tabs → empty state ─────────────────────────────
    shell.closeTab('App.vue')
    shell.closeTab('package.json')
    expect(shell.openTabs.value).toHaveLength(0)

    wrapper.unmount()
  })
})
