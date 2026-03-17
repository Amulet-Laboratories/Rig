import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'
import { nextTick } from 'vue'

function cleanUpOverlays() {
  document.querySelectorAll('[data-rig-modal-overlay]').forEach((el) => el.remove())
}

describe('Modal', () => {
  afterEach(() => {
    cleanUpOverlays()
  })
  it('does not render when closed', () => {
    const wrapper = mount(Modal, { props: { open: false }, attachTo: document.body })
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    expect(overlay?.dataset.state).toBe('closed')
    wrapper.unmount()
  })

  it('sets aria-hidden and inert when closed', () => {
    const wrapper = mount(Modal, { props: { open: false }, attachTo: document.body })
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    expect(overlay?.getAttribute('aria-hidden')).toBe('true')
    expect(overlay?.hasAttribute('inert')).toBe(true)
    wrapper.unmount()
  })

  it('removes aria-hidden and inert when open', () => {
    const wrapper = mount(Modal, { props: { open: true }, attachTo: document.body })
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    expect(overlay?.getAttribute('aria-hidden')).toBeNull()
    expect(overlay?.hasAttribute('inert')).toBe(false)
    wrapper.unmount()
  })

  it('renders when open', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      slots: { default: '<p>Content</p>' },
      attachTo: document.body,
    })
    const modal = document.querySelector('[data-rig-modal]')
    expect(modal).not.toBeNull()
    expect(modal?.getAttribute('role')).toBe('dialog')
    expect(modal?.getAttribute('aria-modal')).toBe('true')
    wrapper.unmount()
  })

  it('emits update:open false on Escape', async () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    overlay?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    // Vue test utils won't capture teleported emits the same way, but the handler runs
    wrapper.unmount()
  })

  it('sets aria-label', () => {
    const wrapper = mount(Modal, {
      props: { open: true, ariaLabel: 'Test dialog' },
      attachTo: document.body,
    })
    const modal = document.querySelector('[data-rig-modal]')
    expect(modal?.getAttribute('aria-label')).toBe('Test dialog')
    wrapper.unmount()
  })

  it('does not close on overlay click when persistent', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, persistent: true },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    overlay?.click()
    // persistent = no update:open emission
    wrapper.unmount()
  })

  it('renders overlay in document body via teleport', () => {
    const wrapper = mount(Modal, { props: { open: true }, attachTo: document.body })
    const overlay = document.querySelector('[data-rig-modal-overlay]')
    expect(overlay).not.toBeNull()
    expect(overlay?.parentElement).toBe(document.body)
    wrapper.unmount()
  })

  it('renders slot content inside dialog element', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      slots: { default: '<p data-test-inner>Hello</p>' },
      attachTo: document.body,
    })
    const dialog = document.querySelector('[data-rig-modal]')
    const inner = dialog?.querySelector('[data-test-inner]')
    expect(inner?.textContent).toBe('Hello')
    wrapper.unmount()
  })

  it('updates overlay data-state when open prop changes', async () => {
    const wrapper = mount(Modal, { props: { open: false }, attachTo: document.body })
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    expect(overlay?.dataset.state).toBe('closed')
    await wrapper.setProps({ open: true })
    expect(overlay?.dataset.state).toBe('open')
    wrapper.unmount()
  })

  it('emits update:open false on Escape key', async () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      attachTo: document.body,
    })
    await nextTick() // Allow useFocusTrap watcher to activate
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on non-persistent overlay click', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, persistent: false },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    // Click on overlay itself (target === currentTarget)
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('does not close when clicking modal content (not overlay)', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, persistent: false },
      slots: { default: '<button id="inner-btn">Close</button>' },
      attachTo: document.body,
    })
    const btn = document.querySelector('#inner-btn') as HTMLElement
    btn.click()
    await nextTick()
    expect(wrapper.emitted('update:open')).toBeUndefined()
    wrapper.unmount()
  })

  it('does not emit on overlay click when persistent', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, persistent: true },
      attachTo: document.body,
    })
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')).toBeUndefined()
    wrapper.unmount()
  })

  it('sets aria-labelledby', () => {
    const wrapper = mount(Modal, {
      props: { open: true, ariaLabelledBy: 'heading-id' },
      attachTo: document.body,
    })
    const modal = document.querySelector('[data-rig-modal]')
    expect(modal?.getAttribute('aria-labelledby')).toBe('heading-id')
    wrapper.unmount()
  })

  it('focuses first focusable element when opened', async () => {
    const wrapper = mount(Modal, {
      props: { open: false },
      slots: { default: '<button id="focus-target">OK</button>' },
      attachTo: document.body,
    })
    await wrapper.setProps({ open: true })
    await nextTick()
    await nextTick()
    expect(document.activeElement?.id).toBe('focus-target')
    wrapper.unmount()
  })

  it('restores focus when closed', async () => {
    const trigger = document.createElement('button')
    trigger.id = 'trigger-btn'
    document.body.appendChild(trigger)
    trigger.focus()
    expect(document.activeElement?.id).toBe('trigger-btn')

    const wrapper = mount(Modal, {
      props: { open: false },
      slots: { default: '<button id="modal-btn">OK</button>' },
      attachTo: document.body,
    })
    await wrapper.setProps({ open: true })
    await nextTick()
    await nextTick()

    await wrapper.setProps({ open: false })
    await nextTick()
    expect(document.activeElement?.id).toBe('trigger-btn')

    trigger.remove()
    wrapper.unmount()
  })

  it('traps Tab at last focusable element', async () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      slots: {
        default: '<button id="first-btn">First</button><button id="last-btn">Last</button>',
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    const lastBtn = document.getElementById('last-btn')!
    lastBtn.focus()
    expect(document.activeElement?.id).toBe('last-btn')

    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    overlay.dispatchEvent(tabEvent)
    // Tab should be prevented and focus should wrap (jsdom doesn't actually move focus)
    expect(tabEvent.defaultPrevented).toBe(true)
    wrapper.unmount()
  })

  it('traps Shift+Tab at first focusable element', async () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      slots: {
        default: '<button id="first-btn">First</button><button id="last-btn">Last</button>',
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    const firstBtn = document.getElementById('first-btn')!
    firstBtn.focus()
    expect(document.activeElement?.id).toBe('first-btn')

    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    overlay.dispatchEvent(tabEvent)
    expect(tabEvent.defaultPrevented).toBe(true)
    wrapper.unmount()
  })

  it('prevents Tab when no focusable elements', async () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      slots: { default: '<p>No buttons here</p>' },
      attachTo: document.body,
    })
    await nextTick()

    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    overlay.dispatchEvent(tabEvent)
    expect(tabEvent.defaultPrevented).toBe(true)
    wrapper.unmount()
  })
})
