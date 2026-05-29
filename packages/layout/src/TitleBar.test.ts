import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TitleBar from './TitleBar.vue'

describe('TitleBar', () => {
  it('renders with data-rig-titlebar', () => {
    const wrapper = mount(TitleBar)
    expect(wrapper.find('[data-rig-titlebar]').exists()).toBe(true)
  })

  it('has role="banner"', () => {
    const wrapper = mount(TitleBar)
    expect(wrapper.find('[data-rig-titlebar]').attributes('role')).toBe('banner')
  })

  it('renders title and subtitle', () => {
    const wrapper = mount(TitleBar, { props: { title: 'App.vue', subtitle: 'my-project' } })
    expect(wrapper.find('[data-rig-titlebar-title]').text()).toBe('App.vue')
    expect(wrapper.find('[data-rig-titlebar-subtitle]').text()).toBe('my-project')
    expect(wrapper.find('[data-rig-titlebar-separator]').exists()).toBe(true)
  })

  it('hides separator when only title', () => {
    const wrapper = mount(TitleBar, { props: { title: 'App.vue' } })
    expect(wrapper.find('[data-rig-titlebar-separator]').exists()).toBe(false)
  })

  it('renders leading slot', () => {
    const wrapper = mount(TitleBar, {
      slots: { leading: '<nav data-test-menu>Menu</nav>' },
    })
    expect(wrapper.find('[data-rig-titlebar-leading] [data-test-menu]').exists()).toBe(true)
  })

  it('renders trailing slot', () => {
    const wrapper = mount(TitleBar, {
      slots: { trailing: '<button data-test-close>Close</button>' },
    })
    expect(wrapper.find('[data-rig-titlebar-trailing] [data-test-close]').exists()).toBe(true)
  })

  it('renders default slot overriding caption', () => {
    const wrapper = mount(TitleBar, {
      props: { title: 'Ignored' },
      slots: { default: '<span data-test-custom>Custom Caption</span>' },
    })
    expect(wrapper.find('[data-test-custom]').text()).toBe('Custom Caption')
    expect(wrapper.find('[data-rig-titlebar-title]').exists()).toBe(false)
  })

  it('sets data-draggable when draggable', () => {
    const wrapper = mount(TitleBar, { props: { draggable: true } })
    expect(wrapper.find('[data-rig-titlebar]').attributes('data-draggable')).not.toBeUndefined()
  })

  it('does not set data-draggable when not draggable', () => {
    const wrapper = mount(TitleBar, { props: { draggable: false } })
    expect(wrapper.find('[data-rig-titlebar]').attributes('data-draggable')).toBeUndefined()
  })

  it('renders three sections (leading, caption, trailing)', () => {
    const wrapper = mount(TitleBar)
    expect(wrapper.find('[data-rig-titlebar-leading]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-titlebar-caption]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-titlebar-trailing]').exists()).toBe(true)
  })
})
