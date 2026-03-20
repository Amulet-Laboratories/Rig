import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavigationMenu from './NavigationMenu.vue'

const items = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'products',
    label: 'Products',
    children: [
      { id: 'widget', label: 'Widget', href: '/widget' },
      { id: 'gadget', label: 'Gadget' },
    ],
  },
  { id: 'about', label: 'About' },
]

describe('NavigationMenu', () => {
  it('renders with data-rig-nav-menu', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    expect(wrapper.find('[data-rig-nav-menu]').exists()).toBe(true)
  })

  it('has navigation role', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    expect(wrapper.find('[data-rig-nav-menu]').attributes('role')).toBe('navigation')
  })

  it('sets aria-label', () => {
    const wrapper = mount(NavigationMenu, {
      props: { items, ariaLabel: 'Site nav' },
    })
    expect(wrapper.find('[data-rig-nav-menu]').attributes('aria-label')).toBe('Site nav')
  })

  it('defaults aria-label to Main navigation', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    expect(wrapper.find('[data-rig-nav-menu]').attributes('aria-label')).toBe('Main navigation')
  })

  it('renders menubar', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    expect(wrapper.find('[role="menubar"]').exists()).toBe(true)
  })

  it('renders menu items', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const menuItems = wrapper.findAll('[data-rig-nav-menu-item]')
    expect(menuItems).toHaveLength(3)
  })

  it('renders link items as anchor tags', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const link = wrapper.find('[data-rig-nav-menu-link]')
    expect(link.element.tagName).toBe('A')
    expect(link.attributes('href')).toBe('/')
  })

  it('renders parent items as buttons with aria-haspopup', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    expect(trigger.attributes('aria-haspopup')).toBe('true')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('opens submenu on trigger click', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    expect(wrapper.find('[data-rig-nav-menu-content]').exists()).toBe(true)
    expect(trigger.attributes('aria-expanded')).toBe('true')
  })

  it('closes submenu on second trigger click', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    expect(wrapper.find('[data-rig-nav-menu-content]').exists()).toBe(true)
    await trigger.trigger('click')
    expect(wrapper.find('[data-rig-nav-menu-content]').exists()).toBe(false)
  })

  it('renders child items in submenu', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    const childItems = wrapper.findAll('[data-rig-nav-menu-content] [role="menuitem"]')
    expect(childItems).toHaveLength(2)
  })

  it('emits select on child item click', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    const childItems = wrapper.findAll('[data-rig-nav-menu-content] [role="menuitem"]')
    await childItems[1].trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([{ id: 'gadget', label: 'Gadget' }])
  })

  it('emits select on top-level link click', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const link = wrapper.find('[data-rig-nav-menu-link]')
    await link.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
  })

  it('navigates focus with ArrowRight', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const menubar = wrapper.find('[role="menubar"]')
    await menubar.trigger('keydown', { key: 'ArrowRight' })
    // Focus should move from 0 to 1 — trigger should gain data-active
    const triggers = wrapper.findAll('[data-rig-nav-menu-trigger]')
    expect(triggers[0].attributes('data-active')).toBeDefined()
  })

  it('navigates focus with ArrowLeft', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const menubar = wrapper.find('[role="menubar"]')
    // ArrowLeft from index 0 wraps to last
    await menubar.trigger('keydown', { key: 'ArrowLeft' })
    const allItems = wrapper.findAll('[data-rig-nav-menu-item]')
    const lastButton = allItems[2].find('[role="menuitem"]')
    expect(lastButton?.attributes('data-active')).toBeDefined()
  })

  it('opens submenu with ArrowDown', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const menubar = wrapper.find('[role="menubar"]')
    // Move to products (index 1)
    await menubar.trigger('keydown', { key: 'ArrowRight' })
    // ArrowDown opens submenu
    await menubar.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('[data-rig-nav-menu-content]').exists()).toBe(true)
  })

  it('closes submenu with Escape on menubar', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    expect(wrapper.find('[data-rig-nav-menu-content]').exists()).toBe(true)
    const menubar = wrapper.find('[role="menubar"]')
    await menubar.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[data-rig-nav-menu-content]').exists()).toBe(false)
  })

  it('selects non-parent item with Enter on menubar', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const menubar = wrapper.find('[role="menubar"]')
    // Navigate to About (index 2)
    await menubar.trigger('keydown', { key: 'ArrowLeft' })
    await menubar.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]).toEqual([items[2]])
  })

  it('toggles parent item with Space on menubar', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const menubar = wrapper.find('[role="menubar"]')
    // Navigate to Products (index 1)
    await menubar.trigger('keydown', { key: 'ArrowRight' })
    await menubar.trigger('keydown', { key: ' ' })
    expect(wrapper.find('[data-rig-nav-menu-content]').exists()).toBe(true)
  })

  it('navigates submenu with ArrowDown', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    const submenu = wrapper.find('[data-rig-nav-menu-content]')
    await submenu.trigger('keydown', { key: 'ArrowDown' })
    const childItems = submenu.findAll('[role="menuitem"]')
    expect(childItems[1].attributes('data-active')).toBeDefined()
  })

  it('wraps submenu navigation with ArrowUp', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    const submenu = wrapper.find('[data-rig-nav-menu-content]')
    await submenu.trigger('keydown', { key: 'ArrowUp' })
    const childItems = submenu.findAll('[role="menuitem"]')
    expect(childItems[1].attributes('data-active')).toBeDefined()
  })

  it('closes submenu with Escape from submenu', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    const submenu = wrapper.find('[data-rig-nav-menu-content]')
    await submenu.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[data-rig-nav-menu-content]').exists()).toBe(false)
  })

  it('selects child with Enter from submenu', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    const submenu = wrapper.find('[data-rig-nav-menu-content]')
    await submenu.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]).toEqual([
      { id: 'widget', label: 'Widget', href: '/widget' },
    ])
  })

  it('sets data-state open on active menu item', async () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const trigger = wrapper.find('[data-rig-nav-menu-trigger]')
    await trigger.trigger('click')
    const menuItem = wrapper.findAll('[data-rig-nav-menu-item]')[1]
    expect(menuItem.attributes('data-state')).toBe('open')
  })

  it('sets data-state closed on inactive menu items', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const menuItems = wrapper.findAll('[data-rig-nav-menu-item]')
    expect(menuItems[0].attributes('data-state')).toBe('closed')
  })
})
