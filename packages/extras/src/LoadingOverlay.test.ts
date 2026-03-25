import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingOverlay from './LoadingOverlay.vue'

function factory(props: Partial<InstanceType<typeof LoadingOverlay>['$props']> = {}) {
  return mount(LoadingOverlay, { props })
}

describe('LoadingOverlay', () => {
  it('does not render when active is false', () => {
    const wrapper = factory({ active: false })
    expect(wrapper.find('[data-rig-loading-overlay]').exists()).toBe(false)
  })

  it('does not render by default (active defaults to false)', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-loading-overlay]').exists()).toBe(false)
  })

  it('renders when active is true', () => {
    const wrapper = factory({ active: true })
    expect(wrapper.find('[data-rig-loading-overlay]').exists()).toBe(true)
  })

  it('has role="status"', () => {
    const wrapper = factory({ active: true })
    expect(wrapper.find('[data-rig-loading-overlay]').attributes('role')).toBe('status')
  })

  it('has aria-live="polite"', () => {
    const wrapper = factory({ active: true })
    expect(wrapper.find('[data-rig-loading-overlay]').attributes('aria-live')).toBe('polite')
  })

  it('uses default label "Loading"', () => {
    const wrapper = factory({ active: true })
    expect(wrapper.find('[data-rig-loading-overlay]').attributes('aria-label')).toBe('Loading')
    expect(wrapper.find('[data-rig-loading-overlay-label]').text()).toBe('Loading')
  })

  it('renders custom label', () => {
    const wrapper = factory({ active: true, label: 'Saving changes' })
    expect(wrapper.find('[data-rig-loading-overlay]').attributes('aria-label')).toBe(
      'Saving changes',
    )
    expect(wrapper.find('[data-rig-loading-overlay-label]').text()).toBe('Saving changes')
  })

  it('sets data-active attribute when active', () => {
    const wrapper = factory({ active: true })
    expect(wrapper.find('[data-rig-loading-overlay]').attributes('data-active')).toBe('true')
  })

  it('renders spinner container with aria-hidden', () => {
    const wrapper = factory({ active: true })
    const spinner = wrapper.find('[data-rig-loading-overlay-spinner]')
    expect(spinner.exists()).toBe(true)
    expect(spinner.attributes('aria-hidden')).toBe('true')
  })

  it('renders default slot content inside spinner', () => {
    const wrapper = mount(LoadingOverlay, {
      props: { active: true },
      slots: {
        default: '<svg id="custom-spinner" />',
      },
    })
    const spinner = wrapper.find('[data-rig-loading-overlay-spinner]')
    expect(spinner.find('#custom-spinner').exists()).toBe(true)
  })

  it('toggles visibility when active prop changes', async () => {
    const wrapper = mount(LoadingOverlay, { props: { active: false } })
    expect(wrapper.find('[data-rig-loading-overlay]').exists()).toBe(false)
    await wrapper.setProps({ active: true })
    expect(wrapper.find('[data-rig-loading-overlay]').exists()).toBe(true)
    await wrapper.setProps({ active: false })
    expect(wrapper.find('[data-rig-loading-overlay]').exists()).toBe(false)
  })

  it('updates label reactively', async () => {
    const wrapper = mount(LoadingOverlay, { props: { active: true, label: 'Loading' } })
    expect(wrapper.find('[data-rig-loading-overlay-label]').text()).toBe('Loading')
    await wrapper.setProps({ label: 'Processing' })
    expect(wrapper.find('[data-rig-loading-overlay-label]').text()).toBe('Processing')
    expect(wrapper.find('[data-rig-loading-overlay]').attributes('aria-label')).toBe('Processing')
  })
})
