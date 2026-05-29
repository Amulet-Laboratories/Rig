import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CalendarGrid from './CalendarGrid.vue'

describe('CalendarGrid', () => {
  it('renders with data-rig-calendar-grid', () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    expect(wrapper.find('[data-rig-calendar-grid]').exists()).toBe(true)
  })

  it('displays month name', () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    expect(wrapper.find('[data-rig-calendar-grid-title]').text()).toContain('January')
    expect(wrapper.find('[data-rig-calendar-grid-title]').text()).toContain('2025')
  })

  it('renders 42 day cells', () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    expect(wrapper.findAll('[data-rig-calendar-grid-day]')).toHaveLength(42)
  })

  it('renders weekday headers', () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    expect(wrapper.findAll('[data-rig-calendar-grid-weekday]')).toHaveLength(7)
  })

  it('marks selected date', () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    const selected = wrapper.find('[data-selected]')
    expect(selected.exists()).toBe(true)
  })

  it('emits update:modelValue on day click', async () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    await wrapper.findAll('[data-rig-calendar-grid-day]')[10]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('renders events on matching dates', () => {
    const wrapper = mount(CalendarGrid, {
      props: {
        modelValue: '2025-01-15',
        events: [{ date: '2025-01-15', label: 'Meeting' }],
      },
    })
    expect(wrapper.find('[data-rig-calendar-grid-event]').text()).toBe('Meeting')
  })

  it('navigates to previous month', async () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-02-15' } })
    await wrapper.findAll('[data-rig-calendar-grid-nav]')[0]!.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toBe('2025-01-01')
  })

  it('navigates to next month', async () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    await wrapper.findAll('[data-rig-calendar-grid-nav]')[1]!.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toBe('2025-02-01')
  })

  it('has correct ARIA attributes', () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    // role="grid" is on a nested inner div, not the root wrapper
    const grid = wrapper.find('[role="grid"]')
    expect(grid.exists()).toBe(true)
    expect(grid.attributes('aria-label')).toBeTruthy()
  })

  it('sets data-view attribute', () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15', view: 'week' } })
    expect(wrapper.find('[data-rig-calendar-grid]').attributes('data-view')).toBe('week')
  })

  it('handles keyboard navigation', async () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    const day = wrapper.find('[data-rig-calendar-grid-day]')
    await day.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('supports focus management', () => {
    const wrapper = mount(CalendarGrid, {
      props: { modelValue: '2025-01-15' },
      attachTo: document.body,
    })
    const day = wrapper.find('[data-rig-calendar-grid-day]')
    expect(day.attributes('tabindex')).toBe('0')
    ;(day.element as HTMLElement).focus()
    expect(document.activeElement).toBe(day.element)
    wrapper.unmount()
  })

  it('reacts to prop updates', async () => {
    const wrapper = mount(CalendarGrid, { props: { modelValue: '2025-01-15' } })
    expect(wrapper.find('[data-rig-calendar-grid-title]').text()).toContain('January')
    await wrapper.setProps({ modelValue: '2025-03-10' })
    expect(wrapper.find('[data-rig-calendar-grid-title]').text()).toContain('March')
  })
})
