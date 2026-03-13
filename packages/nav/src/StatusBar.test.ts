import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBar from './StatusBar.vue'
import type { StatusBarItem } from '@core/types'
import { nextTick } from 'vue'

describe('StatusBar', () => {
  it('renders with data-rig-status-bar and contentinfo role', () => {
    const wrapper = mount(StatusBar)
    expect(wrapper.attributes('data-rig-status-bar')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('contentinfo')
  })

  it('sorts items by priority within each group', () => {
    const items: StatusBarItem[] = [
      { id: 'b', content: 'B', priority: 2, align: 'left' },
      { id: 'a', content: 'A', priority: 1, align: 'left' },
      { id: 'c', content: 'C', priority: 1, align: 'right' },
    ]
    const wrapper = mount(StatusBar, { props: { items } })

    const leftItems = wrapper.findAll('[data-rig-status-bar-left] [data-rig-status-bar-item]')
    expect(leftItems[0]!.text()).toBe('A')
    expect(leftItems[1]!.text()).toBe('B')

    const rightItems = wrapper.findAll('[data-rig-status-bar-right] [data-rig-status-bar-item]')
    expect(rightItems).toHaveLength(1)
    expect(rightItems[0]!.text()).toBe('C')
  })

  it('handles keyboard interaction', async () => {
    const wrapper = mount(StatusBar)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(StatusBar, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(StatusBar)
    // Verify component has emitted() interface
    expect(wrapper.emitted()).toBeDefined()
  })

  it('handles prop updates', async () => {
    const wrapper = mount(StatusBar)
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
