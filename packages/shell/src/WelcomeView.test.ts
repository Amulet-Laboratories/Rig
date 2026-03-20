import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WelcomeView from './WelcomeView.vue'

describe('WelcomeView', () => {
  it('renders with data-rig-welcome-view', () => {
    const wrapper = mount(WelcomeView)
    expect(wrapper.find('[data-rig-welcome-view]').exists()).toBe(true)
  })

  it('renders title', () => {
    const wrapper = mount(WelcomeView, { props: { title: 'Dashboard' } })
    expect(wrapper.find('[data-rig-welcome-view-title]').text()).toBe('Dashboard')
  })

  it('renders description', () => {
    const wrapper = mount(WelcomeView, {
      props: { title: 'Hello', description: 'Welcome back' },
    })
    expect(wrapper.find('[data-rig-welcome-view-description]').text()).toBe('Welcome back')
  })

  it('hides description when not provided', () => {
    const wrapper = mount(WelcomeView, { props: { title: 'Hello' } })
    expect(wrapper.find('[data-rig-welcome-view-description]').exists()).toBe(false)
  })

  it('shows empty state when empty is true', () => {
    const wrapper = mount(WelcomeView, { props: { empty: true } })
    expect(wrapper.find('[data-rig-empty-state]').exists()).toBe(true)
  })

  it('passes emptyTitle and emptyDescription to empty state', () => {
    const wrapper = mount(WelcomeView, {
      props: { empty: true, emptyTitle: 'No data', emptyDescription: 'Get started' },
    })
    expect(wrapper.text()).toContain('No data')
    expect(wrapper.text()).toContain('Get started')
  })

  it('renders stats when provided', () => {
    const stats = [
      { label: 'Users', value: 42 },
      { label: 'Posts', value: 100 },
    ]
    const wrapper = mount(WelcomeView, { props: { stats } })
    expect(wrapper.find('[data-rig-welcome-view-stats]').exists()).toBe(true)
  })

  it('hides stats section when no stats and no stats slot', () => {
    const wrapper = mount(WelcomeView)
    expect(wrapper.find('[data-rig-welcome-view-stats]').exists()).toBe(false)
  })

  it('renders default slot', () => {
    const wrapper = mount(WelcomeView, {
      slots: { default: '<div class="content">Section</div>' },
    })
    expect(wrapper.find('.content').text()).toBe('Section')
  })

  it('renders header slot', () => {
    const wrapper = mount(WelcomeView, {
      slots: { header: '<h1>Custom</h1>' },
    })
    expect(wrapper.find('[data-rig-welcome-view-header] h1').text()).toBe('Custom')
  })

  it('renders recent slot', () => {
    const wrapper = mount(WelcomeView, {
      slots: { recent: '<ul><li>Item</li></ul>' },
    })
    expect(wrapper.find('ul li').text()).toBe('Item')
  })

  it('does not render sections when empty is true', () => {
    const wrapper = mount(WelcomeView, {
      props: { empty: true },
      slots: { default: '<div class="hidden">should not show</div>' },
    })
    expect(wrapper.find('.hidden').exists()).toBe(false)
  })
})
