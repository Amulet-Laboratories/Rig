import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileInput from './FileInput.vue'

describe('FileInput', () => {
  it('renders with data-rig-file-input', () => {
    const wrapper = mount(FileInput)
    expect(wrapper.attributes('data-rig-file-input')).not.toBeUndefined()
  })

  it('renders placeholder text', () => {
    const wrapper = mount(FileInput)
    const placeholder = wrapper.find('[data-rig-file-input-placeholder]')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text()).toBe('Choose a file or drag and drop')
  })

  it('renders custom placeholder', () => {
    const wrapper = mount(FileInput, {
      props: { placeholder: 'Drop files here' },
    })
    expect(wrapper.find('[data-rig-file-input-placeholder]').text()).toBe('Drop files here')
  })

  it('has role="button"', () => {
    const wrapper = mount(FileInput)
    expect(wrapper.attributes('role')).toBe('button')
  })

  it('has tabindex="0"', () => {
    const wrapper = mount(FileInput)
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('contains hidden native file input', () => {
    const wrapper = mount(FileInput)
    const native = wrapper.find('[data-rig-file-input-native]')
    expect(native.exists()).toBe(true)
    expect(native.attributes('type')).toBe('file')
    expect(native.attributes('tabindex')).toBe('-1')
    expect(native.attributes('aria-hidden')).toBe('true')
  })

  it('handles disabled state', () => {
    const wrapper = mount(FileInput, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).not.toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    const native = wrapper.find('[data-rig-file-input-native]')
    expect(native.attributes('disabled')).not.toBeUndefined()
  })

  it('does not have data-disabled when enabled', () => {
    const wrapper = mount(FileInput)
    expect(wrapper.attributes('data-disabled')).toBeUndefined()
  })

  it('does not have data-dragging by default', () => {
    const wrapper = mount(FileInput)
    expect(wrapper.attributes('data-dragging')).toBeUndefined()
  })

  it('sets data-dragging on dragover', async () => {
    const wrapper = mount(FileInput)
    await wrapper.trigger('dragover')
    expect(wrapper.attributes('data-dragging')).not.toBeUndefined()
  })

  it('removes data-dragging on dragleave', async () => {
    const wrapper = mount(FileInput)
    await wrapper.trigger('dragover')
    expect(wrapper.attributes('data-dragging')).not.toBeUndefined()
    await wrapper.trigger('dragleave')
    expect(wrapper.attributes('data-dragging')).toBeUndefined()
  })

  it('sets accept attribute on native input', () => {
    const wrapper = mount(FileInput, { props: { accept: 'image/*' } })
    const native = wrapper.find('[data-rig-file-input-native]')
    expect(native.attributes('accept')).toBe('image/*')
  })

  it('sets multiple attribute on native input', () => {
    const wrapper = mount(FileInput, { props: { multiple: true } })
    const native = wrapper.find('[data-rig-file-input-native]')
    expect(native.attributes('multiple')).not.toBeUndefined()
  })

  it('does not set data-dragging on dragover when disabled', async () => {
    const wrapper = mount(FileInput, { props: { disabled: true } })
    await wrapper.trigger('dragover')
    expect(wrapper.attributes('data-dragging')).toBeUndefined()
  })
})
