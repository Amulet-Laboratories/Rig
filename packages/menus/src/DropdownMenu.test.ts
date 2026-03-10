import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DropdownMenu from './DropdownMenu.vue'
import type { Action } from '@core/types'

const items: Action[] = [
  { id: 'new', label: 'New File', keybinding: 'Ctrl+N' },
  { id: 'open', label: 'Open', keybinding: 'Ctrl+O' },
  { id: 'save', label: 'Save', keybinding: 'Ctrl+S' },
  { id: 'disabled-item', label: 'Read Only', disabled: true },
]

function factory(props: Partial<InstanceType<typeof DropdownMenu>['$props']> = {}) {
  return mount(DropdownMenu, {
    props: { open: false, items, ...props },
    slots: {
      trigger: '<button data-test-trigger>Menu</button>',
    },
    attachTo: document.body,
  })
}

describe('DropdownMenu', () => {
  it('renders with data-rig-dropdown', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-dropdown]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('reflects closed data-state when closed', () => {
    const wrapper = factory({ open: false })
    expect(wrapper.find('[data-rig-dropdown]').attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('reflects open data-state when open', () => {
    const wrapper = factory({ open: true })
    expect(wrapper.find('[data-rig-dropdown]').attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('renders trigger slot', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-test-trigger]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('teleports menu to body when open', () => {
    const wrapper = factory({ open: true })
    const menu = document.querySelector('[data-rig-dropdown-menu]')
    expect(menu).not.toBeNull()
    wrapper.unmount()
  })

  it('renders all items as menuitem buttons', () => {
    const wrapper = factory({ open: true })
    const menu = document.querySelector('[data-rig-dropdown-menu]')!
    const menuItems = menu.querySelectorAll('[role="menuitem"]')
    expect(menuItems.length).toBe(4)
    wrapper.unmount()
  })

  it('shows item labels and keybindings', () => {
    const wrapper = factory({ open: true })
    const menu = document.querySelector('[data-rig-dropdown-menu]')!
    const labels = menu.querySelectorAll('[data-rig-dropdown-item-label]')
    expect(labels[0].textContent).toBe('New File')
    const keybindings = menu.querySelectorAll('[data-rig-dropdown-item-keybinding]')
    expect(keybindings[0].textContent?.trim()).toBe('Ctrl+N')
    wrapper.unmount()
  })

  it('emits select on item click', async () => {
    const wrapper = factory({ open: true })
    const menu = document.querySelector('[data-rig-dropdown-menu]')!
    const menuItems = menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    menuItems[1].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('select')?.[0]).toEqual([items[1]])
    wrapper.unmount()
  })

  it('does not emit select for disabled items', async () => {
    const wrapper = factory({ open: true })
    const menu = document.querySelector('[data-rig-dropdown-menu]')!
    const menuItems = menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    menuItems[3].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })

  it('marks disabled items with data-disabled', () => {
    const wrapper = factory({ open: true })
    const menu = document.querySelector('[data-rig-dropdown-menu]')!
    const menuItems = menu.querySelectorAll('[role="menuitem"]')
    expect(menuItems[3].getAttribute('data-disabled')).toBe('true')
    wrapper.unmount()
  })

  it('emits update:open false on Escape key', async () => {
    const wrapper = factory({ open: true })
    const menu = document.querySelector('[data-rig-dropdown-menu]')!
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('emits update:open true when trigger is clicked', async () => {
    const wrapper = factory({ open: false })
    await wrapper.find('[data-rig-dropdown-trigger]').trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    wrapper.unmount()
  })

  it('closes and emits select on Enter key', async () => {
    const wrapper = factory({ open: true })
    const menu = document.querySelector('[data-rig-dropdown-menu]')!
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
    wrapper.unmount()
  })
})
