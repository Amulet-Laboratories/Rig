import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useReducedMotion } from './useReducedMotion'

function createMockMatchMedia(initialMatches: boolean) {
  const listeners: ((e: MediaQueryListEvent) => void)[] = []

  const mql = {
    matches: initialMatches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: vi.fn((_event: string, fn: (e: MediaQueryListEvent) => void) => {
      listeners.push(fn)
    }) as unknown as MediaQueryList['addEventListener'],
    removeEventListener: vi.fn((_event: string, fn: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(fn)
      if (idx >= 0) listeners.splice(idx, 1)
    }) as unknown as MediaQueryList['removeEventListener'],
    dispatchEvent: vi.fn(),
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  } satisfies MediaQueryList

  function fire(matches: boolean) {
    mql.matches = matches
    for (const fn of listeners) {
      fn({ matches, media: mql.media } as MediaQueryListEvent)
    }
  }

  return { mql, fire, listeners }
}

describe('useReducedMotion', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('returns false when prefers-reduced-motion is not set', () => {
    const { mql } = createMockMatchMedia(false)
    window.matchMedia = vi.fn().mockReturnValue(mql)

    const Comp = defineComponent({
      setup() {
        const result = useReducedMotion()
        return { result }
      },
      render() {
        return h('div', String(this.result))
      },
    })

    const wrapper = mount(Comp)
    expect(wrapper.vm.result).toBe(false)
  })

  it('returns true when prefers-reduced-motion is set', () => {
    const { mql } = createMockMatchMedia(true)
    window.matchMedia = vi.fn().mockReturnValue(mql)

    const Comp = defineComponent({
      setup() {
        const result = useReducedMotion()
        return { result }
      },
      render() {
        return h('div', String(this.result))
      },
    })

    const wrapper = mount(Comp)
    expect(wrapper.vm.result).toBe(true)
  })

  it('reacts to media query changes', async () => {
    const { mql, fire } = createMockMatchMedia(false)
    window.matchMedia = vi.fn().mockReturnValue(mql)

    const Comp = defineComponent({
      setup() {
        const result = useReducedMotion()
        return { result }
      },
      render() {
        return h('div', String(this.result))
      },
    })

    const wrapper = mount(Comp)
    expect(wrapper.vm.result).toBe(false)

    fire(true)
    await nextTick()
    expect(wrapper.vm.result).toBe(true)

    fire(false)
    await nextTick()
    expect(wrapper.vm.result).toBe(false)
  })

  it('removes listener on unmount', () => {
    const { mql } = createMockMatchMedia(false)
    window.matchMedia = vi.fn().mockReturnValue(mql)

    const Comp = defineComponent({
      setup() {
        const result = useReducedMotion()
        return { result }
      },
      render() {
        return h('div', String(this.result))
      },
    })

    const wrapper = mount(Comp)
    expect(mql.addEventListener).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    expect(mql.removeEventListener).toHaveBeenCalledTimes(1)
  })

  it('queries the correct media string', () => {
    const { mql } = createMockMatchMedia(false)
    window.matchMedia = vi.fn().mockReturnValue(mql)

    const Comp = defineComponent({
      setup() {
        useReducedMotion()
        return {}
      },
      render() {
        return h('div')
      },
    })

    mount(Comp)
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })
})
