import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import View from './View.vue'

describe('View', () => {
  it('renders with data-rig-view', () => {
    const wrapper = mount(View, { props: { title: 'Explorer' } })
    expect(wrapper.attributes('data-rig-view')).toBeDefined()
  })

  it('displays title', () => {
    const wrapper = mount(View, { props: { title: 'Explorer' } })
    expect(wrapper.text()).toContain('Explorer')
  })

  it('shows content when not collapsed', () => {
    const wrapper = mount(View, {
      props: { title: 'Test', collapsed: false },
      slots: { default: '<div id="content">Hello</div>' },
    })
    expect(wrapper.find('#content').exists()).toBe(true)
  })

  it('hides content when collapsed', () => {
    const wrapper = mount(View, {
      props: { title: 'Test', collapsed: true },
      slots: { default: '<div id="content">Hello</div>' },
    })
    expect(wrapper.find('#content').exists()).toBe(false)
  })

  it('emits update:collapsed on header click', async () => {
    const wrapper = mount(View, {
      props: { title: 'Test', collapsed: false },
    })
    await wrapper.find('[data-rig-view-toggle]').trigger('click')
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
  })

  it('sets aria-expanded on header toggle', () => {
    const expanded = mount(View, { props: { title: 'Test', collapsed: false } })
    expect(expanded.find('[data-rig-view-toggle]').attributes('aria-expanded')).toBe('true')

    const collapsed = mount(View, { props: { title: 'Test', collapsed: true } })
    expect(collapsed.find('[data-rig-view-toggle]').attributes('aria-expanded')).toBe('false')
  })

  it('renders action buttons', () => {
    const wrapper = mount(View, {
      props: {
        title: 'Test',
        actions: [{ id: 'new', label: 'New File' }],
      },
    })
    expect(wrapper.find('[data-rig-view-action]').exists()).toBe(true)
  })

  it('emits action on action button click', async () => {
    const wrapper = mount(View, {
      props: {
        title: 'Test',
        actions: [{ id: 'new', label: 'New File' }],
      },
    })
    await wrapper.find('[data-rig-view-action]').trigger('click')
    expect(wrapper.emitted('action')?.[0]).toEqual(['new'])
  })

  it('toggles collapsed on Enter key on the toggle button', async () => {
    const wrapper = mount(View, { props: { title: 'Test', collapsed: false } })
    await wrapper.find('[data-rig-view-toggle]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
  })

  it('can focus the view toggle button', () => {
    const wrapper = mount(View, { props: { title: 'Test' }, attachTo: document.body })
    const toggle = wrapper.find('[data-rig-view-toggle]')
    ;(toggle.element as HTMLElement).focus()
    expect(document.activeElement).toBe(toggle.element)
    wrapper.unmount()
  })

  it('shows content when collapsed changes from true to false', async () => {
    const wrapper = mount(View, {
      props: { title: 'Test', collapsed: true },
      slots: { default: '<div id="content">Hello</div>' },
    })
    expect(wrapper.find('#content').exists()).toBe(false)
    await wrapper.setProps({ collapsed: false })
    expect(wrapper.find('#content').exists()).toBe(true)
  })
})
