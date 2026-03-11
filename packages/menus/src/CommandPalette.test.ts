import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CommandPalette from './CommandPalette.vue'
import type { ListItem } from '@core/types'

const items: ListItem[] = [
  { id: 'file-open', label: 'Open File', description: 'Open a file from disk' },
  { id: 'file-save', label: 'Save File', description: 'Save current file' },
  { id: 'git-commit', label: 'Git: Commit', description: 'Commit staged changes' },
  { id: 'disabled-cmd', label: 'Disabled Command', disabled: true },
]

function factory(props: Partial<InstanceType<typeof CommandPalette>['$props']> = {}) {
  return mount(CommandPalette, {
    props: {
      open: true,
      items,
      ...props,
    },
    attachTo: document.body,
  })
}

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when closed', () => {
    const wrapper = factory({ open: false })
    expect(document.querySelector('[data-rig-command-palette]')).toBeNull()
    wrapper.unmount()
  })

  it('renders combobox with searchbox when open', async () => {
    const wrapper = factory()
    await flushPromises()
    const palette = document.querySelector('[data-rig-command-palette]')!
    expect(palette.getAttribute('role')).toBe('combobox')
    const input = palette.querySelector('[role="searchbox"]')
    expect(input).toBeTruthy()
    wrapper.unmount()
  })

  it('shows all items initially', async () => {
    const wrapper = factory()
    await flushPromises()
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(4)
    wrapper.unmount()
  })

  it('filters items by query', async () => {
    const wrapper = factory()
    await flushPromises()
    const input = document.querySelector<HTMLInputElement>('[role="searchbox"]')!
    input.value = 'git'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(1)
    expect(options[0]!.textContent).toContain('Git: Commit')
    wrapper.unmount()
  })

  it('shows empty state when no results', async () => {
    const wrapper = factory()
    await flushPromises()
    const input = document.querySelector<HTMLInputElement>('[role="searchbox"]')!
    input.value = 'xxxxxxxxx'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()
    const empty = document.querySelector('[data-rig-command-palette-empty]')
    expect(empty).toBeTruthy()
    expect(empty!.textContent).toContain('No results')
    wrapper.unmount()
  })

  it('emits select on item click', async () => {
    const wrapper = factory()
    await flushPromises()
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll<HTMLElement>('[role="option"]')
    expect(options.length).toBeGreaterThan(0)
    options[0]!.click()
    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
    wrapper.unmount()
  })

  it('does not emit select for disabled items', async () => {
    const wrapper = factory()
    await flushPromises()
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll<HTMLElement>('[role="option"]')
    options[3]!.click()
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })

  it('closes on Escape', async () => {
    const wrapper = factory()
    await flushPromises()
    const palette = document.querySelector('[data-rig-command-palette]')!
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    palette.dispatchEvent(event)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on overlay click', async () => {
    const wrapper = factory()
    await flushPromises()
    const overlay = document.querySelector('[data-rig-command-palette-overlay]') as HTMLElement
    // Click on the overlay itself (not a child)
    const event = new MouseEvent('click', { bubbles: true })
    Object.defineProperty(event, 'target', { value: overlay })
    Object.defineProperty(event, 'currentTarget', { value: overlay })
    overlay.dispatchEvent(event)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('supports async items function', async () => {
    const asyncItems = vi.fn(async (q: string) => {
      return items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))
    })
    const wrapper = factory({ items: asyncItems })
    await flushPromises()
    expect(asyncItems).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('marks focused item with aria-selected', async () => {
    const wrapper = factory()
    await flushPromises()
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options[0]!.getAttribute('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('uses custom placeholder', async () => {
    const wrapper = factory({ placeholder: 'Search commands...' })
    await flushPromises()
    const input = document.querySelector<HTMLInputElement>('[role="searchbox"]')!
    expect(input.placeholder).toBe('Search commands...')
    wrapper.unmount()
  })
})
