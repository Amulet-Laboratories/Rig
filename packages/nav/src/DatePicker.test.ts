import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePicker from './DatePicker.vue'

describe('DatePicker', () => {
  it('renders with data-rig-date-picker', () => {
    const wrapper = mount(DatePicker)
    expect(wrapper.attributes('data-rig-date-picker')).toBe('')
  })

  it('shows placeholder when no value', () => {
    const wrapper = mount(DatePicker)
    expect(wrapper.find('[data-rig-date-picker-placeholder]').text()).toBe('Select date')
  })

  it('shows value when provided', () => {
    const wrapper = mount(DatePicker, { props: { modelValue: '2025-01-15' } })
    expect(wrapper.find('[data-rig-date-picker-value]').text()).toBe('2025-01-15')
  })

  it('opens popover on trigger click', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    expect(wrapper.find('[data-rig-date-picker-popover]').exists()).toBe(true)
  })

  it('closes on escape', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    expect(wrapper.find('[data-rig-date-picker-popover]').exists()).toBe(true)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[data-rig-date-picker-popover]').exists()).toBe(false)
  })

  it('has trigger with aria-expanded', async () => {
    const wrapper = mount(DatePicker)
    const trigger = wrapper.find('[data-rig-date-picker-trigger]')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
  })

  it('can focus the trigger button', () => {
    const wrapper = mount(DatePicker, { attachTo: document.body })
    const trigger = wrapper.find('[data-rig-date-picker-trigger]')
    ;(trigger.element as HTMLElement).focus()
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('emits update:modelValue when a day is selected', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    const enabledDays = wrapper
      .findAll('[data-rig-date-picker-day]')
      .filter((d) => !d.attributes('disabled'))
    await enabledDays[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(typeof wrapper.emitted('update:modelValue')![0]![0]).toBe('string')
  })

  it('displays custom placeholder when placeholder prop changes', async () => {
    const wrapper = mount(DatePicker, { props: { placeholder: 'Pick a date' } })
    expect(wrapper.find('[data-rig-date-picker-placeholder]').text()).toBe('Pick a date')
    await wrapper.setProps({ placeholder: 'Choose date' })
    expect(wrapper.find('[data-rig-date-picker-placeholder]').text()).toBe('Choose date')
  })

  it('has popover with dialog role', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    const popover = wrapper.find('[data-rig-date-picker-popover]')
    expect(popover.attributes('role')).toBe('dialog')
    expect(popover.attributes('aria-label')).toBe('Date picker')
  })

  it('renders grid with grid role', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    const grid = wrapper.find('[data-rig-date-picker-grid]')
    expect(grid.attributes('role')).toBe('grid')
  })

  it('navigates to next month', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    const monthText = wrapper.find('[data-rig-date-picker-month]').text()
    const navButtons = wrapper.findAll('[data-rig-date-picker-nav]')
    await navButtons[1]!.trigger('click')
    expect(wrapper.find('[data-rig-date-picker-month]').text()).not.toBe(monthText)
  })

  it('navigates to previous month', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    const monthText = wrapper.find('[data-rig-date-picker-month]').text()
    const navButtons = wrapper.findAll('[data-rig-date-picker-nav]')
    await navButtons[0]!.trigger('click')
    expect(wrapper.find('[data-rig-date-picker-month]').text()).not.toBe(monthText)
  })

  it('renders weekday headers', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    expect(wrapper.findAll('[data-rig-date-picker-weekday]').length).toBeGreaterThan(0)
  })

  it('marks selected date with data-selected', async () => {
    const wrapper = mount(DatePicker, { props: { modelValue: '2025-01-15' } })
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    const selected = wrapper
      .findAll('[data-rig-date-picker-day]')
      .filter((d) => d.attributes('data-selected') !== undefined)
    expect(selected.length).toBeGreaterThan(0)
  })

  it('sets data-state to open/closed', async () => {
    const wrapper = mount(DatePicker)
    expect(wrapper.find('[data-rig-date-picker]').attributes('data-state')).toBe('closed')
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    expect(wrapper.find('[data-rig-date-picker]').attributes('data-state')).toBe('open')
  })

  it('disables dates in disabledDates array', async () => {
    const wrapper = mount(DatePicker, {
      props: { modelValue: '2025-01-15', disabledDates: ['2025-01-10'] },
    })
    await wrapper.find('[data-rig-date-picker-trigger]').trigger('click')
    const disabled = wrapper
      .findAll('[data-rig-date-picker-day]')
      .filter((d) => d.attributes('data-disabled') !== undefined)
    expect(disabled.length).toBeGreaterThan(0)
  })
})
