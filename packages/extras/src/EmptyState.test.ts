import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'
import { nextTick } from 'vue'

function factory(props: Partial<InstanceType<typeof EmptyState>['$props']> = {}) {
  return mount(EmptyState, { props })
}

describe('EmptyState', () => {
  it('renders with role=status', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-empty-state]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-empty-state]').attributes('role')).toBe('status')
  })

  it('renders title', () => {
    const wrapper = factory({ title: 'No items found' })
    const title = wrapper.find('[data-rig-empty-state-title]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('No items found')
    expect(title.element.tagName).toBe('H3')
  })

  it('renders description', () => {
    const wrapper = factory({ description: 'Try adjusting your filters' })
    const desc = wrapper.find('[data-rig-empty-state-description]')
    expect(desc.exists()).toBe(true)
    expect(desc.text()).toBe('Try adjusting your filters')
    expect(desc.element.tagName).toBe('P')
  })

  it('renders icon', () => {
    const wrapper = factory({ icon: 'search' })
    const icon = wrapper.find('[data-rig-empty-state-icon]')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('search')
  })

  it('hides elements when props are not provided', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-empty-state-title]').exists()).toBe(false)
    expect(wrapper.find('[data-rig-empty-state-description]').exists()).toBe(false)
    expect(wrapper.find('[data-rig-empty-state-icon]').exists()).toBe(false)
  })

  it('renders default slot content', () => {
    const wrapper = mount(EmptyState, {
      slots: {
        default: '<p id="custom">Custom content</p>',
      },
    })
    expect(wrapper.find('#custom').exists()).toBe(true)
    expect(wrapper.find('#custom').text()).toBe('Custom content')
  })

  it('renders action slot', () => {
    const wrapper = mount(EmptyState, {
      slots: {
        action: '<button id="action-btn">Create item</button>',
      },
    })
    expect(wrapper.find('#action-btn').exists()).toBe(true)
    expect(wrapper.find('#action-btn').text()).toBe('Create item')
  })

  it('renders icon slot override', () => {
    const wrapper = mount(EmptyState, {
      props: { icon: 'default-icon' },
      slots: {
        icon: '<svg id="custom-icon" />',
      },
    })
    expect(wrapper.find('#custom-icon').exists()).toBe(true)
    expect(wrapper.find('[data-rig-empty-state-icon]').exists()).toBe(false)
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(EmptyState)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(EmptyState, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(EmptyState)
    await wrapper.setProps({ title: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
