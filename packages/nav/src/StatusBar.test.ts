import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBar from './StatusBar.vue'
import type { StatusBarItem } from '@core/types'

describe('StatusBar', () => {
  it('renders with data-rig-status-bar and contentinfo role', () => {
    const wrapper = mount(StatusBar)
    expect(wrapper.attributes('data-rig-status-bar')).toBe('')
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

  it('moves focus on ArrowRight between status bar item buttons', async () => {
    const clickItems: StatusBarItem[] = [
      { id: 'a', content: 'A', priority: 1, align: 'left', command: () => {} },
      { id: 'b', content: 'B', priority: 2, align: 'left', command: () => {} },
    ]
    const wrapper = mount(StatusBar, { props: { items: clickItems }, attachTo: document.body })
    const buttons = wrapper.findAll('button')
    ;(buttons[0]!.element as HTMLElement).focus()
    await buttons[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons[1]!.element)
    wrapper.unmount()
  })

  it('can focus the status bar container', () => {
    const wrapper = mount(StatusBar, { attachTo: document.body })
    const statusBar = wrapper.find('[data-rig-status-bar]')
    ;(statusBar.element as HTMLElement).focus()
    expect(document.activeElement).toBe(statusBar.element)
    wrapper.unmount()
  })

  it('emits item-click when a clickable item is clicked', async () => {
    const clickItems: StatusBarItem[] = [
      { id: 'a', content: 'A', priority: 1, align: 'left', command: () => {} },
    ]
    const wrapper = mount(StatusBar, { props: { items: clickItems } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('item-click')?.[0]?.[0]).toMatchObject({ id: 'a', content: 'A' })
  })

  it('renders new items when items prop changes', async () => {
    const wrapper = mount(StatusBar, { props: { items: [] } })
    expect(wrapper.findAll('[data-rig-status-bar-item]')).toHaveLength(0)
    await wrapper.setProps({
      items: [{ id: 'x', content: 'X', priority: 1, align: 'left' }],
    })
    expect(wrapper.findAll('[data-rig-status-bar-item]')).toHaveLength(1)
    expect(wrapper.find('[data-rig-status-bar-item]').text()).toBe('X')
  })

  it('moves focus on ArrowLeft between status bar item buttons', async () => {
    const clickItems: StatusBarItem[] = [
      { id: 'a', content: 'A', priority: 1, align: 'left', command: () => {} },
      { id: 'b', content: 'B', priority: 2, align: 'left', command: () => {} },
    ]
    const wrapper = mount(StatusBar, { props: { items: clickItems }, attachTo: document.body })
    const buttons = wrapper.findAll('button')
    ;(buttons[1]!.element as HTMLElement).focus()
    await buttons[1]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(buttons[0]!.element)
    wrapper.unmount()
  })
})
