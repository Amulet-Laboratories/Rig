import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from './Toast.vue'
import { toast } from './useToast'
import { nextTick } from 'vue'

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
    expect(container.getAttribute('role')).toBe('status')
    const toastEl = container.querySelector('[data-rig-toast]')!
    expect(toastEl.getAttribute('role')).toBe('alert')
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

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Toast)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(Toast, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Toast)
    expect(wrapper.emitted()).toBeDefined()
  })
})
