import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from './SiteFooter.vue'

describe('SiteFooter', () => {
  it('renders with data-rig-site-footer', () => {
    const wrapper = mount(SiteFooter)
    expect(wrapper.find('[data-rig-site-footer]').exists()).toBe(true)
  })

  it('defaults columns to 3', () => {
    const wrapper = mount(SiteFooter)
    expect(wrapper.find('[data-rig-site-footer]').attributes('data-columns')).toBe('3')
  })

  it('accepts custom columns', () => {
    const wrapper = mount(SiteFooter, { props: { columns: 4 } })
    expect(wrapper.find('[data-rig-site-footer]').attributes('data-columns')).toBe('4')
  })

  it('renders default slot in grid', () => {
    const wrapper = mount(SiteFooter, {
      slots: { default: '<div>Column 1</div>' },
    })
    expect(wrapper.find('[data-rig-site-footer-grid]').text()).toBe('Column 1')
  })

  it('renders pre-footer slot when provided', () => {
    const wrapper = mount(SiteFooter, {
      slots: { 'pre-footer': '<div>Alert</div>' },
    })
    expect(wrapper.find('[data-rig-site-footer-pre]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-site-footer-pre]').text()).toBe('Alert')
  })

  it('hides pre-footer when not provided', () => {
    const wrapper = mount(SiteFooter)
    expect(wrapper.find('[data-rig-site-footer-pre]').exists()).toBe(false)
  })

  it('renders post-footer slot when provided', () => {
    const wrapper = mount(SiteFooter, {
      slots: { 'post-footer': '<small>© 2026</small>' },
    })
    expect(wrapper.find('[data-rig-site-footer-post]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-site-footer-post]').text()).toBe('© 2026')
  })

  it('hides post-footer when not provided', () => {
    const wrapper = mount(SiteFooter)
    expect(wrapper.find('[data-rig-site-footer-post]').exists()).toBe(false)
  })

  it('defaults variant to default', () => {
    const wrapper = mount(SiteFooter)
    expect(wrapper.find('[data-rig-site-footer]').attributes('data-variant')).toBe('default')
  })

  it('accepts card variant', () => {
    const wrapper = mount(SiteFooter, { props: { variant: 'card' } })
    expect(wrapper.find('[data-rig-site-footer]').attributes('data-variant')).toBe('card')
  })

  it('accepts inverted variant', () => {
    const wrapper = mount(SiteFooter, { props: { variant: 'inverted' } })
    expect(wrapper.find('[data-rig-site-footer]').attributes('data-variant')).toBe('inverted')
  })

  it('renders footer element', () => {
    const wrapper = mount(SiteFooter)
    expect(wrapper.element.tagName).toBe('FOOTER')
  })
})
