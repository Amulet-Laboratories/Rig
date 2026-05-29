import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useScrollVisibility } from './useScrollVisibility'

function createMockObserver() {
  let callback: IntersectionObserverCallback | null = null
  let observed: Element | null = null
  let constructorArgs: unknown[] = []

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

  class MockConstructor {
    constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      callback = cb
      constructorArgs = [cb, options]
      Object.assign(this, instance)
    }
  }

  const SpiedConstructor = MockConstructor as unknown as typeof IntersectionObserver

  function fire(isIntersecting: boolean, intersectionRatio: number) {
    callback?.(
      [
        {
          isIntersecting,
          intersectionRatio,
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

  return {
    MockConstructor: SpiedConstructor,
    instance,
    fire,
    getConstructorArgs: () => constructorArgs,
  }
}

describe('useScrollVisibility', () => {
  let originalIO: typeof IntersectionObserver

  beforeEach(() => {
    originalIO = globalThis.IntersectionObserver
  })

  afterEach(() => {
    globalThis.IntersectionObserver = originalIO
  })

  it('defaults to not visible', () => {
    const { MockConstructor } = createMockObserver()
    globalThis.IntersectionObserver = MockConstructor

    const Comp = defineComponent({
      setup() {
        const { isVisible, ratio, elementRef } = useScrollVisibility()
        return { isVisible, ratio, elementRef }
      },
      render() {
        return h('div', { ref: 'elementRef' }, String(this.isVisible))
      },
    })

    const wrapper = mount(Comp)
    expect(wrapper.vm.isVisible).toBe(false)
    expect(wrapper.vm.ratio).toBe(0)
  })

  it('becomes visible when observer fires intersecting entry', async () => {
    const { MockConstructor, fire } = createMockObserver()
    globalThis.IntersectionObserver = MockConstructor

    const Comp = defineComponent({
      setup() {
        const { isVisible, ratio, elementRef } = useScrollVisibility()
        return { isVisible, ratio, elementRef }
      },
      render() {
        return h('div', { ref: 'elementRef' }, String(this.isVisible))
      },
    })

    const wrapper = mount(Comp)

    fire(true, 1)
    await nextTick()
    expect(wrapper.vm.isVisible).toBe(true)
    expect(wrapper.vm.ratio).toBe(1)
  })

  it('respects threshold option', async () => {
    const { MockConstructor, fire } = createMockObserver()
    globalThis.IntersectionObserver = MockConstructor

    const Comp = defineComponent({
      setup() {
        const { isVisible, ratio, elementRef } = useScrollVisibility({
          threshold: 0.65,
        })
        return { isVisible, ratio, elementRef }
      },
      render() {
        return h('div', { ref: 'elementRef' }, String(this.isVisible))
      },
    })

    const wrapper = mount(Comp)

    // Below threshold
    fire(true, 0.3)
    await nextTick()
    expect(wrapper.vm.isVisible).toBe(false)
    expect(wrapper.vm.ratio).toBe(0.3)

    // Above threshold
    fire(true, 0.8)
    await nextTick()
    expect(wrapper.vm.isVisible).toBe(true)
    expect(wrapper.vm.ratio).toBe(0.8)
  })

  it('disconnects observer on unmount', () => {
    const { MockConstructor, instance } = createMockObserver()
    globalThis.IntersectionObserver = MockConstructor

    const Comp = defineComponent({
      setup() {
        const { elementRef } = useScrollVisibility()
        return { elementRef }
      },
      render() {
        return h('div', { ref: 'elementRef' })
      },
    })

    const wrapper = mount(Comp)
    expect(instance.observe).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    expect(instance.disconnect).toHaveBeenCalledTimes(1)
  })

  it('passes rootMargin to observer', () => {
    const { MockConstructor, getConstructorArgs } = createMockObserver()
    globalThis.IntersectionObserver = MockConstructor

    const Comp = defineComponent({
      setup() {
        const { elementRef } = useScrollVisibility({ rootMargin: '100px' })
        return { elementRef }
      },
      render() {
        return h('div', { ref: 'elementRef' })
      },
    })

    mount(Comp)
    const args = getConstructorArgs()
    expect(args[1]).toEqual({
      threshold: 0,
      rootMargin: '100px',
    })
  })
})
