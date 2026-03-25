import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CTABanner from './CTABanner.vue'

describe('CTABanner', () => {
  it('renders with data-rig-cta-banner', () => {
    const wrapper = mount(CTABanner)
    expect(wrapper.find('[data-rig-cta-banner]').exists()).toBe(true)
  })

  it('defaults layout to row', () => {
    const wrapper = mount(CTABanner)
    expect(wrapper.find('[data-rig-cta-banner]').attributes('data-layout')).toBe('row')
  })

  it('accepts centered layout', () => {
    const wrapper = mount(CTABanner, { props: { layout: 'centered' } })
    expect(wrapper.find('[data-rig-cta-banner]').attributes('data-layout')).toBe('centered')
  })

  it('renders default slot content', () => {
    const wrapper = mount(CTABanner, { slots: { default: '<p>Get started</p>' } })
    expect(wrapper.find('[data-rig-cta-banner-content]').text()).toBe('Get started')
  })

  it('renders icon slot when provided', () => {
    const wrapper = mount(CTABanner, {
      slots: { icon: '<span>★</span>' },
    })
    expect(wrapper.find('[data-rig-cta-banner-icon]').exists()).toBe(true)
  })

  it('hides icon slot when not provided', () => {
    const wrapper = mount(CTABanner)
    expect(wrapper.find('[data-rig-cta-banner-icon]').exists()).toBe(false)
  })

  it('renders action slot when provided', () => {
    const wrapper = mount(CTABanner, {
      slots: { action: '<button>Sign up</button>' },
    })
    expect(wrapper.find('[data-rig-cta-banner-action]').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Sign up')
  })

  it('hides action slot when not provided', () => {
    const wrapper = mount(CTABanner)
    expect(wrapper.find('[data-rig-cta-banner-action]').exists()).toBe(false)
  })

  it('defaults variant to default', () => {
    const wrapper = mount(CTABanner)
    expect(wrapper.find('[data-rig-cta-banner]').attributes('data-variant')).toBe('default')
  })

  it('accepts card variant', () => {
    const wrapper = mount(CTABanner, { props: { variant: 'card' } })
    expect(wrapper.find('[data-rig-cta-banner]').attributes('data-variant')).toBe('card')
  })

  it('accepts destructive variant', () => {
    const wrapper = mount(CTABanner, { props: { variant: 'destructive' } })
    expect(wrapper.find('[data-rig-cta-banner]').attributes('data-variant')).toBe('destructive')
  })

  it('renders section element', () => {
    const wrapper = mount(CTABanner)
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
