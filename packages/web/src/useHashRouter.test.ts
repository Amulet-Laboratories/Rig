import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { useHashRouter, type UseHashRouterOptions } from './useHashRouter'

const pages = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

function createWrapper(options: Partial<UseHashRouterOptions> = {}) {
  const Comp = defineComponent({
    setup() {
      const result = useHashRouter({ pages, ...options })
      return result
    },
    render() {
      return h('div', this.currentPage)
    },
  })
  return mount(Comp, { attachTo: document.body })
}

describe('useHashRouter', () => {
  beforeEach(() => {
    window.location.hash = ''
    vi.spyOn(history, 'pushState').mockImplementation(() => {})
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('defaults to first page', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toBe('home')
  })

  it('accepts custom defaultPage', () => {
    const wrapper = createWrapper({ defaultPage: 'about' })
    expect(wrapper.text()).toBe('about')
  })

  it('reads page from hash on mount', async () => {
    window.location.hash = '#about'
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('about')
  })

  it('falls back to default for unknown hash', async () => {
    window.location.hash = '#unknown'
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('home')
  })

  it('navigateTo updates currentPage', async () => {
    const wrapper = createWrapper()
    wrapper.vm.navigateTo('contact')
    await nextTick()
    expect(wrapper.text()).toBe('contact')
  })

  it('navigateTo pushes state for non-default page', () => {
    const wrapper = createWrapper()
    wrapper.vm.navigateTo('about')
    expect(history.pushState).toHaveBeenCalledWith(null, '', '#about')
  })

  it('navigateTo pushes pathname for default page', () => {
    const wrapper = createWrapper()
    wrapper.vm.navigateTo('home')
    expect(history.pushState).toHaveBeenCalledWith(null, '', window.location.pathname)
  })

  it('navigateTo scrolls to top', () => {
    const wrapper = createWrapper()
    wrapper.vm.navigateTo('about')
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  })

  it('responds to popstate event', async () => {
    const wrapper = createWrapper()
    window.location.hash = '#contact'
    window.dispatchEvent(new PopStateEvent('popstate'))
    await nextTick()
    expect(wrapper.text()).toBe('contact')
  })

  it('supports prefix in hash', async () => {
    window.location.hash = '#demo/about'
    const wrapper = createWrapper({ prefix: 'demo' })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('about')
  })

  it('navigateTo uses prefix in hash', () => {
    const wrapper = createWrapper({ prefix: 'demo' })
    wrapper.vm.navigateTo('contact')
    expect(history.pushState).toHaveBeenCalledWith(null, '', '#demo/contact')
  })

  it('cleans up popstate listener on unmount', () => {
    const spy = vi.spyOn(window, 'removeEventListener')
    const wrapper = createWrapper()
    wrapper.unmount()
    expect(spy).toHaveBeenCalledWith('popstate', expect.any(Function))
  })
})
