import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionBar from './ActionBar.vue'
import type { Action } from '@core/types'

const actions: Action[] = [
  { id: 'save', label: 'Save' },
  { id: 'undo', label: 'Undo' },
  { id: 'redo', label: 'Redo' },
  { id: 'format', label: 'Format' },
  { id: 'run', label: 'Run', disabled: true },
]

function factory(props: Partial<InstanceType<typeof ActionBar>['$props']> = {}) {
  return mount(ActionBar, {
    props: {
      actions,
      ...props,
    },
  })
}

describe('ActionBar', () => {
  it('renders a toolbar', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-action-bar]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-action-bar]').attributes('role')).toBe('toolbar')
  })

  it('renders all actions when no maxVisible', () => {
    const wrapper = factory()
    const items = wrapper.findAll('[data-rig-action-bar-item]')
    expect(items.length).toBe(5)
    expect(wrapper.find('[data-rig-action-bar-overflow]').exists()).toBe(false)
  })

  it('splits actions with maxVisible', () => {
    const wrapper = factory({ maxVisible: 2 })
    const visible = wrapper.findAll('[data-rig-action-bar-item]')
    expect(visible.length).toBe(2)
    expect(visible[0]!.text()).toBe('Save')
    expect(visible[1]!.text()).toBe('Undo')
    expect(wrapper.find('[data-rig-action-bar-overflow]').exists()).toBe(true)
  })

  it('overflow button has aria-haspopup', () => {
    const wrapper = factory({ maxVisible: 2 })
    const overflow = wrapper.find('[data-rig-action-bar-overflow]')
    expect(overflow.attributes('aria-haspopup')).toBe('true')
    expect(overflow.attributes('aria-label')).toBe('More actions')
  })

  it('emits select on action click', async () => {
    const wrapper = factory()
    const items = wrapper.findAll('[data-rig-action-bar-item]')
    await items[0]!.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([actions[0]])
  })

  it('marks disabled actions', () => {
    const wrapper = factory()
    const items = wrapper.findAll('[data-rig-action-bar-item]')
    expect(items[4]!.attributes('disabled')).toBeDefined()
    expect(items[4]!.attributes('data-disabled')).toBe('true')
  })

  it('provides aria-label for each action', () => {
    const wrapper = factory()
    const items = wrapper.findAll('[data-rig-action-bar-item]')
    expect(items[0]!.attributes('aria-label')).toBe('Save')
  })

  it('does not show overflow when maxVisible >= actions length', () => {
    const wrapper = factory({ maxVisible: 10 })
    expect(wrapper.find('[data-rig-action-bar-overflow]').exists()).toBe(false)
    expect(wrapper.findAll('[data-rig-action-bar-item]').length).toBe(5)
  })

  it('moves focus with ArrowRight', async () => {
    const wrapper = mount(ActionBar, { props: { actions }, attachTo: document.body })
    const buttons = wrapper.findAll('[data-rig-action-bar-item]')
    ;(buttons[0]!.element as HTMLButtonElement).focus()
    await buttons[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons[1]!.element)
    wrapper.unmount()
  })

  it('action buttons are focusable', async () => {
    const wrapper = mount(ActionBar, { props: { actions }, attachTo: document.body })
    const firstButton = wrapper.find('[data-rig-action-bar-item]')
    ;(firstButton.element as HTMLButtonElement).focus()
    expect(document.activeElement).toBe(firstButton.element)
    wrapper.unmount()
  })

  it('updates visible items when maxVisible changes', async () => {
    const wrapper = mount(ActionBar, { props: { actions } })
    expect(wrapper.findAll('[data-rig-action-bar-item]').length).toBe(5)
    await wrapper.setProps({ maxVisible: 2 })
    expect(wrapper.findAll('[data-rig-action-bar-item]').length).toBe(2)
    expect(wrapper.find('[data-rig-action-bar-overflow]').exists()).toBe(true)
  })
})
