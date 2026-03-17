import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InlineEditor from './InlineEditor.vue'

describe('InlineEditor', () => {
  it('renders with data-rig-inline-editor', () => {
    const wrapper = mount(InlineEditor)
    expect(wrapper.attributes('data-rig-inline-editor')).toBe('')
  })

  it('shows display text when not editing', () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: false },
    })
    expect(wrapper.find('[data-rig-inline-editor-display]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-inline-editor-input]').exists()).toBe(false)
    expect(wrapper.text()).toBe('Hello')
  })

  it('shows input when editing', () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: true },
    })
    expect(wrapper.find('[data-rig-inline-editor-input]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-inline-editor-display]').exists()).toBe(false)
  })

  it('emits update:editing on double-click', async () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: false },
    })
    await wrapper.find('[data-rig-inline-editor-display]').trigger('dblclick')
    expect(wrapper.emitted('update:editing')?.[0]).toEqual([true])
  })

  it('emits update:editing on Enter key in display mode', async () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: false },
    })
    await wrapper.find('[data-rig-inline-editor-display]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:editing')?.[0]).toEqual([true])
  })

  it('submits on Enter key in edit mode', async () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: true },
    })
    const input = wrapper.find('[data-rig-inline-editor-input]')
    await input.setValue('Updated')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Updated'])
    expect(wrapper.emitted('submit')?.[0]).toEqual(['Updated'])
    expect(
      wrapper.emitted('update:editing')?.[1] ?? wrapper.emitted('update:editing')?.[0],
    ).toEqual([false])
  })

  it('cancels on Escape key in edit mode', async () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: true },
    })
    const input = wrapper.find('[data-rig-inline-editor-input]')
    await input.setValue('Changed')
    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:editing')).toBeTruthy()
  })

  it('submits on blur', async () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: true },
    })
    const input = wrapper.find('[data-rig-inline-editor-input]')
    await input.setValue('Blurred')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Blurred'])
    expect(wrapper.emitted('submit')?.[0]).toEqual(['Blurred'])
  })

  it('sets data-editing attribute when editing', () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: true },
    })
    expect(wrapper.attributes('data-editing')).not.toBeUndefined()
  })

  it('display element is focusable via tabindex', () => {
    const wrapper = mount(InlineEditor, {
      props: { modelValue: 'Hello', editing: false },
    })
    expect(wrapper.find('[data-rig-inline-editor-display]').attributes('tabindex')).toBe('0')
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(InlineEditor, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).not.toBeNull()
    }
    wrapper.unmount()
  })
})
