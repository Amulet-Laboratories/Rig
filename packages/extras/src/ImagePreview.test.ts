import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ImagePreview from './ImagePreview.vue'

describe('ImagePreview', () => {
  it('renders with data-rig-image-preview', () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png' } })
    expect(wrapper.find('[data-rig-image-preview]').exists()).toBe(true)
  })

  it('renders img with src', () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png' } })
    expect(wrapper.find('img').attributes('src')).toBe('test.png')
  })

  it('sets alt text', () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png', alt: 'Preview' } })
    expect(wrapper.find('img').attributes('alt')).toBe('Preview')
  })

  it('emits load on image load', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png' } })
    await wrapper.find('img').trigger('load')
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('sets data-loaded after load', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png' } })
    await wrapper.find('img').trigger('load')
    expect(wrapper.find('[data-rig-image-preview]').attributes('data-loaded')).toBeDefined()
  })

  it('emits error on image error', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'bad.png' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('sets data-error after error', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'bad.png' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('[data-rig-image-preview]').attributes('data-error')).toBeDefined()
  })

  it('falls back to fallback src on error', async () => {
    const wrapper = mount(ImagePreview, {
      props: { src: 'bad.png', fallback: 'fallback.png' },
    })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').attributes('src')).toBe('fallback.png')
  })

  it('sets data-zoomable when zoomable', () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png', zoomable: true } })
    expect(wrapper.find('[data-rig-image-preview]').attributes('data-zoomable')).toBeDefined()
  })

  it('sets role button when zoomable', () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png', zoomable: true } })
    expect(wrapper.find('[data-rig-image-preview]').attributes('role')).toBe('button')
  })

  it('sets tabindex 0 when zoomable', () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png', zoomable: true } })
    expect(wrapper.find('[data-rig-image-preview]').attributes('tabindex')).toBe('0')
  })

  it('emits zoom on click when zoomable and loaded', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png', zoomable: true } })
    await wrapper.find('img').trigger('load')
    await wrapper.find('[data-rig-image-preview]').trigger('click')
    expect(wrapper.emitted('zoom')?.[0]).toEqual(['test.png'])
  })

  it('does not emit zoom when not loaded', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png', zoomable: true } })
    await wrapper.find('[data-rig-image-preview]').trigger('click')
    expect(wrapper.emitted('zoom')).toBeUndefined()
  })

  it('emits zoom on Enter key when zoomable and loaded', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png', zoomable: true } })
    await wrapper.find('img').trigger('load')
    await wrapper.find('[data-rig-image-preview]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('zoom')?.[0]).toEqual(['test.png'])
  })

  it('emits zoom on Space key when zoomable and loaded', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'test.png', zoomable: true } })
    await wrapper.find('img').trigger('load')
    await wrapper.find('[data-rig-image-preview]').trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('zoom')?.[0]).toEqual(['test.png'])
  })

  it('resets state when src changes', async () => {
    const wrapper = mount(ImagePreview, { props: { src: 'a.png' } })
    await wrapper.find('img').trigger('load')
    expect(wrapper.find('[data-rig-image-preview]').attributes('data-loaded')).toBeDefined()
    await wrapper.setProps({ src: 'b.png' })
    expect(wrapper.find('[data-rig-image-preview]').attributes('data-loaded')).toBeUndefined()
  })

  it('renders overlay slot after load', async () => {
    const wrapper = mount(ImagePreview, {
      props: { src: 'test.png' },
      slots: { overlay: '<span>Zoom</span>' },
    })
    expect(wrapper.find('[data-rig-image-preview-overlay]').exists()).toBe(false)
    await wrapper.find('img').trigger('load')
    expect(wrapper.find('[data-rig-image-preview-overlay]').exists()).toBe(true)
  })

  it('renders loading slot before load', () => {
    const wrapper = mount(ImagePreview, {
      props: { src: 'test.png' },
      slots: { loading: '<span>Loading...</span>' },
    })
    expect(wrapper.text()).toContain('Loading...')
  })
})
