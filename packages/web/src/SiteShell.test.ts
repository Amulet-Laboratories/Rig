import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteShell from './SiteShell.vue'

describe('SiteShell', () => {
  it('renders with data-rig-site-shell', () => {
    const wrapper = mount(SiteShell)
    expect(wrapper.find('[data-rig-site-shell]').exists()).toBe(true)
  })

  it('renders skip link with default target', () => {
    const wrapper = mount(SiteShell)
    const skipLink = wrapper.find('[data-rig-skip-link]')
    expect(skipLink.exists()).toBe(true)
    expect(skipLink.attributes('href')).toBe('#main-content')
    expect(skipLink.text()).toBe('Skip to main content')
  })

  it('renders skip link with custom mainId', () => {
    const wrapper = mount(SiteShell, { props: { mainId: 'content' } })
    const skipLink = wrapper.find('[data-rig-skip-link]')
    expect(skipLink.attributes('href')).toBe('#content')
  })

  it('renders main with default id', () => {
    const wrapper = mount(SiteShell)
    const main = wrapper.find('main')
    expect(main.attributes('id')).toBe('main-content')
    expect(main.attributes('data-rig-site-shell-main')).toBeDefined()
  })

  it('renders main with custom id', () => {
    const wrapper = mount(SiteShell, { props: { mainId: 'content' } })
    expect(wrapper.find('main').attributes('id')).toBe('content')
  })

  it('renders header slot', () => {
    const wrapper = mount(SiteShell, {
      slots: { header: '<nav>Nav</nav>' },
    })
    expect(wrapper.find('[data-rig-site-shell-header]').text()).toBe('Nav')
  })

  it('renders default slot in main', () => {
    const wrapper = mount(SiteShell, {
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('main').text()).toBe('Content')
  })

  it('renders footer slot', () => {
    const wrapper = mount(SiteShell, {
      slots: { footer: '<footer>Footer</footer>' },
    })
    expect(wrapper.find('footer').text()).toBe('Footer')
  })

  it('renders skip-link slot override', () => {
    const wrapper = mount(SiteShell, {
      slots: { 'skip-link': 'Jump to content' },
    })
    expect(wrapper.find('[data-rig-skip-link]').text()).toBe('Jump to content')
  })
})
