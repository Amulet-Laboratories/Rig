import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DateRangePicker from './DateRangePicker.vue'

describe('DateRangePicker', () => {
  it('renders with data-rig-date-range-picker', () => {
    const wrapper = mount(DateRangePicker)
    expect(wrapper.attributes('data-rig-date-range-picker')).toBeDefined()
  })

  it('shows placeholders when no value', () => {
    const wrapper = mount(DateRangePicker)
    expect(wrapper.find('[data-rig-date-range-picker-start]').text()).toBe('Start date')
    expect(wrapper.find('[data-rig-date-range-picker-end]').text()).toBe('End date')
  })

  it('opens popover on trigger click', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    expect(wrapper.find('[data-rig-date-range-picker-popover]').exists()).toBe(true)
  })

  it('closes on escape', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    expect(wrapper.find('[data-rig-date-range-picker-popover]').exists()).toBe(true)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[data-rig-date-range-picker-popover]').exists()).toBe(false)
  })

  it('has trigger with aria-expanded', async () => {
    const wrapper = mount(DateRangePicker)
    const trigger = wrapper.find('[data-rig-date-range-picker-trigger]')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('can focus the trigger button', () => {
    const wrapper = mount(DateRangePicker, { attachTo: document.body })
    const trigger = wrapper.find('[data-rig-date-range-picker-trigger]')
    ;(trigger.element as HTMLElement).focus()
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('emits update:modelValue when selecting a start date', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    const enabledDays = wrapper
      .findAll('[data-rig-date-range-picker-day]')
      .filter((d) => !d.attributes('disabled'))
    await enabledDays[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeDefined()
    expect(wrapper.emitted('update:modelValue')![0]![0]).toBeInstanceOf(Array)
  })

  it('displays modelValue dates instead of placeholders', () => {
    const wrapper = mount(DateRangePicker, {
      props: { modelValue: ['2025-01-15', '2025-01-20'] },
    })
    expect(wrapper.find('[data-rig-date-range-picker-start]').text()).toBe('2025-01-15')
    expect(wrapper.find('[data-rig-date-range-picker-end]').text()).toBe('2025-01-20')
  })

  it('has popover with dialog role', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    const popover = wrapper.find('[data-rig-date-range-picker-popover]')
    expect(popover.attributes('role')).toBe('dialog')
    expect(popover.attributes('aria-label')).toBe('Date range picker')
  })

  it('renders grid with grid role', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    expect(wrapper.find('[data-rig-date-range-picker-grid]').attributes('role')).toBe('grid')
  })

  it('navigates to next month', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    const header = wrapper.find('[data-rig-date-range-picker-header]')
    const monthText = header.text()
    const nextBtn = wrapper.find('button[aria-label="Next month"]')
    await nextBtn.trigger('click')
    expect(wrapper.find('[data-rig-date-range-picker-header]').text()).not.toBe(monthText)
  })

  it('navigates to previous month', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    const header = wrapper.find('[data-rig-date-range-picker-header]')
    const monthText = header.text()
    const prevBtn = wrapper.find('button[aria-label="Previous month"]')
    await prevBtn.trigger('click')
    expect(wrapper.find('[data-rig-date-range-picker-header]').text()).not.toBe(monthText)
  })

  it('uses custom placeholders', () => {
    const wrapper = mount(DateRangePicker, {
      props: { startPlaceholder: 'From', endPlaceholder: 'To' },
    })
    expect(wrapper.find('[data-rig-date-range-picker-start]').text()).toBe('From')
    expect(wrapper.find('[data-rig-date-range-picker-end]').text()).toBe('To')
  })

  it('shows info text', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    expect(wrapper.find('[data-rig-date-range-picker-info]').exists()).toBe(true)
  })

  it('renders separator between dates', () => {
    const wrapper = mount(DateRangePicker)
    expect(wrapper.find('[data-rig-date-range-picker-separator]').exists()).toBe(true)
  })

  it('sets data-state to open/closed', async () => {
    const wrapper = mount(DateRangePicker)
    expect(wrapper.find('[data-rig-date-range-picker]').attributes('data-state')).toBe('closed')
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    expect(wrapper.find('[data-rig-date-range-picker]').attributes('data-state')).toBe('open')
  })

  it('renders weekday headers', async () => {
    const wrapper = mount(DateRangePicker)
    await wrapper.find('[data-rig-date-range-picker-trigger]').trigger('click')
    const weekdays = wrapper.find('[data-rig-date-range-picker-weekdays]')
    expect(weekdays.exists()).toBe(true)
    expect(weekdays.findAll('span').length).toBeGreaterThan(0)
  })
})
