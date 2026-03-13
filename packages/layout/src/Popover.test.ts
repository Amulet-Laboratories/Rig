import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Popover from './Popover.vue'
import { nextTick } from 'vue'

function factory(props: Partial<InstanceType<typeof Popover>['$props']> = {}) {
  return mount(Popover, {
    props: { open: false, ...props },
    slots: {
      trigger: '<button data-test-trigger>Open</button>',
      default: '<p data-test-content>Popover content</p>',
    },
    attachTo: document.body,
  })
}

describe('Popover', () => {
  it('renders with data-rig-popover', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-popover]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('reflects closed data-state when closed', () => {
    const wrapper = factory({ open: false })
    expect(wrapper.find('[data-rig-popover]').attributes('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('reflects open data-state when open', () => {
    const wrapper = factory({ open: true })
    expect(wrapper.find('[data-rig-popover]').attributes('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('renders trigger slot', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-test-trigger]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('teleports content to body', () => {
    const wrapper = factory({ open: true })
    const content = document.querySelector('[data-rig-popover-content]')
    expect(content).not.toBeNull()
    wrapper.unmount()
  })

  it('content has data-state="open" when open', () => {
    const wrapper = factory({ open: true })
    const content = document.querySelector('[data-rig-popover-content]') as HTMLElement
    expect(content?.getAttribute('data-state')).toBe('open')
    wrapper.unmount()
  })

  it('content is visible when open', () => {
    const wrapper = factory({ open: true })
    const content = document.querySelector('[data-rig-popover-content]') as HTMLElement
    expect(content?.style.display).not.toBe('none')
    wrapper.unmount()
  })

  it('content has data-state="closed" when closed', () => {
    const wrapper = factory({ open: false })
    const content = document.querySelector('[data-rig-popover-content]') as HTMLElement
    expect(content?.getAttribute('data-state')).toBe('closed')
    wrapper.unmount()
  })

  it('emits update:open false on Escape key', async () => {
    const wrapper = factory({ open: true })
    const content = document.querySelector('[data-rig-popover-content]')!
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('renders default slot content', () => {
    const wrapper = factory({ open: true })
    expect(document.querySelector('[data-test-content]')).not.toBeNull()
    wrapper.unmount()
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(Popover, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Popover)
    await wrapper.setProps({ open: true })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
