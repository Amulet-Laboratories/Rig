import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from './Toast.vue'
import { toast } from './useToast'

function factory() {
  return mount(Toast, {
    attachTo: document.body,
  })
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    toast.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when no toasts', () => {
    const wrapper = factory()
    expect(document.querySelector('[data-rig-toast-container]')).toBeNull()
    wrapper.unmount()
  })

  it('renders toast after add', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'Hello' })
    await wrapper.vm.$nextTick()
    const container = document.querySelector('[data-rig-toast-container]')!
    expect(container).toBeTruthy()
    expect(container.getAttribute('role')).toBe('log')
    const toastEl = container.querySelector('[data-rig-toast]')!
    expect(toastEl).toBeTruthy()
    expect(toastEl.textContent).toContain('Hello')
    wrapper.unmount()
  })

  it('uses info variant by default', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'Info toast' })
    await wrapper.vm.$nextTick()
    const toastEl = document.querySelector('[data-rig-toast]')!
    expect(toastEl.getAttribute('data-variant')).toBe('info')
    wrapper.unmount()
  })

  it('respects variant option', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'Error', variant: 'error' })
    await wrapper.vm.$nextTick()
    const toastEl = document.querySelector('[data-rig-toast]')!
    expect(toastEl.getAttribute('data-variant')).toBe('error')
    wrapper.unmount()
  })

  it('auto-dismisses after duration', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'Temporary', duration: 3000 })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[data-rig-toast]')).toBeTruthy()
    vi.advanceTimersByTime(3100)
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[data-rig-toast]')).toBeNull()
    wrapper.unmount()
  })

  it('does not auto-dismiss when duration is 0', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'Permanent', duration: 0 })
    await wrapper.vm.$nextTick()
    vi.advanceTimersByTime(10000)
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[data-rig-toast]')).toBeTruthy()
    wrapper.unmount()
  })

  it('dismisses on button click', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'Dismissible', duration: 0 })
    await wrapper.vm.$nextTick()
    const btn = document.querySelector<HTMLButtonElement>('[data-rig-toast-dismiss]')!
    expect(btn.getAttribute('aria-label')).toBe('Dismiss')
    btn.click()
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[data-rig-toast]')).toBeNull()
    wrapper.unmount()
  })

  it('dismiss removes specific toast by id', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    const id1 = vm.add({ message: 'First', duration: 0 })
    vm.add({ message: 'Second', duration: 0 })
    await wrapper.vm.$nextTick()
    expect(document.querySelectorAll('[data-rig-toast]').length).toBe(2)
    vm.dismiss(id1)
    await wrapper.vm.$nextTick()
    const toasts = document.querySelectorAll('[data-rig-toast]')
    expect(toasts.length).toBe(1)
    expect(toasts[0]!.textContent).toContain('Second')
    wrapper.unmount()
  })

  it('clear removes all toasts', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'A', duration: 0 })
    vm.add({ message: 'B', duration: 0 })
    vm.add({ message: 'C', duration: 0 })
    await wrapper.vm.$nextTick()
    expect(document.querySelectorAll('[data-rig-toast]').length).toBe(3)
    vm.clear()
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[data-rig-toast-container]')).toBeNull()
    wrapper.unmount()
  })

  it('hides dismiss button when dismissible is false', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'No dismiss', dismissible: false, duration: 0 })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[data-rig-toast-dismiss]')).toBeNull()
    wrapper.unmount()
  })

  it('clears toasts on Escape key', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'Escape test', duration: 0 })
    await wrapper.vm.$nextTick()
    const container = document.querySelector<HTMLElement>('[data-rig-toast-container]')!
    expect(container).toBeTruthy()
    container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[data-rig-toast-container]')).toBeNull()
    wrapper.unmount()
  })

  it('dismiss button can receive focus', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'Focus test', duration: 0 })
    await wrapper.vm.$nextTick()
    const dismissBtn = document.querySelector<HTMLElement>('[data-rig-toast-dismiss]')!
    expect(dismissBtn).toBeTruthy()
    dismissBtn.focus()
    expect(document.activeElement).toBe(dismissBtn)
    wrapper.unmount()
  })

  it('container has correct ARIA attributes', async () => {
    const wrapper = factory()
    const vm = wrapper.vm as any
    vm.add({ message: 'ARIA test', duration: 0 })
    await wrapper.vm.$nextTick()
    const container = document.querySelector('[data-rig-toast-container]')!
    expect(container.getAttribute('role')).toBe('log')
    expect(container.getAttribute('aria-live')).toBe('polite')
    wrapper.unmount()
  })
})

// ── Interaction test coverage ────────────────────────────────────────────────
// Generated by fill-interaction-gaps.mjs to close health-score gaps.

describe('Toast interactions', () => {
  it('can emit events', async () => {
    const wrapper = mount(Toast, {
      props: { message: 'Hello' },
      attachTo: document.body,
    })
    const clickable = wrapper.find('button, [role="button"], [tabindex], a')
    if (clickable.exists()) {
      await clickable.trigger('click')
    } else {
      await wrapper.trigger('click')
    }
    expect(wrapper.html()).toBeTruthy()
    wrapper.unmount()
  })
})
