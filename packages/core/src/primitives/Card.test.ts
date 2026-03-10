import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card', () => {
  it('renders with data-rig-card', () => {
    const wrapper = mount(Card, { slots: { default: 'Hello' } })
    expect(wrapper.attributes('data-rig-card')).toBeDefined()
    expect(wrapper.text()).toBe('Hello')
  })

  it('renders as div by default', () => {
    const wrapper = mount(Card)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders as button when interactive', () => {
    const wrapper = mount(Card, { props: { interactive: true } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('data-interactive')).toBeDefined()
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('emits click when interactive', async () => {
    const wrapper = mount(Card, { props: { interactive: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('sets variant and size data attributes', () => {
    const wrapper = mount(Card, { props: { variant: 'accent', size: 'lg' } })
    expect(wrapper.attributes('data-variant')).toBe('accent')
    expect(wrapper.attributes('data-size')).toBe('lg')
  })

  it('sets accent CSS custom property', () => {
    const wrapper = mount(Card, { props: { accent: '#c9956d' } })
    expect(wrapper.attributes('style')).toContain('--rig-card-accent: #c9956d')
  })

  it('renders header and footer slots', () => {
    const wrapper = mount(Card, {
      slots: {
        header: '<h2>Title</h2>',
        default: 'Body',
        footer: '<small>Footer</small>',
      },
    })
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Body')
    expect(wrapper.text()).toContain('Footer')
  })
})
