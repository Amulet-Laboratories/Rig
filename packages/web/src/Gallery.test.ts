import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Gallery from './Gallery.vue'

const items = [
  { id: '1', title: 'Series One', description: 'First exhibition', img: '/img1.jpg' },
  { id: '2', title: 'Series Two', description: 'Second exhibition', img: '/img2.jpg' },
  { id: '3', title: 'Series Three', description: 'Third exhibition', img: '/img3.jpg' },
]

describe('Gallery', () => {
  it('renders with data-rig-gallery', () => {
    const wrapper = mount(Gallery, { props: { items } })
    expect(wrapper.find('[data-rig-gallery]').exists()).toBe(true)
  })

  it('defaults to alternating layout', () => {
    const wrapper = mount(Gallery, { props: { items } })
    expect(wrapper.find('[data-rig-gallery]').attributes('data-layout')).toBe('alternating')
  })

  it('renders correct number of items', () => {
    const wrapper = mount(Gallery, { props: { items } })
    expect(wrapper.findAll('[data-rig-gallery-item]')).toHaveLength(3)
  })

  it('alternates image-first attribute', () => {
    const wrapper = mount(Gallery, { props: { items } })
    const galleryItems = wrapper.findAll('[data-rig-gallery-item]')
    expect(galleryItems[0]!.attributes('data-image-first')).toBeDefined()
    expect(galleryItems[1]!.attributes('data-image-first')).toBeUndefined()
    expect(galleryItems[2]!.attributes('data-image-first')).toBeDefined()
  })

  it('respects startSide right', () => {
    const wrapper = mount(Gallery, { props: { items, startSide: 'right' } })
    const galleryItems = wrapper.findAll('[data-rig-gallery-item]')
    expect(galleryItems[0]!.attributes('data-image-first')).toBeUndefined()
    expect(galleryItems[1]!.attributes('data-image-first')).toBeDefined()
  })

  it('renders image side attributes', () => {
    const wrapper = mount(Gallery, { props: { items } })
    const images = wrapper.findAll('[data-rig-gallery-image]')
    expect(images[0]!.attributes('data-side')).toBe('left')
    expect(images[1]!.attributes('data-side')).toBe('right')
    expect(images[2]!.attributes('data-side')).toBe('left')
  })

  it('renders titles', () => {
    const wrapper = mount(Gallery, { props: { items } })
    const titles = wrapper.findAll('[data-rig-gallery-title]')
    expect(titles[0]!.text()).toBe('Series One')
  })

  it('renders descriptions', () => {
    const wrapper = mount(Gallery, { props: { items } })
    const descs = wrapper.findAll('[data-rig-gallery-description]')
    expect(descs[0]!.text()).toBe('First exhibition')
  })

  it('renders images with lazy loading', () => {
    const wrapper = mount(Gallery, { props: { items } })
    const imgs = wrapper.findAll('[data-rig-gallery-img]')
    expect(imgs).toHaveLength(3)
    expect(imgs[0]!.attributes('loading')).toBe('lazy')
    expect(imgs[0]!.attributes('alt')).toBe('Series One')
  })

  it('accepts grid layout', () => {
    const wrapper = mount(Gallery, { props: { items, layout: 'grid' } })
    expect(wrapper.find('[data-rig-gallery]').attributes('data-layout')).toBe('grid')
  })

  it('handles items without images', () => {
    const noImg = [{ id: '1', title: 'Text Only', description: 'No image' }]
    const wrapper = mount(Gallery, { props: { items: noImg } })
    expect(wrapper.find('[data-rig-gallery-img]').exists()).toBe(false)
  })
})
