import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, inject } from 'vue'
import { useCommandRegistry } from './useCommandRegistry'
import { CommandRegistryKey } from '../injection-keys'

function createProvider() {
  return mount(
    defineComponent({
      setup() {
        const registry = useCommandRegistry({ provide: true })
        return { registry }
      },
      template: '<div />',
    }),
  )
}

describe('useCommandRegistry', () => {
  it('registers and lists commands', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry

    r.register({ id: 'cmd-1', label: 'Open File', handler: () => {} })
    r.register({ id: 'cmd-2', label: 'Save File', handler: () => {} })

    expect(r.list()).toHaveLength(2)
  })

  it('unregisters commands', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry

    r.register({ id: 'cmd-1', label: 'Test', handler: () => {} })
    r.unregister('cmd-1')

    expect(r.list()).toHaveLength(0)
  })

  it('executes command handler', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry
    const handler = vi.fn()

    r.register({ id: 'cmd-1', label: 'Test', handler })
    r.execute('cmd-1')

    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not execute disabled commands', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry
    const handler = vi.fn()

    r.register({ id: 'cmd-1', label: 'Test', handler, disabled: true })
    r.execute('cmd-1')

    expect(handler).not.toHaveBeenCalled()
  })

  it('fuzzy searches commands', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry

    r.register({ id: 'cmd-1', label: 'Open File', category: 'File', handler: () => {} })
    r.register({ id: 'cmd-2', label: 'Save File', category: 'File', handler: () => {} })
    r.register({ id: 'cmd-3', label: 'Toggle Panel', category: 'View', handler: () => {} })

    const results = r.search('ofl')
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results.some((c) => c.id === 'cmd-1')).toBe(true)
  })

  it('returns all commands for empty search', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry

    r.register({ id: 'cmd-1', label: 'A', handler: () => {} })
    r.register({ id: 'cmd-2', label: 'B', handler: () => {} })

    expect(r.search('')).toHaveLength(2)
  })

  it('provides via injection key', () => {
    let injected: ReturnType<typeof useCommandRegistry> | null = null

    const parent = defineComponent({
      setup() {
        useCommandRegistry({ provide: true })
      },
      template: '<slot />',
    })

    const child = defineComponent({
      setup() {
        injected = inject(CommandRegistryKey, null)
      },
      template: '<div />',
    })

    mount(parent, { slots: { default: child } })
    expect(injected).not.toBeNull()
  })

  it('does not throw when executing nonexistent command', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry
    expect(() => r.execute('bogus')).not.toThrow()
  })

  it('does not throw when executing command without handler', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry
    // @ts-expect-error — handler intentionally omitted
    r.register({ id: 'cmd-no-handler', label: 'No Handler' })
    expect(() => r.execute('cmd-no-handler')).not.toThrow()
  })

  it('overwrites command on duplicate register', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry
    const h1 = vi.fn()
    const h2 = vi.fn()

    r.register({ id: 'dup', label: 'First', handler: h1 })
    r.register({ id: 'dup', label: 'Second', handler: h2 })

    expect(r.list()).toHaveLength(1)
    expect(r.list()[0]!.label).toBe('Second')

    r.execute('dup')
    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalledOnce()
  })

  it('does not throw when unregistering nonexistent command', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry
    expect(() => r.unregister('nonexistent')).not.toThrow()
  })

  it('search is case-insensitive', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry

    r.register({ id: 'cmd-1', label: 'Open File', handler: () => {} })
    const lower = r.search('open file')
    const upper = r.search('OPEN FILE')
    const mixed = r.search('OpEn FiLe')

    expect(lower.length).toBeGreaterThanOrEqual(1)
    expect(upper.length).toBe(lower.length)
    expect(mixed.length).toBe(lower.length)
  })

  it('search works when commands have no category', () => {
    const wrapper = createProvider()
    const r = wrapper.vm.registry

    r.register({ id: 'cmd-1', label: 'Hello World', handler: () => {} })
    const results = r.search('hello')
    expect(results).toHaveLength(1)
  })

  it('standalone fallback works without provider', () => {
    let registry: ReturnType<typeof useCommandRegistry> | null = null

    const Standalone = defineComponent({
      setup() {
        registry = useCommandRegistry()
        return {}
      },
      template: '<div />',
    })

    mount(Standalone)
    expect(registry).not.toBeNull()
    registry!.register({ id: 'test', label: 'Test', handler: () => {} })
    expect(registry!.list()).toHaveLength(1)
  })
})
