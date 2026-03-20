import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Testimonial from './Testimonial.vue'

describe('Testimonial', () => {
  it('renders with data-rig-testimonial', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Great product', attribution: 'Jane' },
    })
    expect(wrapper.find('[data-rig-testimonial]').exists()).toBe(true)
  })

  it('defaults layout to card', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Great', attribution: 'Jane' },
    })
    expect(wrapper.find('[data-rig-testimonial]').attributes('data-layout')).toBe('card')
  })

  it('accepts border layout', () => {
    const wrapper = mount(Testimonial, {
      props: { layout: 'border' },
      slots: { quote: 'Great', attribution: 'Jane' },
    })
    expect(wrapper.find('[data-rig-testimonial]').attributes('data-layout')).toBe('border')
  })

  it('renders quote slot', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Amazing library', attribution: 'Jane' },
    })
    expect(wrapper.find('[data-rig-testimonial-quote]').text()).toBe('Amazing library')
  })

  it('renders attribution slot in footer', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Great', attribution: '<cite>Jane Doe</cite>' },
    })
    const attr = wrapper.find('[data-rig-testimonial-attribution]')
    expect(attr.element.tagName).toBe('FOOTER')
    expect(attr.text()).toBe('Jane Doe')
  })

  it('renders decorator slot when provided', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Great', attribution: 'Jane', decorator: '"' },
    })
    expect(wrapper.find('[data-rig-testimonial-decorator]').exists()).toBe(true)
  })

  it('hides decorator when not provided', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Great', attribution: 'Jane' },
    })
    expect(wrapper.find('[data-rig-testimonial-decorator]').exists()).toBe(false)
  })

  it('renders divider slot when provided', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Great', attribution: 'Jane', divider: '<hr />' },
    })
    expect(wrapper.find('[data-rig-testimonial-divider]').exists()).toBe(true)
  })

  it('hides divider when not provided', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Great', attribution: 'Jane' },
    })
    expect(wrapper.find('[data-rig-testimonial-divider]').exists()).toBe(false)
  })

  it('renders blockquote element', () => {
    const wrapper = mount(Testimonial, {
      slots: { quote: 'Great', attribution: 'Jane' },
    })
    expect(wrapper.element.tagName).toBe('BLOCKQUOTE')
  })
})
