import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InfiniteScroll from './InfiniteScroll.vue'

// Mock IntersectionObserver as a class so `new` works
let observerCallback: IntersectionObserverCallback
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

class MockIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb
  }
  observe = mockObserve
  disconnect = mockDisconnect
  unobserve = vi.fn()
}

;(globalThis as any).IntersectionObserver = MockIntersectionObserver

beforeEach(() => {
  mockObserve.mockClear()
  mockDisconnect.mockClear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('InfiniteScroll', () => {
  it('renders with data-rig-infinite-scroll', () => {
    const wrapper = mount(InfiniteScroll)
    expect(wrapper.find('[data-rig-infinite-scroll]').exists()).toBe(true)
  })

  it('renders default slot', () => {
    const wrapper = mount(InfiniteScroll, {
      slots: { default: '<p>Items</p>' },
    })
    expect(wrapper.text()).toContain('Items')
  })

  it('renders sentinel element', () => {
    const wrapper = mount(InfiniteScroll)
    expect(wrapper.find('[data-rig-infinite-scroll-sentinel]').exists()).toBe(true)
  })

  it('creates IntersectionObserver on mount', () => {
    mount(InfiniteScroll)
    expect(mockObserve).toHaveBeenCalled()
  })

  it('emits load-more when sentinel intersects', () => {
    const wrapper = mount(InfiniteScroll)
    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(wrapper.emitted('load-more')).toHaveLength(1)
  })

  it('does not emit load-more when not intersecting', () => {
    const wrapper = mount(InfiniteScroll)
    observerCallback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(wrapper.emitted('load-more')).toBeUndefined()
  })

  it('does not emit load-more when loading', () => {
    const wrapper = mount(InfiniteScroll, { props: { loading: true } })
    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(wrapper.emitted('load-more')).toBeUndefined()
  })

  it('does not emit load-more when disabled', () => {
    const wrapper = mount(InfiniteScroll, { props: { disabled: true } })
    // Observer should not be created when disabled
    expect(wrapper.emitted('load-more')).toBeUndefined()
  })

  it('shows loading indicator when loading', () => {
    const wrapper = mount(InfiniteScroll, { props: { loading: true } })
    expect(wrapper.find('[data-rig-infinite-scroll-loading]').exists()).toBe(true)
  })

  it('hides loading indicator when not loading', () => {
    const wrapper = mount(InfiniteScroll, { props: { loading: false } })
    expect(wrapper.find('[data-rig-infinite-scroll-loading]').exists()).toBe(false)
  })

  it('sets data-loading when loading', () => {
    const wrapper = mount(InfiniteScroll, { props: { loading: true } })
    expect(wrapper.find('[data-rig-infinite-scroll]').attributes('data-loading')).toBeDefined()
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(InfiniteScroll, { props: { disabled: true } })
    expect(wrapper.find('[data-rig-infinite-scroll]').attributes('data-disabled')).toBeDefined()
  })

  it('loading element has status role', () => {
    const wrapper = mount(InfiniteScroll, { props: { loading: true } })
    expect(wrapper.find('[data-rig-infinite-scroll-loading]').attributes('role')).toBe('status')
  })

  it('renders custom loading slot', () => {
    const wrapper = mount(InfiniteScroll, {
      props: { loading: true },
      slots: { loading: '<span>Custom loader</span>' },
    })
    expect(wrapper.text()).toContain('Custom loader')
  })

  it('disconnects observer on unmount', () => {
    const wrapper = mount(InfiniteScroll)
    wrapper.unmount()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('uses custom loading label', () => {
    const wrapper = mount(InfiniteScroll, {
      props: { loading: true, loadingLabel: 'Fetching more' },
    })
    expect(wrapper.find('[data-rig-infinite-scroll-loading]').attributes('aria-label')).toBe(
      'Fetching more',
    )
  })
})
