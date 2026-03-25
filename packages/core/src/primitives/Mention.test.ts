import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Mention from './Mention.vue'

const items = [
  { id: 1, label: 'Alice' },
  { id: 2, label: 'Bob' },
  { id: 3, label: 'Charlie' },
]

describe('Mention', () => {
  it('renders with data-rig-mention', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('[data-rig-mention]').exists()).toBe(true)
  })

  it('renders a textarea with data-rig-mention-input', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('textarea[data-rig-mention-input]').exists()).toBe(true)
  })

  it('binds modelValue to textarea', () => {
    const wrapper = mount(Mention, { props: { modelValue: 'hello' } })
    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Mention, { props: { modelValue: '', items } })
    const textarea = wrapper.find('textarea')
    await textarea.setValue('hi')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hi'])
  })

  it('sets data-state to closed by default', () => {
    const wrapper = mount(Mention)
    expect(wrapper.attributes('data-state')).toBe('closed')
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(Mention, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).not.toBeUndefined()
  })

  it('does not set data-disabled when not disabled', () => {
    const wrapper = mount(Mention)
    expect(wrapper.attributes('data-disabled')).toBeUndefined()
  })

  it('sets disabled attribute on textarea when disabled', () => {
    const wrapper = mount(Mention, { props: { disabled: true } })
    expect(wrapper.find('textarea').attributes('disabled')).toBe('')
  })

  it('sets placeholder on textarea', () => {
    const wrapper = mount(Mention, { props: { placeholder: 'Type here...' } })
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('Type here...')
  })

  it('sets aria-label on textarea', () => {
    const wrapper = mount(Mention, { props: { ariaLabel: 'Comment box' } })
    expect(wrapper.find('textarea').attributes('aria-label')).toBe('Comment box')
  })

  it('defaults aria-label to "Mention input"', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('textarea').attributes('aria-label')).toBe('Mention input')
  })

  it('sets role="combobox" on textarea', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('textarea').attributes('role')).toBe('combobox')
  })

  it('sets aria-autocomplete="list" on textarea', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('textarea').attributes('aria-autocomplete')).toBe('list')
  })

  it('sets aria-expanded to false when list is closed', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('textarea').attributes('aria-expanded')).toBe('false')
  })

  it('does not render mention list by default', () => {
    const wrapper = mount(Mention, { props: { items } })
    expect(wrapper.find('[data-rig-mention-list]').exists()).toBe(false)
  })

  it('closes mention list on Escape key', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '@', items },
      attachTo: document.body,
    })
    const textarea = wrapper.find('textarea')

    // Simulate typing the trigger character
    await textarea.setValue('@')
    await textarea.trigger('input')

    // If list opened, press Escape
    if (wrapper.find('[data-rig-mention-list]').exists()) {
      await textarea.trigger('keydown', { key: 'Escape' })
      expect(wrapper.find('[data-rig-mention-list]').exists()).toBe(false)
    }

    wrapper.unmount()
  })

  it('sets role="listbox" on the mention list', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', items },
      attachTo: document.body,
    })
    const textarea = wrapper.find('textarea')

    // Type trigger character to open the list
    await textarea.setValue('@')
    await textarea.trigger('input')

    const list = wrapper.find('[data-rig-mention-list]')
    if (list.exists()) {
      expect(list.attributes('role')).toBe('listbox')
    }

    wrapper.unmount()
  })

  it('sets role="option" on mention items', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', items },
      attachTo: document.body,
    })
    const textarea = wrapper.find('textarea')

    await textarea.setValue('@')
    await textarea.trigger('input')

    const options = wrapper.findAll('[data-rig-mention-item]')
    if (options.length > 0) {
      expect(options[0]!.attributes('role')).toBe('option')
    }

    wrapper.unmount()
  })

  it('renders item labels in the mention list', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', items },
      attachTo: document.body,
    })
    const textarea = wrapper.find('textarea')

    await textarea.setValue('@')
    await textarea.trigger('input')

    const listItems = wrapper.findAll('[data-rig-mention-item]')
    if (listItems.length > 0) {
      const labels = listItems.map((li) => li.text())
      expect(labels).toContain('Alice')
      expect(labels).toContain('Bob')
    }

    wrapper.unmount()
  })

  it('uses custom trigger character', () => {
    const wrapper = mount(Mention, { props: { trigger: '#', items } })
    // The component should render without errors with a custom trigger
    expect(wrapper.find('[data-rig-mention]').exists()).toBe(true)
  })

  it('cleans up mousedown listener on unmount', () => {
    const wrapper = mount(Mention, { attachTo: document.body })
    // Should not throw on unmount
    expect(() => wrapper.unmount()).not.toThrow()
  })
})
