import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Menubar from './Menubar.vue'
import type { MenubarEntry } from './Menubar.vue'
import type { Action } from '@core/types'

const entries: MenubarEntry[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New File', keybinding: 'Ctrl+N' },
      { id: 'open', label: 'Open', keybinding: 'Ctrl+O' },
      { id: 'disabled-save', label: 'Save', disabled: true },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', keybinding: 'Ctrl+Z' },
      { id: 'redo', label: 'Redo', keybinding: 'Ctrl+Y' },
    ],
  },
]

function factory() {
  return mount(Menubar, { props: { items: entries }, attachTo: document.body })
}

describe('Menubar', () => {
  it('renders with data-rig-menubar and role="menubar"', () => {
    const wrapper = factory()
    expect(wrapper.attributes('data-rig-menubar')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('menubar')
    wrapper.unmount()
  })

  it('renders a trigger for each entry', () => {
    const wrapper = factory()
    expect(wrapper.findAll('[data-rig-menubar-trigger]')).toHaveLength(2)
    wrapper.unmount()
  })

  it('entries start closed', () => {
    const wrapper = factory()
    const entry = wrapper.find('[data-rig-menubar-entry]')
    expect(entry.attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('opens menu on trigger click', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('closes menu on second trigger click', async () => {
    const wrapper = factory()
    const trigger = wrapper.findAll('[data-rig-menubar-trigger]')[0]!
    await trigger.trigger('click')
    await trigger.trigger('click')
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('shows menu items when open', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const content = wrapper.find('[data-rig-menubar-content]')
    expect(content.findAll('[data-rig-menubar-item]')).toHaveLength(3)
    wrapper.unmount()
  })

  it('emits select when item is clicked', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const items = wrapper.findAll('[data-rig-menubar-item]')
    await items[0]!.trigger('click')
    const emitted = wrapper.emitted('select')?.[0] as Action[]
    expect(emitted[0]!.id).toBe('new')
    wrapper.unmount()
  })

  it('does not emit select for disabled items', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const items = wrapper.findAll('[data-rig-menubar-item]')
    await items[2]!.trigger('click') // disabled-save
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })

  it('marks disabled items with data-disabled', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const items = wrapper.findAll('[data-rig-menubar-item]')
    expect(items[2]!.attributes('data-disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('closes open menu on Escape', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('renders keybindings', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const kb = wrapper.find('[data-rig-menubar-item-keybinding]')
    expect(kb.text()).toBe('Ctrl+N')
    wrapper.unmount()
  })

  it('ArrowRight moves focus to next trigger', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    ;(triggers[0]!.element as HTMLButtonElement).focus()
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(triggers[1]!.element)
    wrapper.unmount()
  })

  it('updates triggers when items prop changes', async () => {
    const wrapper = factory()
    expect(wrapper.findAll('[data-rig-menubar-trigger]')).toHaveLength(2)
    await wrapper.setProps({ items: [{ id: 'view', label: 'View', items: [] }] })
    expect(wrapper.findAll('[data-rig-menubar-trigger]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('ArrowLeft moves focus to previous trigger', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    ;(triggers[1]!.element as HTMLButtonElement).focus()
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(triggers[0]!.element)
    wrapper.unmount()
  })

  it('ArrowLeft wraps from first to last trigger', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    ;(triggers[0]!.element as HTMLButtonElement).focus()
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(triggers[1]!.element)
    wrapper.unmount()
  })

  it('ArrowRight wraps from last to first trigger', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    ;(triggers[1]!.element as HTMLButtonElement).focus()
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(triggers[0]!.element)
    wrapper.unmount()
  })

  it('Home moves focus to first trigger', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    ;(triggers[1]!.element as HTMLButtonElement).focus()
    await wrapper.trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(triggers[0]!.element)
    wrapper.unmount()
  })

  it('End moves focus to last trigger', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    ;(triggers[0]!.element as HTMLButtonElement).focus()
    await wrapper.trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(triggers[1]!.element)
    wrapper.unmount()
  })

  it('Enter on trigger opens menu', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    await triggers[0]!.trigger('keydown', { key: 'Enter' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('Space on trigger opens menu', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    await triggers[0]!.trigger('keydown', { key: ' ' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('ArrowDown on trigger opens menu', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    await triggers[0]!.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('ArrowDown in open menu moves focus to next item', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const content = wrapper.find('[data-rig-menubar-content]')
    await content.trigger('keydown', { key: 'ArrowDown' })
    const items = wrapper.findAll('[data-rig-menubar-item]:not([disabled])')
    expect(document.activeElement).toBe(items[1]!.element)
    wrapper.unmount()
  })

  it('ArrowUp in open menu moves focus to previous item', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const content = wrapper.find('[data-rig-menubar-content]')
    // Move down first
    await content.trigger('keydown', { key: 'ArrowDown' })
    await content.trigger('keydown', { key: 'ArrowUp' })
    const items = wrapper.findAll('[data-rig-menubar-item]:not([disabled])')
    expect(document.activeElement).toBe(items[0]!.element)
    wrapper.unmount()
  })

  it('Home in open menu focuses first item', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const content = wrapper.find('[data-rig-menubar-content]')
    await content.trigger('keydown', { key: 'ArrowDown' })
    await content.trigger('keydown', { key: 'Home' })
    const items = wrapper.findAll('[data-rig-menubar-item]:not([disabled])')
    expect(document.activeElement).toBe(items[0]!.element)
    wrapper.unmount()
  })

  it('End in open menu focuses last item', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[1]!.trigger('click')
    const content = wrapper.findAll('[data-rig-menubar-content]')[1]!
    await content.trigger('keydown', { key: 'End' })
    const items = content.findAll('[data-rig-menubar-item]:not([disabled])')
    expect(document.activeElement).toBe(items[items.length - 1]!.element)
    wrapper.unmount()
  })

  it('ArrowRight in open menu opens next menu', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const content = wrapper.find('[data-rig-menubar-content]')
    await content.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[1]!.attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('ArrowLeft in open menu opens previous menu', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[1]!.trigger('click')
    const content = wrapper.findAll('[data-rig-menubar-content]')[1]!
    await content.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('Tab in open menu closes the menu', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    const content = wrapper.find('[data-rig-menubar-content]')
    await content.trigger('keydown', { key: 'Tab' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('Escape in open menu closes and refocuses trigger', async () => {
    const wrapper = factory()
    const trigger = wrapper.findAll('[data-rig-menubar-trigger]')[0]!
    await trigger.trigger('click')
    const content = wrapper.find('[data-rig-menubar-content]')
    await content.trigger('keydown', { key: 'Escape' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('closed')
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('selecting item closes menu and refocuses trigger', async () => {
    const wrapper = factory()
    const trigger = wrapper.findAll('[data-rig-menubar-trigger]')[0]!
    await trigger.trigger('click')
    const items = wrapper.findAll('[data-rig-menubar-item]')
    await items[0]!.trigger('click')
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('closed')
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('closes menu on click outside', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('open')
    // Simulate outside click
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('[data-rig-menubar-entry]')[0]!.attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('ArrowRight while menu open switches to next menu', async () => {
    const wrapper = factory()
    await wrapper.findAll('[data-rig-menubar-trigger]')[0]!.trigger('click')
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.findAll('[data-rig-menubar-entry]')[1]!.attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('focus on trigger updates focusedIndex', async () => {
    const wrapper = factory()
    const triggers = wrapper.findAll('[data-rig-menubar-trigger]')
    await triggers[1]!.trigger('focus')
    // verify second trigger now has tabindex 0
    expect(triggers[1]!.attributes('tabindex')).toBe('0')
    expect(triggers[0]!.attributes('tabindex')).toBe('-1')
    wrapper.unmount()
  })
})
