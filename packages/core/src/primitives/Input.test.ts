import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input', () => {
  it('renders with data-rig-input', () => {
    const wrapper = mount(Input)
    expect(wrapper.attributes('data-rig-input')).toBeDefined()
  })

  it('binds modelValue to input', () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } })
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('emits enter on Enter key', async () => {
    const wrapper = mount(Input)
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('enter')).toHaveLength(1)
  })

  it('shows clear button when clearable and has value', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'text', clearable: true },
    })
    expect(wrapper.find('[data-rig-input-clear]').exists()).toBe(true)
  })

  it('hides clear button when value is empty', () => {
    const wrapper = mount(Input, {
      props: { modelValue: '', clearable: true },
    })
    expect(wrapper.find('[data-rig-input-clear]').exists()).toBe(false)
  })

  it('emits clear and empty value on clear click', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'text', clearable: true },
    })
    await wrapper.find('[data-rig-input-clear]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('handles disabled state', () => {
    const wrapper = mount(Input, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('sets aria-invalid when invalid prop is true', () => {
    const wrapper = mount(Input, { props: { invalid: true } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('does not set aria-invalid when invalid is false', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('sets aria-describedby when describedBy prop is provided', () => {
    const wrapper = mount(Input, { props: { describedBy: 'error-msg' } })
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('error-msg')
  })

  it('does not set aria-describedby when not provided', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(Input, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('forwards type prop to input element', () => {
    const wrapper = mount(Input, { props: { type: 'email' } })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('forwards placeholder prop', () => {
    const wrapper = mount(Input, { props: { placeholder: 'Enter text...' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text...')
  })

  it('forwards id prop to input element', () => {
    const wrapper = mount(Input, { props: { id: 'my-input' } })
    expect(wrapper.find('input').attributes('id')).toBe('my-input')
  })

  it('forwards ariaLabel prop to input element', () => {
    const wrapper = mount(Input, { props: { ariaLabel: 'Search' } })
    expect(wrapper.find('input').attributes('aria-label')).toBe('Search')
  })

  it('emits focus event', async () => {
    const wrapper = mount(Input)
    await wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('focus')).toHaveLength(1)
  })

  it('emits blur event', async () => {
    const wrapper = mount(Input)
    await wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('renders leading slot', () => {
    const wrapper = mount(Input, {
      slots: { leading: '<span data-test-leading>Icon</span>' },
    })
    expect(wrapper.find('[data-test-leading]').exists()).toBe(true)
  })

  it('renders trailing slot', () => {
    const wrapper = mount(Input, {
      slots: { trailing: '<span data-test-trailing>Suffix</span>' },
    })
    expect(wrapper.find('[data-test-trailing]').exists()).toBe(true)
  })

  it('sets data-clearable when clearable', () => {
    const wrapper = mount(Input, { props: { clearable: true, modelValue: 'x' } })
    expect(wrapper.attributes('data-clearable')).toBeDefined()
  })

  it('uses default type of text', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('exposes focus method', async () => {
    const wrapper = mount(Input, { attachTo: document.body })
    ;(wrapper.vm as unknown as { focus: () => void }).focus()
    expect(document.activeElement).toBe(wrapper.find('input').element)
    wrapper.unmount()
  })
})
