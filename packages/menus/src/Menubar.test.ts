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
})
