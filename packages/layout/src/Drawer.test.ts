import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Drawer from './Drawer.vue'

function cleanUpOverlays() {
  document.querySelectorAll('[data-rig-drawer-overlay]').forEach((el) => el.remove())
}

describe('Drawer', () => {
  afterEach(() => {
    cleanUpOverlays()
  })

  it('renders data-rig-drawer via teleport', () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      attachTo: document.body,
    })
    const drawer = document.querySelector('[data-rig-drawer]')
    expect(drawer).not.toBeNull()
    wrapper.unmount()
  })

  it('is hidden when closed', () => {
    const wrapper = mount(Drawer, {
      props: { open: false },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    expect(overlay?.dataset.state).toBe('closed')
    expect(overlay?.getAttribute('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('is visible when open', () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    expect(overlay?.dataset.state).toBe('open')
    expect(overlay?.getAttribute('aria-hidden')).toBeNull()
    wrapper.unmount()
  })

  it('sets inert when closed', () => {
    const wrapper = mount(Drawer, {
      props: { open: false },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    expect(overlay?.hasAttribute('inert')).toBe(true)
    wrapper.unmount()
  })

  it('removes inert when open', () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    expect(overlay?.hasAttribute('inert')).toBe(false)
    wrapper.unmount()
  })

  it('has role="dialog" and aria-modal', () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      attachTo: document.body,
    })
    const drawer = document.querySelector('[data-rig-drawer]')
    expect(drawer?.getAttribute('role')).toBe('dialog')
    expect(drawer?.getAttribute('aria-modal')).toBe('true')
    wrapper.unmount()
  })

  it('sets data-side attribute on drawer and overlay', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, side: 'left' },
      attachTo: document.body,
    })
    const drawer = document.querySelector('[data-rig-drawer]') as HTMLElement
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    expect(drawer?.dataset.side).toBe('left')
    expect(overlay?.dataset.side).toBe('left')
    wrapper.unmount()
  })

  it('defaults side to right', () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      attachTo: document.body,
    })
    const drawer = document.querySelector('[data-rig-drawer]') as HTMLElement
    expect(drawer?.dataset.side).toBe('right')
    wrapper.unmount()
  })

  it('sets aria-label', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, ariaLabel: 'Settings panel' },
      attachTo: document.body,
    })
    const drawer = document.querySelector('[data-rig-drawer]')
    expect(drawer?.getAttribute('aria-label')).toBe('Settings panel')
    wrapper.unmount()
  })

  it('sets aria-labelledby', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, ariaLabelledBy: 'heading-id' },
      attachTo: document.body,
    })
    const drawer = document.querySelector('[data-rig-drawer]')
    expect(drawer?.getAttribute('aria-labelledby')).toBe('heading-id')
    wrapper.unmount()
  })

  it('emits update:open false on Escape key', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      attachTo: document.body,
    })
    await nextTick()
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on non-persistent overlay click', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, persistent: false },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('does not emit on overlay click when persistent', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, persistent: true },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders slot content inside drawer', () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      slots: { default: '<p data-test-inner>Drawer content</p>' },
      attachTo: document.body,
    })
    const drawer = document.querySelector('[data-rig-drawer]')
    const inner = drawer?.querySelector('[data-test-inner]')
    expect(inner?.textContent).toBe('Drawer content')
    wrapper.unmount()
  })

  it('renders overlay in document body via teleport', () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-drawer-overlay]')
    expect(overlay).not.toBeNull()
    expect(overlay?.parentElement).toBe(document.body)
    wrapper.unmount()
  })

  it('updates data-state when open prop changes', async () => {
    const wrapper = mount(Drawer, {
      props: { open: false },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-drawer-overlay]') as HTMLElement
    expect(overlay?.dataset.state).toBe('closed')
    await wrapper.setProps({ open: true })
    expect(overlay?.dataset.state).toBe('open')
    wrapper.unmount()
  })
})
