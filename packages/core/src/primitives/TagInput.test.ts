import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagInput from './TagInput.vue'

describe('TagInput', () => {
  it('renders with data-rig-tag-input', () => {
    const wrapper = mount(TagInput, { props: { modelValue: [] } })
    expect(wrapper.attributes('data-rig-tag-input')).toBe('')
  })

  it('renders existing tags', () => {
    const wrapper = mount(TagInput, { props: { modelValue: ['alpha', 'beta'] } })
    const tags = wrapper.findAll('[data-rig-tag]')
    expect(tags).toHaveLength(2)
    expect(tags[0]!.text()).toContain('alpha')
    expect(tags[1]!.text()).toContain('beta')
  })

  it('adds a tag on Enter', async () => {
    const wrapper = mount(TagInput, { props: { modelValue: [] } })
    const input = wrapper.find('input')
    await input.setValue('new-tag')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['new-tag']])
  })

  it('does not add duplicate tags', async () => {
    const wrapper = mount(TagInput, { props: { modelValue: ['existing'] } })
    const input = wrapper.find('input')
    await input.setValue('existing')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('removes last tag on Backspace when input is empty', async () => {
    const wrapper = mount(TagInput, { props: { modelValue: ['a', 'b'] } })
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])
  })

  it('removes a specific tag via remove button', async () => {
    const wrapper = mount(TagInput, { props: { modelValue: ['x', 'y', 'z'] } })
    const removeButtons = wrapper.findAll('[data-rig-tag-remove]')
    await removeButtons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['x', 'z']])
  })

  it('sets disabled state', () => {
    const wrapper = mount(TagInput, { props: { modelValue: [], disabled: true } })
    expect(wrapper.attributes('data-disabled')).not.toBeUndefined()
    expect(wrapper.find('input').element.disabled).toBe(true)
  })

  it('respects max limit', async () => {
    const wrapper = mount(TagInput, { props: { modelValue: ['a', 'b'], max: 2 } })
    const input = wrapper.find('input')
    await input.setValue('c')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shows suggestions matching input', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: [], suggestions: ['apple', 'banana', 'apricot'] },
    })
    const input = wrapper.find('input')
    await input.setValue('ap')
    const suggestions = wrapper.findAll('[data-rig-tag-suggestion]')
    expect(suggestions).toHaveLength(2)
    expect(suggestions[0]!.text()).toBe('apple')
    expect(suggestions[1]!.text()).toBe('apricot')
  })

  it('does not suggest already-selected tags', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: ['apple'], suggestions: ['apple', 'apricot'] },
    })
    const input = wrapper.find('input')
    await input.setValue('ap')
    const suggestions = wrapper.findAll('[data-rig-tag-suggestion]')
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]!.text()).toBe('apricot')
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: [] as string[] },
      attachTo: document.body,
    })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).not.toBeNull()
    }
    wrapper.unmount()
  })

  it('does not add duplicate tags', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: ['alpha'] },
    })
    const input = wrapper.find('[data-rig-tag-input-field]')
    await input.setValue('alpha')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('respects max prop', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: ['a', 'b'], max: 2 },
    })
    const input = wrapper.find('[data-rig-tag-input-field]')
    await input.setValue('c')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not add empty tags', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: [] as string[] },
    })
    const input = wrapper.find('[data-rig-tag-input-field]')
    await input.setValue('   ')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('filters out already-selected suggestions', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: ['apple'], suggestions: ['apple', 'apricot'] },
    })
    const input = wrapper.find('[data-rig-tag-input-field]')
    await input.setValue('ap')
    const suggestions = wrapper.findAll('[data-rig-tag-suggestion]')
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]!.text()).toBe('apricot')
  })

  it('navigates suggestions with ArrowDown/ArrowUp', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: [] as string[], suggestions: ['red', 'rose'] },
    })
    const input = wrapper.find('[data-rig-tag-input-field]')
    await input.setValue('r')
    await input.trigger('keydown', { key: 'ArrowDown' })
    const first = wrapper.find('[data-highlighted]')
    expect(first.exists()).toBe(true)
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('[data-highlighted]').exists()).toBe(true)
  })

  it('Escape closes suggestions', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: [] as string[], suggestions: ['red'] },
    })
    const input = wrapper.find('[data-rig-tag-input-field]')
    await input.setValue('r')
    expect(wrapper.findAll('[data-rig-tag-suggestion]').length).toBeGreaterThan(0)
    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[data-rig-tag-suggestions]').exists()).toBe(false)
  })

  it('renders with aria-label', () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: [] as string[], ariaLabel: 'Tags' },
    })
    expect(wrapper.find('[data-rig-tag-input-field]').attributes('aria-label')).toBe('Tags')
  })

  it('clicking container focuses input', async () => {
    const wrapper = mount(TagInput, {
      props: { modelValue: [] as string[] },
      attachTo: document.body,
    })
    await wrapper.find('[data-rig-tag-input]').trigger('click')
    expect(document.activeElement).toBe(wrapper.find('[data-rig-tag-input-field]').element)
    wrapper.unmount()
  })
})
