import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionHeader from './SectionHeader.vue'

describe('SectionHeader', () => {
  it('renders with data-rig-section-header', () => {
    const wrapper = mount(SectionHeader, { slots: { default: 'Title' } })
    expect(wrapper.find('[data-rig-section-header]').exists()).toBe(true)
  })

  it('renders as h3 by default', () => {
    const wrapper = mount(SectionHeader, { slots: { default: 'Title' } })
    expect(wrapper.element.tagName).toBe('H3')
  })

  it('renders as custom element', () => {
    const wrapper = mount(SectionHeader, { props: { as: 'h2' }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName).toBe('H2')
  })

  it('renders as span', () => {
    const wrapper = mount(SectionHeader, { props: { as: 'span' }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('defaults size to xs', () => {
    const wrapper = mount(SectionHeader, { slots: { default: 'Title' } })
    expect(wrapper.attributes('data-size')).toBe('xs')
  })

  it('applies size variants', () => {
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
      const wrapper = mount(SectionHeader, { props: { size }, slots: { default: 'Title' } })
      expect(wrapper.attributes('data-size')).toBe(size)
    }
  })

  it('applies muted attribute by default', () => {
    const wrapper = mount(SectionHeader, { slots: { default: 'Title' } })
    expect(wrapper.attributes('data-muted')).not.toBeUndefined()
  })

  it('omits muted attribute when false', () => {
    const wrapper = mount(SectionHeader, { props: { muted: false }, slots: { default: 'Title' } })
    expect(wrapper.attributes('data-muted')).toBeUndefined()
  })

  it('renders slot content', () => {
    const wrapper = mount(SectionHeader, { slots: { default: 'Business' } })
    expect(wrapper.text()).toBe('Business')
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(SectionHeader, {
      props: { size: 'xs' },
      slots: { default: 'Title' },
    })
    expect(wrapper.attributes('data-size')).toBe('xs')
    await wrapper.setProps({ size: 'sm' })
    expect(wrapper.attributes('data-size')).toBe('sm')
  })
})
