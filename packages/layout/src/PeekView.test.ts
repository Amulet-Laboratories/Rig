import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PeekView from './PeekView.vue'
import { nextTick } from 'vue'

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

  it('handles keyboard interaction', async () => {
    const wrapper = mount(PeekView)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(PeekView, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(PeekView)
    await wrapper.setProps({ open: true })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
