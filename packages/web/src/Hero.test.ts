import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero from './Hero.vue'

describe('Hero', () => {
  it('renders with data-rig-hero', () => {
    const wrapper = mount(Hero, { slots: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-hero]').exists()).toBe(true)
  })

  it('defaults layout to split', () => {
    const wrapper = mount(Hero, { slots: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-hero]').attributes('data-layout')).toBe('split')
  })

  it('accepts centered layout', () => {
    const wrapper = mount(Hero, { props: { layout: 'centered' }, slots: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-hero]').attributes('data-layout')).toBe('centered')
  })

  it('accepts immersive layout', () => {
    const wrapper = mount(Hero, { props: { layout: 'immersive' }, slots: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-hero]').attributes('data-layout')).toBe('immersive')
  })

  it('renders title slot', () => {
    const wrapper = mount(Hero, { slots: { title: '<h1>My Title</h1>' } })
    expect(wrapper.find('[data-rig-hero-title]').text()).toBe('My Title')
  })

  it('renders eyebrow slot when provided', () => {
    const wrapper = mount(Hero, {
      slots: { title: 'Hello', eyebrow: '<span>New</span>' },
    })
    expect(wrapper.find('[data-rig-hero-eyebrow]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-hero-eyebrow]').text()).toBe('New')
  })

  it('hides eyebrow when not provided', () => {
    const wrapper = mount(Hero, { slots: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-hero-eyebrow]').exists()).toBe(false)
  })

  it('renders description slot when provided', () => {
    const wrapper = mount(Hero, {
      slots: { title: 'Hello', description: 'A great product' },
    })
    expect(wrapper.find('[data-rig-hero-description]').text()).toBe('A great product')
  })

  it('hides description when not provided', () => {
    const wrapper = mount(Hero, { slots: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-hero-description]').exists()).toBe(false)
  })

  it('renders actions slot when provided', () => {
    const wrapper = mount(Hero, {
      slots: { title: 'Hello', actions: '<button>CTA</button>' },
    })
    expect(wrapper.find('[data-rig-hero-actions]').exists()).toBe(true)
  })

  it('renders media slot when provided', () => {
    const wrapper = mount(Hero, {
      slots: { title: 'Hello', media: '<img src="hero.png" />' },
    })
    expect(wrapper.find('[data-rig-hero-media]').exists()).toBe(true)
  })

  it('hides media when not provided', () => {
    const wrapper = mount(Hero, { slots: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-hero-media]').exists()).toBe(false)
  })

  it('renders overlay slot when provided', () => {
    const wrapper = mount(Hero, {
      slots: { title: 'Hello', overlay: '<div>Search</div>' },
    })
    expect(wrapper.find('[data-rig-hero-overlay]').exists()).toBe(true)
  })

  it('hides overlay when not provided', () => {
    const wrapper = mount(Hero, { slots: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-hero-overlay]').exists()).toBe(false)
  })

  it('renders scrim when scrim prop is true and media is provided', () => {
    const wrapper = mount(Hero, {
      props: { scrim: true },
      slots: { title: 'Hello', media: '<img src="bg.jpg" />' },
    })
    expect(wrapper.find('[data-rig-hero-scrim]').exists()).toBe(true)
  })

  it('hides scrim when scrim prop is false', () => {
    const wrapper = mount(Hero, {
      slots: { title: 'Hello', media: '<img src="bg.jpg" />' },
    })
    expect(wrapper.find('[data-rig-hero-scrim]').exists()).toBe(false)
  })

  it('hides scrim when no media is provided', () => {
    const wrapper = mount(Hero, {
      props: { scrim: true },
      slots: { title: 'Hello' },
    })
    expect(wrapper.find('[data-rig-hero-scrim]').exists()).toBe(false)
  })

  it('renders section element', () => {
    const wrapper = mount(Hero, { slots: { title: 'Hello' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
