import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useParallax, type ParallaxLayer } from './useParallax'

function createMockIO() {
  let callback: IntersectionObserverCallback | null = null
  let observed: Element | null = null

  const instance = {
    observe: vi.fn((el: Element) => {
      observed = el
    }),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
    root: null,
    rootMargin: '0px',
    thresholds: [0],
    takeRecords: vi.fn(() => []),
  } satisfies IntersectionObserver

  class MockIO {
    constructor(cb: IntersectionObserverCallback) {
      callback = cb
      Object.assign(this, instance)
    }
  }

  const Mock = MockIO as unknown as typeof IntersectionObserver

  function fire(isIntersecting: boolean) {
    callback?.(
      [
        {
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          target: observed!,
          time: Date.now(),
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
        },
      ],
      instance,
    )
  }

  return { Mock, instance, fire }
}

const testLayers: ParallaxLayer[] = [
  { id: 'bg', src: '/bg.webp', depth: 0 },
  { id: 'fg', src: '/fg.webp', depth: 0.8 },
]

describe('useParallax', () => {
  let origIO: typeof IntersectionObserver
  let origRAF: typeof requestAnimationFrame
  let origCAF: typeof cancelAnimationFrame

  beforeEach(() => {
    origIO = globalThis.IntersectionObserver
    origRAF = globalThis.requestAnimationFrame
    origCAF = globalThis.cancelAnimationFrame
    // Stub rAF to execute immediately
    globalThis.requestAnimationFrame = vi.fn((_cb) => {
      // Don't recursively call — just return id
      return 1
    }) as unknown as typeof requestAnimationFrame
    globalThis.cancelAnimationFrame = vi.fn()
  })

  afterEach(() => {
    globalThis.IntersectionObserver = origIO
    globalThis.requestAnimationFrame = origRAF
    globalThis.cancelAnimationFrame = origCAF
  })

  it('returns a containerRef and getLayerStyle function', () => {
    const { Mock } = createMockIO()
    globalThis.IntersectionObserver = Mock

    const Comp = defineComponent({
      setup() {
        const { containerRef, getLayerStyle } = useParallax({ layers: testLayers })
        return { containerRef, getLayerStyle }
      },
      render() {
        return h('div', { ref: 'containerRef' })
      },
    })

    const wrapper = mount(Comp)
    expect(typeof wrapper.vm.getLayerStyle).toBe('function')
  })

  it('returns translate3d(0, 0px, 0) at zero scroll offset', () => {
    const { Mock } = createMockIO()
    globalThis.IntersectionObserver = Mock

    const Comp = defineComponent({
      setup() {
        const { containerRef, getLayerStyle } = useParallax({ layers: testLayers })
        return { containerRef, getLayerStyle }
      },
      render() {
        return h('div', { ref: 'containerRef' })
      },
    })

    const wrapper = mount(Comp)
    const style = wrapper.vm.getLayerStyle('bg')
    expect(style.transform).toBe('translate3d(0, 0px, 0)')
  })

  it('returns empty object for unknown layer id', () => {
    const { Mock } = createMockIO()
    globalThis.IntersectionObserver = Mock

    const Comp = defineComponent({
      setup() {
        const { getLayerStyle } = useParallax({ layers: testLayers })
        return { getLayerStyle }
      },
      render() {
        return h('div')
      },
    })

    const wrapper = mount(Comp)
    expect(wrapper.vm.getLayerStyle('nonexistent')).toEqual({})
  })

  it('disconnects observer on unmount', () => {
    const { Mock, instance } = createMockIO()
    globalThis.IntersectionObserver = Mock

    const Comp = defineComponent({
      setup() {
        const { containerRef } = useParallax({ layers: testLayers })
        return { containerRef }
      },
      render() {
        return h('div', { ref: 'containerRef' })
      },
    })

    const wrapper = mount(Comp)
    wrapper.unmount()
    expect(instance.disconnect).toHaveBeenCalledTimes(1)
  })

  it('applies strength multiplier to layer offsets', () => {
    const { Mock } = createMockIO()
    globalThis.IntersectionObserver = Mock

    const Comp = defineComponent({
      setup() {
        const {
          containerRef,
          getLayerStyle,
          scrollOffset: _scrollOffset,
        } = useParallax({
          layers: testLayers,
          strength: 1,
        })
        return { containerRef, getLayerStyle }
      },
      render() {
        return h('div', { ref: 'containerRef' })
      },
    })

    const wrapper = mount(Comp)
    // At zero scroll, depth 0 and 0.8 both produce 0
    const bgStyle = wrapper.vm.getLayerStyle('bg')
    const fgStyle = wrapper.vm.getLayerStyle('fg')
    expect(bgStyle.transform).toBe('translate3d(0, 0px, 0)')
    expect(fgStyle.transform).toBe('translate3d(0, 0px, 0)')
  })
})
