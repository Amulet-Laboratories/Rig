import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea from './Textarea.vue'

describe('Textarea', () => {
  it('renders with data-rig-textarea', () => {
    const wrapper = mount(Textarea)
    expect(wrapper.attributes('data-rig-textarea')).toBeDefined()
  })

  it('binds modelValue to textarea', () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'hello' } })
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: '' } })
    await wrapper.find('textarea').setValue('new text')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new text'])
  })

  it('sets placeholder', () => {
    const wrapper = mount(Textarea, {
      props: { placeholder: 'Write here...' },
    })
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('Write here...')
  })

  it('handles disabled state', () => {
    const wrapper = mount(Textarea, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
  })

  it('sets rows attribute', () => {
    const wrapper = mount(Textarea, { props: { rows: 8 } })
    expect(wrapper.find('textarea').attributes('rows')).toBe('8')
  })

  it('sets resize style', () => {
    const wrapper = mount(Textarea, { props: { resize: 'none' } })
    expect(wrapper.find('textarea').attributes('style')).toContain('resize: none')
  })

  it('shows character count when maxlength is set', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'hi', maxlength: 100 },
    })
    const count = wrapper.find('[data-rig-textarea-count]')
    expect(count.exists()).toBe(true)
    expect(count.text()).toBe('2 / 100')
  })

  it('hides character count when maxlength is 0', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'hi', maxlength: 0 },
    })
    expect(wrapper.find('[data-rig-textarea-count]').exists()).toBe(false)
  })

  it('sets id on textarea element', () => {
    const wrapper = mount(Textarea, { props: { id: 'notes' } })
    expect(wrapper.find('textarea').attributes('id')).toBe('notes')
  })

  it('sets maxlength attribute on textarea', () => {
    const wrapper = mount(Textarea, { props: { maxlength: 200 } })
    expect(wrapper.find('textarea').attributes('maxlength')).toBe('200')
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(Textarea)
    await wrapper.find('textarea').trigger('focus')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    await wrapper.find('textarea').trigger('blur')
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })
})
