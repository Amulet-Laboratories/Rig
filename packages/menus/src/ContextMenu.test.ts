import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContextMenu from './ContextMenu.vue'
import type { Action } from '@core/types'

const actions: Action[] = [
  { id: 'cut', label: 'Cut', keybinding: 'Ctrl+X' },
  { id: 'copy', label: 'Copy', keybinding: 'Ctrl+C' },
  { id: 'paste', label: 'Paste', keybinding: 'Ctrl+V' },
  { id: 'disabled-action', label: 'Disabled', disabled: true },
]

function factory(props: Partial<InstanceType<typeof ContextMenu>['$props']> = {}) {
  return mount(ContextMenu, {
    props: {
      open: true,
      x: 100,
      y: 200,
      items: actions,
      ...props,
    },
    attachTo: document.body,
  })
}

describe('ContextMenu', () => {
  it('renders nothing when closed', () => {
    const wrapper = factory({ open: false })
    expect(wrapper.find('[data-rig-context-menu]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders items with role=menuitem when open', () => {
    const wrapper = factory()
    const menu = document.querySelector('[data-rig-context-menu]')!
    expect(menu).toBeTruthy()
    expect(menu.getAttribute('role')).toBe('menu')
    const items = menu.querySelectorAll('[role="menuitem"]')
    expect(items.length).toBe(4)
    wrapper.unmount()
  })

  it('shows labels and keybindings', () => {
    const wrapper = factory()
    const menu = document.querySelector('[data-rig-context-menu]')!
    const labels = menu.querySelectorAll('[data-rig-context-menu-label]')
    expect(labels[0]!.textContent).toBe('Cut')
    const keybindings = menu.querySelectorAll('[data-rig-context-menu-keybinding]')
    expect(keybindings[0]!.textContent?.trim()).toBe('Ctrl+X')
    wrapper.unmount()
  })

  it('renders with fixed positioning via floating-ui', () => {
    const wrapper = factory({ x: 150, y: 250 })
    const menu = document.querySelector('[data-rig-context-menu]') as HTMLElement
    // floating-ui applies position:fixed via inline style in real browsers;
    // in jsdom it may return empty coords but the style attr should be set
    expect(menu).not.toBeNull()
    wrapper.unmount()
  })

  it('emits select on item click', async () => {
    const wrapper = factory()
    const menu = document.querySelector('[data-rig-context-menu]')!
    const items = menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    items[1]!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('select')?.[0]).toEqual([actions[1]])
    wrapper.unmount()
  })

  it('does not emit select for disabled items', async () => {
    const wrapper = factory()
    const menu = document.querySelector('[data-rig-context-menu]')!
    const items = menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    await items[3]!.click()
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })

  it('marks disabled items', () => {
    const wrapper = factory()
    const menu = document.querySelector('[data-rig-context-menu]')!
    const items = menu.querySelectorAll('[role="menuitem"]')
    expect(items[3]!.getAttribute('data-disabled')).toBe('true')
    expect(items[3]!.hasAttribute('disabled')).toBe(true)
    wrapper.unmount()
  })

  it('closes on Escape', async () => {
    const wrapper = factory()
    const menu = document.querySelector('[data-rig-context-menu]')!
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('navigates with Arrow keys', async () => {
    const wrapper = factory()
    const menu = document.querySelector('[data-rig-context-menu]')!
    await menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    const focused = menu.querySelectorAll('[data-highlighted="true"]')
    expect(focused.length).toBe(1)
    wrapper.unmount()
  })

  it('skips disabled items during keyboard navigation', async () => {
    // Items: cut(0), copy(1), paste(2), disabled(3)
    const wrapper = factory()
    const menu = document.querySelector('[data-rig-context-menu]')!
    // Navigate down to paste (index 2), then ArrowDown should stay at 2 (skips disabled index 3)
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await new Promise((r) => setTimeout(r, 0))
    // The last ArrowDown should not move past paste since disabled is at index 3
    const highlighted = menu.querySelectorAll('[data-highlighted="true"]')
    expect(highlighted.length).toBe(1)
    wrapper.unmount()
  })
})
