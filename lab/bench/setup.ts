/**
 * Bench environment setup — jsdom polyfills.
 *
 * jsdom is missing several browser APIs that competitor component libraries
 * rely on. This file patches the minimum set needed for mount benchmarks.
 */

// window.matchMedia (used by ant-design-vue, radix-vue)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  })
}

// ResizeObserver (used by radix-vue, headless-ui, ant-design-vue)
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof window.ResizeObserver
}

// IntersectionObserver (used by some component lazy-loading)
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    readonly root = null
    readonly rootMargin = '0px'
    readonly thresholds = [0]
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof window.IntersectionObserver
}

// Element.scrollIntoView (used by radix-vue)
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

// Element.getAnimations (used by radix-vue transitions)
if (typeof Element !== 'undefined' && !Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => []
}

// PointerEvent (used by radix-vue / headless-ui event handling)
if (typeof window !== 'undefined' && !window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    readonly pointerId: number = 0
    readonly width: number = 1
    readonly height: number = 1
    readonly pressure: number = 0
    readonly tiltX: number = 0
    readonly tiltY: number = 0
    readonly pointerType: string = 'mouse'
    readonly isPrimary: boolean = true
    getCoalescedEvents() { return [] }
    getPredictedEvents() { return [] }
  } as unknown as typeof window.PointerEvent
}
