import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteNav from './SiteNav.vue'

const pages = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'contact', label: 'Contact' },
]

describe('SiteNav', () => {
  it('renders with data-rig-site-nav', () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    expect(wrapper.find('[data-rig-site-nav]').exists()).toBe(true)
  })

  it('renders nav element', () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    expect(wrapper.element.tagName).toBe('NAV')
  })

  it('sets default aria-label', () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Main navigation')
  })

  it('accepts custom aria-label', () => {
    const wrapper = mount(SiteNav, { props: { pages, ariaLabel: 'Site nav' } })
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Site nav')
  })

  it('renders links for pages with href', () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    const links = wrapper.findAll('[data-rig-site-nav-link]')
    expect(links).toHaveLength(3)
    expect(links[0]!.element.tagName).toBe('A')
    expect(links[0]!.attributes('href')).toBe('/')
  })

  it('renders buttons for pages without href', () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    const links = wrapper.findAll('[data-rig-site-nav-link]')
    expect(links[2]!.element.tagName).toBe('BUTTON')
  })

  it('marks active page', () => {
    const wrapper = mount(SiteNav, { props: { pages, currentPage: 'about' } })
    const links = wrapper.findAll('[data-rig-site-nav-link]')
    expect(links[1]!.attributes('data-active')).toBeDefined()
    expect(links[0]!.attributes('data-active')).toBeUndefined()
  })

  it('emits navigate on link click', async () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    const links = wrapper.findAll('[data-rig-site-nav-link]')
    await links[0]!.trigger('click')
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['home'])
  })

  it('renders sticky attribute when sticky', () => {
    const wrapper = mount(SiteNav, { props: { pages, sticky: true } })
    expect(wrapper.find('nav').attributes('data-sticky')).toBeDefined()
  })

  it('hides sticky attribute when not sticky', () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    expect(wrapper.find('nav').attributes('data-sticky')).toBeUndefined()
  })

  it('toggles mobile nav on hamburger click', async () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    expect(wrapper.find('[data-rig-site-nav-mobile]').exists()).toBe(false)
    await wrapper.find('[data-rig-site-nav-toggle]').trigger('click')
    expect(wrapper.find('[data-rig-site-nav-mobile]').exists()).toBe(true)
  })

  it('closes mobile nav on navigate', async () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    await wrapper.find('[data-rig-site-nav-toggle]').trigger('click')
    expect(wrapper.find('[data-rig-site-nav-mobile]').exists()).toBe(true)
    const mobileLinks = wrapper.findAll('[data-rig-site-nav-mobile-link]')
    await mobileLinks[0]!.trigger('click')
    expect(wrapper.find('[data-rig-site-nav-mobile]').exists()).toBe(false)
  })

  it('sets aria-expanded on toggle button', async () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    const toggle = wrapper.find('[data-rig-site-nav-toggle]')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
  })

  it('renders brand slot', () => {
    const wrapper = mount(SiteNav, {
      props: { pages },
      slots: { brand: '<span>Logo</span>' },
    })
    expect(wrapper.find('[data-rig-site-nav-brand]').text()).toBe('Logo')
  })

  it('renders trailing slot', () => {
    const wrapper = mount(SiteNav, {
      props: { pages },
      slots: { trailing: '<button>Cart</button>' },
    })
    expect(wrapper.find('[data-rig-site-nav-actions]').text()).toContain('Cart')
  })

  it('renders utility-bar slot when provided', () => {
    const wrapper = mount(SiteNav, {
      props: { pages },
      slots: { 'utility-bar': '<div>Call us</div>' },
    })
    expect(wrapper.find('[data-rig-site-nav-utility]').exists()).toBe(true)
  })

  it('hides utility-bar when not provided', () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    expect(wrapper.find('[data-rig-site-nav-utility]').exists()).toBe(false)
  })

  it('renders mobile links with correct elements', async () => {
    const wrapper = mount(SiteNav, { props: { pages } })
    await wrapper.find('[data-rig-site-nav-toggle]').trigger('click')
    const mobileLinks = wrapper.findAll('[data-rig-site-nav-mobile-link]')
    expect(mobileLinks[0]!.element.tagName).toBe('A')
    expect(mobileLinks[2]!.element.tagName).toBe('BUTTON')
  })

  it('marks active mobile link', async () => {
    const wrapper = mount(SiteNav, { props: { pages, currentPage: 'home' } })
    await wrapper.find('[data-rig-site-nav-toggle]').trigger('click')
    const mobileLinks = wrapper.findAll('[data-rig-site-nav-mobile-link]')
    expect(mobileLinks[0]!.attributes('data-active')).toBeDefined()
    expect(mobileLinks[1]!.attributes('data-active')).toBeUndefined()
  })
})
