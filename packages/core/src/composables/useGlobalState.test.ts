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
})
