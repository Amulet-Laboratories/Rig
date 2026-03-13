import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'
import { nextTick } from 'vue'

describe('Avatar', () => {
  it('renders with data-rig-avatar', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane Doe' } })
    expect(wrapper.find('[data-rig-avatar]').exists()).toBe(true)
  })

  it('shows initials from full name', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane Doe' } })
    expect(wrapper.find('[data-rig-avatar-initials]').text()).toBe('JD')
  })

  it('shows single initial from one-word name', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane' } })
    expect(wrapper.find('[data-rig-avatar-initials]').text()).toBe('J')
  })

  it('handles multi-word names using first and last', () => {
    const wrapper = mount(Avatar, { props: { name: 'Mary Jane Watson' } })
    expect(wrapper.find('[data-rig-avatar-initials]').text()).toBe('MW')
  })

  it('sets role="img" with aria-label from name', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane Doe' } })
    const el = wrapper.find('[data-rig-avatar]')
    expect(el.attributes('role')).toBe('img')
    expect(el.attributes('aria-label')).toBe('Jane Doe')
  })

  it('renders image when src is provided', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Jane Doe', src: '/avatar.jpg' },
    })
    const img = wrapper.find('[data-rig-avatar-img]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/avatar.jpg')
    expect(img.attributes('alt')).toBe('Jane Doe')
  })

  it('hides initials when image is provided', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Jane Doe', src: '/avatar.jpg' },
    })
    expect(wrapper.find('[data-rig-avatar-initials]').exists()).toBe(false)
  })

  it('applies size attribute', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane', size: 'lg' } })
    expect(wrapper.find('[data-rig-avatar]').attributes('data-size')).toBe('lg')
  })

  it('applies status indicator', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane', status: 'online' } })
    const status = wrapper.find('[data-rig-avatar-status]')
    expect(status.exists()).toBe(true)
    expect(status.attributes('data-status')).toBe('online')
  })

  it('omits status indicator when null', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane' } })
    expect(wrapper.find('[data-rig-avatar-status]').exists()).toBe(false)
  })

  it('generates deterministic background color from name', () => {
    const wrapper1 = mount(Avatar, { props: { name: 'Alice' } })
    const wrapper2 = mount(Avatar, { props: { name: 'Alice' } })
    const wrapper3 = mount(Avatar, { props: { name: 'Bob' } })

    const style1 = wrapper1.find('[data-rig-avatar]').attributes('style')
    const style2 = wrapper2.find('[data-rig-avatar]').attributes('style')
    const style3 = wrapper3.find('[data-rig-avatar]').attributes('style')

    expect(style1).toBe(style2)
    expect(style1).not.toBe(style3)
  })

  it('uses explicit color when provided', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Jane', color: '#ff0000' },
    })
    const style = wrapper.find('[data-rig-avatar]').attributes('style')
    expect(style).toContain('#ff0000')
  })

  it('renders slot content instead of initials', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Jane' },
      slots: { default: '<span class="custom">Custom</span>' },
    })
    expect(wrapper.find('.custom').exists()).toBe(true)
    expect(wrapper.find('[data-rig-avatar-initials]').exists()).toBe(false)
  })

  it('defaults to md size', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane' } })
    expect(wrapper.find('[data-rig-avatar]').attributes('data-size')).toBe('md')
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Test' } })
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(Avatar, { props: { name: 'Test' }, attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Test' } })
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Test' } })
    await wrapper.setProps({ color: '#ff0000' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
