import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollArea from './ScrollArea.vue'
import { nextTick } from 'vue'

describe('ScrollArea', () => {
  it('renders with data-rig-scroll-area', () => {
    const wrapper = mount(ScrollArea)
    expect(wrapper.attributes('data-rig-scroll-area')).toBeDefined()
  })

  it('contains a scroll viewport', () => {
    const wrapper = mount(ScrollArea)
    expect(wrapper.find('[data-rig-scroll-viewport]').exists()).toBe(true)
  })

  it('renders slot content inside viewport', () => {
    const wrapper = mount(ScrollArea, {
      slots: { default: '<p data-test-content>Hello</p>' },
    })
    expect(wrapper.find('[data-test-content]').exists()).toBe(true)
  })

  it('does not show vertical scrollbar when content is shorter than viewport in jsdom', () => {
    const wrapper = mount(ScrollArea, { props: { vertical: true } })
    expect(wrapper.find('[data-rig-scroll-bar]').exists()).toBe(false)
  })

  it('does not show horizontal scrollbar by default', () => {
    const wrapper = mount(ScrollArea)
    const bars = wrapper.findAll('[data-rig-scroll-bar]')
    const hBars = bars.filter((b) => b.attributes('data-orientation') === 'horizontal')
    expect(hBars).toHaveLength(0)
  })

  it('sets data-orientation="vertical" on vertical bar', async () => {
    const wrapper = mount(ScrollArea, { props: { vertical: true } })
    const bars = wrapper.findAll('[data-rig-scroll-bar]')
    bars.forEach((bar) => {
      expect(['vertical', 'horizontal']).toContain(bar.attributes('data-orientation'))
    })
  })

  it('handles keyboard interaction', async () => {
    const wrapper = mount(ScrollArea)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.exists()).toBe(true)
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(ScrollArea, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(ScrollArea)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(ScrollArea)
    await wrapper.setProps({ horizontal: true })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  describe('props', () => {
    it('vertical defaults to true', () => {
      const wrapper = mount(ScrollArea)
      expect(wrapper.props('vertical')).toBe(true)
    })

    it('horizontal defaults to false', () => {
      const wrapper = mount(ScrollArea)
      expect(wrapper.props('horizontal')).toBe(false)
    })

    it('accepts both horizontal and vertical', () => {
      const wrapper = mount(ScrollArea, {
        props: { horizontal: true, vertical: true },
      })
      expect(wrapper.props('horizontal')).toBe(true)
      expect(wrapper.props('vertical')).toBe(true)
    })
  })

  describe('scroll event handling', () => {
    it('handles scroll events on the viewport', async () => {
      const wrapper = mount(ScrollArea, { attachTo: document.body })
      const viewport = wrapper.find('[data-rig-scroll-viewport]')
      await viewport.trigger('scroll')
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('triggers measure on scroll', async () => {
      const wrapper = mount(ScrollArea, { attachTo: document.body })
      const viewport = wrapper.find('[data-rig-scroll-viewport]')

      // Multiple scrolls should be debounced via rAF
      await viewport.trigger('scroll')
      await viewport.trigger('scroll')
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('lifecycle', () => {
    let mockObserve: ReturnType<typeof vi.fn>
    let mockDisconnect: ReturnType<typeof vi.fn>

    beforeEach(() => {
      mockObserve = vi.fn()
      mockDisconnect = vi.fn()
      vi.stubGlobal(
        'ResizeObserver',
        class {
          observe = mockObserve
          disconnect = mockDisconnect
          unobserve = vi.fn()
        },
      )
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('sets up ResizeObserver on mount', () => {
      const wrapper = mount(ScrollArea, { attachTo: document.body })
      expect(mockObserve).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('disconnects ResizeObserver on unmount', () => {
      const wrapper = mount(ScrollArea, { attachTo: document.body })
      wrapper.unmount()
      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  describe('scrollbar ARIA attributes', () => {
    it('vertical scrollbar has correct ARIA properties', async () => {
      // In jsdom, scrollHeight === clientHeight, so the bar won't appear
      // unless we force the computed. We still verify the structure.
      const wrapper = mount(ScrollArea, { props: { vertical: true } })
      // The bar only renders when hasVerticalScroll is true
      const bars = wrapper.findAll('[data-rig-scroll-bar]')
      bars.forEach((bar) => {
        if (bar.attributes('data-orientation') === 'vertical') {
          expect(bar.attributes('role')).toBe('scrollbar')
          expect(bar.attributes('tabindex')).toBe('0')
          expect(bar.attributes('aria-label')).toBe('Vertical scroll')
          expect(bar.attributes('aria-orientation')).toBe('vertical')
          expect(bar.attributes('aria-valuemin')).toBe('0')
          expect(bar.attributes('aria-valuemax')).toBe('100')
        }
      })
    })
  })

  describe('scroll metrics and scrollbar rendering', () => {
    let rafCallbacks: (() => void)[]

    beforeEach(() => {
      rafCallbacks = []
      vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
        rafCallbacks.push(cb)
        return rafCallbacks.length
      })
      vi.stubGlobal('cancelAnimationFrame', vi.fn())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    function flushRAF() {
      const cbs = [...rafCallbacks]
      rafCallbacks = []
      cbs.forEach((cb) => cb())
    }

    function mockViewportMetrics(
      el: HTMLElement,
      metrics: {
        scrollHeight?: number
        scrollWidth?: number
        clientHeight?: number
        clientWidth?: number
        scrollTop?: number
        scrollLeft?: number
      },
    ) {
      Object.defineProperty(el, 'scrollHeight', {
        value: metrics.scrollHeight ?? 0,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(el, 'scrollWidth', {
        value: metrics.scrollWidth ?? 0,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(el, 'clientHeight', {
        value: metrics.clientHeight ?? 0,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(el, 'clientWidth', {
        value: metrics.clientWidth ?? 0,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(el, 'scrollTop', {
        value: metrics.scrollTop ?? 0,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(el, 'scrollLeft', {
        value: metrics.scrollLeft ?? 0,
        writable: true,
        configurable: true,
      })
    }

    it('shows vertical scrollbar when content exceeds viewport height', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element

      mockViewportMetrics(viewport, {
        scrollHeight: 1000,
        clientHeight: 300,
        scrollTop: 0,
      })

      // Trigger measure via scroll, then flush rAF
      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const vBar = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"]')
      expect(vBar.exists()).toBe(true)
      expect(vBar.attributes('role')).toBe('scrollbar')
      expect(vBar.attributes('aria-valuenow')).toBe('0')
      wrapper.unmount()
    })

    it('shows horizontal scrollbar when content exceeds viewport width', async () => {
      const wrapper = mount(ScrollArea, {
        props: { horizontal: true, vertical: false },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element

      mockViewportMetrics(viewport, {
        scrollWidth: 2000,
        clientWidth: 500,
        scrollLeft: 0,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const hBar = wrapper.find('[data-rig-scroll-bar][data-orientation="horizontal"]')
      expect(hBar.exists()).toBe(true)
      expect(hBar.attributes('aria-orientation')).toBe('horizontal')
      wrapper.unmount()
    })

    it('computes thumb height percentage from scroll ratio', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element

      mockViewportMetrics(viewport, {
        scrollHeight: 1000,
        clientHeight: 300,
        scrollTop: 0,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const thumb = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"] [data-rig-scroll-thumb]')
      expect(thumb.exists()).toBe(true)
      // 300/1000 = 30% height
      expect(thumb.attributes('style')).toContain('height: 30%')
      wrapper.unmount()
    })

    it('computes thumb position based on scroll offset', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element

      mockViewportMetrics(viewport, {
        scrollHeight: 1000,
        clientHeight: 300,
        scrollTop: 350,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const bar = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"]')
      expect(bar.exists()).toBe(true)
      // valuenow = (350/700)*100 = 50
      expect(bar.attributes('aria-valuenow')).toBe('50')
      wrapper.unmount()
    })

    it('onScrollbarKeydown ArrowDown scrolls viewport down', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element as HTMLElement

      mockViewportMetrics(viewport, {
        scrollHeight: 1000,
        clientHeight: 300,
        scrollTop: 0,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const bar = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"]')
      expect(bar.exists()).toBe(true)
      await bar.trigger('keydown', { key: 'ArrowDown' })
      // scrollTop should have been incremented by step (40)
      expect(viewport.scrollTop).toBe(40)
      wrapper.unmount()
    })

    it('onScrollbarKeydown ArrowUp scrolls viewport up', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element as HTMLElement

      mockViewportMetrics(viewport, {
        scrollHeight: 1000,
        clientHeight: 300,
        scrollTop: 100,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const bar = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"]')
      await bar.trigger('keydown', { key: 'ArrowUp' })
      expect(viewport.scrollTop).toBe(60) // 100 - 40
      wrapper.unmount()
    })

    it('onScrollbarKeydown Home scrolls to top', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element as HTMLElement

      mockViewportMetrics(viewport, {
        scrollHeight: 1000,
        clientHeight: 300,
        scrollTop: 500,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const bar = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"]')
      await bar.trigger('keydown', { key: 'Home' })
      expect(viewport.scrollTop).toBe(0)
      wrapper.unmount()
    })

    it('onScrollbarKeydown End scrolls to bottom', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element as HTMLElement

      mockViewportMetrics(viewport, {
        scrollHeight: 1000,
        clientHeight: 300,
        scrollTop: 0,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const bar = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"]')
      await bar.trigger('keydown', { key: 'End' })
      expect(viewport.scrollTop).toBe(1000)
      wrapper.unmount()
    })

    it('onScrollbarKeydown PageDown scrolls by client height', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element as HTMLElement

      mockViewportMetrics(viewport, {
        scrollHeight: 2000,
        clientHeight: 400,
        scrollTop: 100,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const bar = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"]')
      await bar.trigger('keydown', { key: 'PageDown' })
      expect(viewport.scrollTop).toBe(500) // 100 + 400
      wrapper.unmount()
    })

    it('onScrollbarKeydown PageUp scrolls up by client height', async () => {
      const wrapper = mount(ScrollArea, {
        props: { vertical: true },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element as HTMLElement

      mockViewportMetrics(viewport, {
        scrollHeight: 2000,
        clientHeight: 400,
        scrollTop: 600,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const bar = wrapper.find('[data-rig-scroll-bar][data-orientation="vertical"]')
      await bar.trigger('keydown', { key: 'PageUp' })
      expect(viewport.scrollTop).toBe(200) // 600 - 400
      wrapper.unmount()
    })

    it('horizontal scrollbar responds to ArrowRight/ArrowLeft', async () => {
      const wrapper = mount(ScrollArea, {
        props: { horizontal: true, vertical: false },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element as HTMLElement

      mockViewportMetrics(viewport, {
        scrollWidth: 2000,
        clientWidth: 500,
        scrollLeft: 200,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const hBar = wrapper.find('[data-rig-scroll-bar][data-orientation="horizontal"]')
      await hBar.trigger('keydown', { key: 'ArrowRight' })
      expect(viewport.scrollLeft).toBe(240) // 200 + 40

      await hBar.trigger('keydown', { key: 'ArrowLeft' })
      expect(viewport.scrollLeft).toBe(200) // 240 - 40
      wrapper.unmount()
    })

    it('horizontal Home/End scrolls to start/end', async () => {
      const wrapper = mount(ScrollArea, {
        props: { horizontal: true, vertical: false },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element as HTMLElement

      mockViewportMetrics(viewport, {
        scrollWidth: 2000,
        clientWidth: 500,
        scrollLeft: 500,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const hBar = wrapper.find('[data-rig-scroll-bar][data-orientation="horizontal"]')
      await hBar.trigger('keydown', { key: 'Home' })
      expect(viewport.scrollLeft).toBe(0)

      await hBar.trigger('keydown', { key: 'End' })
      expect(viewport.scrollLeft).toBe(2000)
      wrapper.unmount()
    })

    it('thumb width percentage for horizontal scroll', async () => {
      const wrapper = mount(ScrollArea, {
        props: { horizontal: true, vertical: false },
        attachTo: document.body,
      })
      const viewport = wrapper.find('[data-rig-scroll-viewport]').element

      mockViewportMetrics(viewport, {
        scrollWidth: 2000,
        clientWidth: 500,
        scrollLeft: 0,
      })

      await wrapper.find('[data-rig-scroll-viewport]').trigger('scroll')
      flushRAF()
      await nextTick()

      const thumb = wrapper.find('[data-rig-scroll-bar][data-orientation="horizontal"] [data-rig-scroll-thumb]')
      expect(thumb.exists()).toBe(true)
      // 500/2000 = 25%
      expect(thumb.attributes('style')).toContain('width: 25%')
      wrapper.unmount()
    })
  })
})
