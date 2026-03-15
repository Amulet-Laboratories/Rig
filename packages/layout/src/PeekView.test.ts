import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PeekView from './PeekView.vue'

describe('PeekView', () => {
  it('renders with data-rig-peek-view', () => {
    const wrapper = mount(PeekView)
    expect(wrapper.attributes('data-rig-peek-view')).toBeDefined()
  })

  it('has data-state="closed" when not open', () => {
    const wrapper = mount(PeekView, { props: { open: false } })
    expect(wrapper.attributes('data-state')).toBe('closed')
  })

  it('has data-state="open" when open', () => {
    const wrapper = mount(PeekView, { props: { open: true } })
    expect(wrapper.attributes('data-state')).toBe('open')
  })

  it('is hidden via v-show when closed', () => {
    const wrapper = mount(PeekView, { props: { open: false } })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('is visible when open', () => {
    const wrapper = mount(PeekView, { props: { open: true } })
    expect(wrapper.isVisible()).toBe(true)
  })

  it('shows title when provided', () => {
    const wrapper = mount(PeekView, { props: { open: true, title: 'References' } })
    expect(wrapper.find('[data-rig-peek-view-title]').text()).toBe('References')
  })

  it('has a close button', () => {
    const wrapper = mount(PeekView, { props: { open: true } })
    expect(wrapper.find('[data-rig-peek-view-close]').exists()).toBe(true)
  })

  it('emits update:open false on close button click', async () => {
    const wrapper = mount(PeekView, { props: { open: true } })
    await wrapper.find('[data-rig-peek-view-close]').trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('renders header slot', () => {
    const wrapper = mount(PeekView, {
      props: { open: true },
      slots: { header: '<span data-test-header>My Header</span>' },
    })
    expect(wrapper.find('[data-test-header]').exists()).toBe(true)
  })

  it('renders default slot content', () => {
    const wrapper = mount(PeekView, {
      props: { open: true },
      slots: { default: '<code data-test-content>ref count: 5</code>' },
    })
    expect(wrapper.find('[data-test-content]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-peek-view-content]').exists()).toBe(true)
  })

  it('does not emit on non-Escape keys', async () => {
    const wrapper = mount(PeekView, { props: { open: true } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('close button can receive focus', () => {
    const wrapper = mount(PeekView, { props: { open: true }, attachTo: document.body })
    const closeBtn = wrapper.find('[data-rig-peek-view-close]')
    ;(closeBtn.element as HTMLElement).focus()
    expect(document.activeElement).toBe(closeBtn.element)
    wrapper.unmount()
  })

  it('updates data-state and aria-label when props change', async () => {
    const wrapper = mount(PeekView, { props: { open: false } })
    expect(wrapper.attributes('data-state')).toBe('closed')
    await wrapper.setProps({ open: true, title: 'References' })
    expect(wrapper.attributes('data-state')).toBe('open')
    expect(wrapper.attributes('aria-label')).toBe('References')
  })
})
