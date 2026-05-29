import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Section from './Section.vue'

describe('Section', () => {
  it('renders with data-rig-section', () => {
    const wrapper = mount(Section)
    expect(wrapper.find('[data-rig-section]').exists()).toBe(true)
  })

  it('defaults variant to default', () => {
    const wrapper = mount(Section)
    expect(wrapper.find('[data-rig-section]').attributes('data-variant')).toBe('default')
  })

  it('accepts alternate variant', () => {
    const wrapper = mount(Section, { props: { variant: 'alternate' } })
    expect(wrapper.find('[data-rig-section]').attributes('data-variant')).toBe('alternate')
  })

  it('accepts bordered variant', () => {
    const wrapper = mount(Section, { props: { variant: 'bordered' } })
    expect(wrapper.find('[data-rig-section]').attributes('data-variant')).toBe('bordered')
  })

  it('renders title as h2', () => {
    const wrapper = mount(Section, { props: { title: 'Features' } })
    expect(wrapper.find('[data-rig-section-title]').text()).toBe('Features')
    expect(wrapper.find('[data-rig-section-title]').element.tagName).toBe('H2')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(Section, { props: { title: 'Features', subtitle: 'The best' } })
    expect(wrapper.find('[data-rig-section-subtitle]').text()).toBe('The best')
  })

  it('hides subtitle when not provided', () => {
    const wrapper = mount(Section, { props: { title: 'Features' } })
    expect(wrapper.find('[data-rig-section-subtitle]').exists()).toBe(false)
  })

  it('shows accent bar when decorated is true', () => {
    const wrapper = mount(Section, { props: { title: 'Features', decorated: true } })
    expect(wrapper.find('[data-rig-section-accent]').exists()).toBe(true)
  })

  it('hides accent bar when decorated is not set', () => {
    const wrapper = mount(Section, { props: { title: 'Features' } })
    expect(wrapper.find('[data-rig-section-accent]').exists()).toBe(false)
  })

  it('sets data-centered on header when centered is true', () => {
    const wrapper = mount(Section, { props: { title: 'Features', centered: true } })
    expect(wrapper.find('[data-rig-section-header]').attributes('data-centered')).toBeDefined()
  })

  it('omits data-centered when centered is not set', () => {
    const wrapper = mount(Section, { props: { title: 'Features' } })
    expect(wrapper.find('[data-rig-section-header]').attributes('data-centered')).toBeUndefined()
  })

  it('renders header slot instead of title', () => {
    const wrapper = mount(Section, {
      slots: { header: '<h3>Custom Header</h3>' },
    })
    expect(wrapper.find('[data-rig-section-header]').text()).toBe('Custom Header')
    expect(wrapper.find('[data-rig-section-title]').exists()).toBe(false)
  })

  it('hides header when no title and no header slot', () => {
    const wrapper = mount(Section)
    expect(wrapper.find('[data-rig-section-header]').exists()).toBe(false)
  })

  it('renders default slot content', () => {
    const wrapper = mount(Section, { slots: { default: '<p>Body</p>' } })
    expect(wrapper.find('[data-rig-section-container]').text()).toBe('Body')
  })

  it('renders section element', () => {
    const wrapper = mount(Section)
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
