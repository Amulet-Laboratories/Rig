import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OTPInput from './OTPInput.vue'

describe('OTPInput', () => {
  it('renders with data-rig-otp-input', () => {
    const wrapper = mount(OTPInput)
    expect(wrapper.find('[data-rig-otp-input]').exists()).toBe(true)
  })

  it('renders correct number of cells', () => {
    const wrapper = mount(OTPInput, { props: { length: 4 } })
    expect(wrapper.findAll('[data-rig-otp-input-cell]')).toHaveLength(4)
  })

  it('defaults to 6 cells', () => {
    const wrapper = mount(OTPInput)
    expect(wrapper.findAll('[data-rig-otp-input-cell]')).toHaveLength(6)
  })

  it('has group role', () => {
    const wrapper = mount(OTPInput)
    expect(wrapper.find('[data-rig-otp-input]').attributes('role')).toBe('group')
  })

  it('sets aria-label', () => {
    const wrapper = mount(OTPInput, { props: { ariaLabel: 'OTP code' } })
    expect(wrapper.find('[data-rig-otp-input]').attributes('aria-label')).toBe('OTP code')
  })

  it('fills cells from modelValue', () => {
    const wrapper = mount(OTPInput, { props: { modelValue: '123', length: 4 } })
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    expect((cells[0].element as HTMLInputElement).value).toBe('1')
    expect((cells[1].element as HTMLInputElement).value).toBe('2')
    expect((cells[2].element as HTMLInputElement).value).toBe('3')
    expect((cells[3].element as HTMLInputElement).value).toBe('')
  })

  it('sets data-filled on filled cells', () => {
    const wrapper = mount(OTPInput, { props: { modelValue: '12', length: 4 } })
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    expect(cells[0].attributes('data-filled')).toBeDefined()
    expect(cells[2].attributes('data-filled')).toBeUndefined()
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(OTPInput, { props: { modelValue: '', length: 4 } })
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    Object.defineProperty(cells[0].element, 'value', { value: '5', writable: true })
    await cells[0].trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['5'])
  })

  it('emits complete when pasting full OTP', async () => {
    const wrapper = mount(OTPInput, { props: { modelValue: '', length: 4 } })
    const pasteEvent = new Event('paste') as ClipboardEvent
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: () => '1234' },
    })
    wrapper.find('[data-rig-otp-input]').element.dispatchEvent(pasteEvent)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1234'])
    expect(wrapper.emitted('complete')?.[0]).toEqual(['1234'])
  })

  it('sets disabled on cells when disabled', () => {
    const wrapper = mount(OTPInput, { props: { disabled: true } })
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    expect(cells[0].attributes('disabled')).toBeDefined()
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(OTPInput, { props: { disabled: true } })
    expect(wrapper.find('[data-rig-otp-input]').attributes('data-disabled')).toBeDefined()
  })

  it('uses password type when mask is true', () => {
    const wrapper = mount(OTPInput, { props: { mask: true } })
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    expect(cells[0].attributes('type')).toBe('password')
  })

  it('uses text type by default', () => {
    const wrapper = mount(OTPInput)
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    expect(cells[0].attributes('type')).toBe('text')
  })

  it('clears cell on Backspace', async () => {
    const wrapper = mount(OTPInput, { props: { modelValue: '12', length: 4 } })
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    await cells[1].trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
  })

  it('clears cell on Delete', async () => {
    const wrapper = mount(OTPInput, { props: { modelValue: '12', length: 4 } })
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    await cells[0].trigger('keydown', { key: 'Delete' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2'])
  })

  it('sets aria-label on each cell', () => {
    const wrapper = mount(OTPInput, { props: { length: 4 } })
    const cells = wrapper.findAll('[data-rig-otp-input-cell]')
    expect(cells[0].attributes('aria-label')).toBe('Digit 1 of 4')
    expect(cells[3].attributes('aria-label')).toBe('Digit 4 of 4')
  })

  it('handles paste event', async () => {
    const wrapper = mount(OTPInput, { props: { modelValue: '', length: 4 } })
    const pasteEvent = new Event('paste') as ClipboardEvent
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: () => '1234' },
    })
    wrapper.find('[data-rig-otp-input]').element.dispatchEvent(pasteEvent)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1234'])
  })
})
