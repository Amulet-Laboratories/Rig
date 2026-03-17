import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from './Alert.vue'

describe('Alert', () => {
  it('renders with data-rig-alert', () => {
    const wrapper = mount(Alert)
    expect(wrapper.find('[data-rig-alert]').exists()).toBe(true)
  })

  it('sets data-variant attribute', () => {
    const wrapper = mount(Alert, { props: { variant: 'warning' } })
    expect(wrapper.attributes('data-variant')).toBe('warning')
  })

  it('defaults to info variant', () => {
    const wrapper = mount(Alert)
    expect(wrapper.attributes('data-variant')).toBe('info')
  })

  it('renders title when provided', () => {
    const wrapper = mount(Alert, { props: { title: 'Heads up' } })
    const title = wrapper.find('[data-rig-alert-title]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Heads up')
  })

  it('does not render title when not provided', () => {
    const wrapper = mount(Alert)
    expect(wrapper.find('[data-rig-alert-title]').exists()).toBe(false)
  })

  it('has role="alert"', () => {
    const wrapper = mount(Alert)
    expect(wrapper.attributes('role')).toBe('alert')
  })

  it('sets aria-live to polite for non-error variants', () => {
    const wrapper = mount(Alert, { props: { variant: 'info' } })
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  it('sets aria-live to assertive for error variant', () => {
    const wrapper = mount(Alert, { props: { variant: 'error' } })
    expect(wrapper.attributes('aria-live')).toBe('assertive')
  })

  it('renders dismiss button when dismissible', () => {
    const wrapper = mount(Alert, { props: { dismissible: true } })
    expect(wrapper.find('[data-rig-alert-dismiss]').exists()).toBe(true)
  })

  it('does not render dismiss button by default', () => {
    const wrapper = mount(Alert)
    expect(wrapper.find('[data-rig-alert-dismiss]').exists()).toBe(false)
  })

  it('hides alert on dismiss click', async () => {
    const wrapper = mount(Alert, { props: { dismissible: true } })
    await wrapper.find('[data-rig-alert-dismiss]').trigger('click')
    expect(wrapper.find('[data-rig-alert]').exists()).toBe(false)
  })

  it('emits dismiss event on dismiss click', async () => {
    const wrapper = mount(Alert, { props: { dismissible: true } })
    await wrapper.find('[data-rig-alert-dismiss]').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('renders default slot content', () => {
    const wrapper = mount(Alert, {
      slots: { default: '<p data-test-body>Body text</p>' },
    })
    expect(wrapper.find('[data-test-body]').exists()).toBe(true)
    expect(wrapper.find('[data-test-body]').text()).toBe('Body text')
  })

  it('renders icon slot', () => {
    const wrapper = mount(Alert, {
      slots: { icon: '<span data-test-icon />' },
    })
    expect(wrapper.find('[data-test-icon]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-alert-icon]').exists()).toBe(true)
  })

  it('renders action slot', () => {
    const wrapper = mount(Alert, {
      slots: { action: '<button data-test-action>Retry</button>' },
    })
    expect(wrapper.find('[data-test-action]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-alert-action]').exists()).toBe(true)
  })

  it('does not render action wrapper when slot is empty', () => {
    const wrapper = mount(Alert)
    expect(wrapper.find('[data-rig-alert-action]').exists()).toBe(false)
  })
})
