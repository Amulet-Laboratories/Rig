import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapPlaceholder from './MapPlaceholder.vue'

describe('MapPlaceholder', () => {
  it('renders with data-rig-map-placeholder', () => {
    const wrapper = mount(MapPlaceholder)
    expect(wrapper.attributes('data-rig-map-placeholder')).toBe('')
  })

  it('applies the default aspect ratio class', () => {
    const wrapper = mount(MapPlaceholder)
    expect(wrapper.classes()).toContain('aspect-[16/9]')
  })

  it('applies a custom aspect ratio class', () => {
    const wrapper = mount(MapPlaceholder, { props: { aspect: 'aspect-[16/7]' } })
    expect(wrapper.classes()).toContain('aspect-[16/7]')
    expect(wrapper.classes()).not.toContain('aspect-[16/9]')
  })

  it('renders the default pin icon', () => {
    const wrapper = mount(MapPlaceholder)
    const pin = wrapper.find('[data-rig-map-pin]')
    expect(pin.exists()).toBe(true)
    expect(pin.attributes('aria-hidden')).toBe('true')
  })

  it('renders address and description when provided', () => {
    const wrapper = mount(MapPlaceholder, {
      props: { address: '12 Harbour Row', description: 'Corner of Salt and Signal' },
    })
    expect(wrapper.find('[data-rig-map-address]').text()).toBe('12 Harbour Row')
    expect(wrapper.find('[data-rig-map-description]').text()).toBe('Corner of Salt and Signal')
  })

  it('omits address and description when empty', () => {
    const wrapper = mount(MapPlaceholder)
    expect(wrapper.find('[data-rig-map-address]').exists()).toBe(false)
    expect(wrapper.find('[data-rig-map-description]').exists()).toBe(false)
  })

  it('replaces the pin via the icon slot', () => {
    const wrapper = mount(MapPlaceholder, {
      slots: { icon: '<span data-custom-pin>pin</span>' },
    })
    expect(wrapper.find('[data-custom-pin]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-map-pin]').exists()).toBe(false)
  })

  it('replaces the address block via the default slot', () => {
    const wrapper = mount(MapPlaceholder, {
      props: { address: '12 Harbour Row' },
      slots: { default: '<p data-custom-body>Directions</p>' },
    })
    expect(wrapper.find('[data-custom-body]').exists()).toBe(true)
    // The default slot replaces the address markup entirely.
    expect(wrapper.find('[data-rig-map-address]').exists()).toBe(false)
  })
})
