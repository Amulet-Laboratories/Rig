import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, inject } from 'vue'
import { useGlobalState } from './useGlobalState'
import { GlobalStateKey } from '../injection-keys'

function createProvider() {
  return mount(
    defineComponent({
      setup() {
        const state = useGlobalState({ provide: true })
        return { state }
      },
      template: '<div />',
    }),
  )
}

describe('useGlobalState', () => {
  it('initializes with default values', () => {
    const wrapper = createProvider()
    const s = wrapper.vm.state

    expect(s.openEditors.value).toEqual([])
    expect(s.activeEditorId.value).toBeNull()
    expect(s.sidebarVisible.value).toBe(true)
    expect(s.panelVisible.value).toBe(true)
    expect(s.sizes.value.sideWidth).toBe(260)
    expect(s.sizes.value.panelHeight).toBe(200)
  })

  it('opens and activates an editor tab', () => {
    const wrapper = createProvider()
    const s = wrapper.vm.state

    s.openEditor({ id: 'file-1', label: 'file.ts' })
    expect(s.openEditors.value).toHaveLength(1)
    expect(s.activeEditorId.value).toBe('file-1')
  })

  it('does not duplicate editor tabs', () => {
    const wrapper = createProvider()
    const s = wrapper.vm.state

    s.openEditor({ id: 'file-1', label: 'file.ts' })
    s.openEditor({ id: 'file-1', label: 'file.ts' })
    expect(s.openEditors.value).toHaveLength(1)
  })

  it('closes editor and activates next', () => {
    const wrapper = createProvider()
    const s = wrapper.vm.state

    s.openEditor({ id: 'a', label: 'a.ts' })
    s.openEditor({ id: 'b', label: 'b.ts' })
    s.openEditor({ id: 'c', label: 'c.ts' })
    s.setActiveEditor('b')

    s.closeEditor('b')
    expect(s.openEditors.value).toHaveLength(2)
    expect(s.activeEditorId.value).toBe('c')
  })

  it('toggles sidebar and panel', () => {
    const wrapper = createProvider()
    const s = wrapper.vm.state

    s.toggleSidebar()
    expect(s.sidebarVisible.value).toBe(false)
    s.toggleSidebar()
    expect(s.sidebarVisible.value).toBe(true)

    s.togglePanel()
    expect(s.panelVisible.value).toBe(false)
  })

  it('provides state via injection key', () => {
    let injectedState: ReturnType<typeof useGlobalState> | null = null

    const parent = defineComponent({
      setup() {
        useGlobalState({ provide: true })
      },
      template: '<slot />',
    })

    const child = defineComponent({
      setup() {
        injectedState = inject(GlobalStateKey, null)
      },
      template: '<div />',
    })

    mount(parent, {
      slots: { default: child },
    })

    expect(injectedState).not.toBeNull()
  })

  it('creates standalone instance when no provider', () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const state = useGlobalState()
          return { state }
        },
        template: '<div />',
      }),
    )

    expect(wrapper.vm.state.sidebarVisible.value).toBe(true)
  })

  describe('editor management edge cases', () => {
    it('closes the last editor and sets activeEditorId to null', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.openEditor({ id: 'only', label: 'only.ts' })
      expect(s.activeEditorId.value).toBe('only')

      s.closeEditor('only')
      expect(s.openEditors.value).toHaveLength(0)
      expect(s.activeEditorId.value).toBeNull()
    })

    it('closing first editor activates next', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.openEditor({ id: 'a', label: 'a.ts' })
      s.openEditor({ id: 'b', label: 'b.ts' })
      s.setActiveEditor('a')

      s.closeEditor('a')
      expect(s.activeEditorId.value).toBe('b')
    })

    it('closing last editor in list activates previous', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.openEditor({ id: 'a', label: 'a.ts' })
      s.openEditor({ id: 'b', label: 'b.ts' })
      s.setActiveEditor('b')

      s.closeEditor('b')
      expect(s.activeEditorId.value).toBe('a')
    })

    it('closing non-active editor preserves activeEditorId', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.openEditor({ id: 'a', label: 'a.ts' })
      s.openEditor({ id: 'b', label: 'b.ts' })
      s.openEditor({ id: 'c', label: 'c.ts' })
      s.setActiveEditor('c')

      s.closeEditor('a')
      expect(s.activeEditorId.value).toBe('c')
      expect(s.openEditors.value).toHaveLength(2)
    })

    it('closing a non-existent editor is a no-op', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.openEditor({ id: 'a', label: 'a.ts' })
      s.closeEditor('nonexistent')
      expect(s.openEditors.value).toHaveLength(1)
      expect(s.activeEditorId.value).toBe('a')
    })

    it('setActiveEditor changes active without modifying tabs', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.openEditor({ id: 'a', label: 'a.ts' })
      s.openEditor({ id: 'b', label: 'b.ts' })
      s.setActiveEditor('a')

      expect(s.activeEditorId.value).toBe('a')
      expect(s.openEditors.value).toHaveLength(2)
    })

    it('setActiveEditor to null clears active', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.openEditor({ id: 'a', label: 'a.ts' })
      s.setActiveEditor(null)

      expect(s.activeEditorId.value).toBeNull()
    })

    it('re-opening existing editor activates it without duplicating', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.openEditor({ id: 'a', label: 'a.ts' })
      s.openEditor({ id: 'b', label: 'b.ts' })
      expect(s.activeEditorId.value).toBe('b')

      s.openEditor({ id: 'a', label: 'a.ts' })
      expect(s.activeEditorId.value).toBe('a')
      expect(s.openEditors.value).toHaveLength(2)
    })
  })

  describe('layout toggles', () => {
    it('toggles panel multiple times', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      expect(s.panelVisible.value).toBe(true)
      s.togglePanel()
      expect(s.panelVisible.value).toBe(false)
      s.togglePanel()
      expect(s.panelVisible.value).toBe(true)
    })

    it('sidebar and panel are independent', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.toggleSidebar()
      expect(s.sidebarVisible.value).toBe(false)
      expect(s.panelVisible.value).toBe(true)

      s.togglePanel()
      expect(s.sidebarVisible.value).toBe(false)
      expect(s.panelVisible.value).toBe(false)
    })
  })

  describe('sizes', () => {
    it('has default layout sizes', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      expect(s.sizes.value).toEqual({
        sideWidth: 260,
        panelHeight: 200,
      })
    })

    it('sizes are reactive', () => {
      const wrapper = createProvider()
      const s = wrapper.vm.state

      s.sizes.value = { sideWidth: 300, panelHeight: 250 }
      expect(s.sizes.value.sideWidth).toBe(300)
      expect(s.sizes.value.panelHeight).toBe(250)
    })
  })
})
