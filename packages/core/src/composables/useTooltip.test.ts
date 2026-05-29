import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, inject } from 'vue'
import { useTooltip } from './useTooltip'
import { TooltipKey } from '../injection-keys'

describe('useTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function createTooltipWrapper(opts?: { provide?: boolean }) {
    return mount(
      defineComponent({
        setup() {
          const tooltip = useTooltip(opts)
          return { tooltip }
        },
        template: '<div />',
      }),
    )
  }

  function createMockElement(rect: Partial<DOMRect> = {}): HTMLElement {
    const el = document.createElement('button')
    el.getBoundingClientRect = () =>
      ({
        left: 10,
        right: 110,
        top: 20,
        bottom: 50,
        width: 100,
        height: 30,
        x: 10,
        y: 20,
        ...rect,
      }) as DOMRect
    return el
  }

  it('starts hidden', () => {
    const wrapper = createTooltipWrapper()
    expect(wrapper.vm.tooltip.visible.value).toBe(false)
    expect(wrapper.vm.tooltip.content.value).toBe('')
  })

  it('shows after delay', () => {
    const wrapper = createTooltipWrapper()
    const el = createMockElement()

    wrapper.vm.tooltip.show(el, 'Hello')
    expect(wrapper.vm.tooltip.visible.value).toBe(false)

    vi.advanceTimersByTime(500)

    expect(wrapper.vm.tooltip.visible.value).toBe(true)
    expect(wrapper.vm.tooltip.content.value).toBe('Hello')
  })

  it('hides immediately', () => {
    const wrapper = createTooltipWrapper()
    const el = createMockElement()

    wrapper.vm.tooltip.show(el, 'Tip')
    vi.advanceTimersByTime(500)
    expect(wrapper.vm.tooltip.visible.value).toBe(true)

    wrapper.vm.tooltip.hide()
    expect(wrapper.vm.tooltip.visible.value).toBe(false)
  })

  it('cancels show if hidden before delay', () => {
    const wrapper = createTooltipWrapper()
    const el = createMockElement()

    wrapper.vm.tooltip.show(el, 'Tip')
    wrapper.vm.tooltip.hide()
    vi.advanceTimersByTime(500)

    expect(wrapper.vm.tooltip.visible.value).toBe(false)
  })

  describe('placement', () => {
    it('defaults to bottom placement', () => {
      const wrapper = createTooltipWrapper()
      const el = createMockElement()

      wrapper.vm.tooltip.show(el, 'Bottom tip')
      vi.advanceTimersByTime(500)

      expect(wrapper.vm.tooltip.placement.value).toBe('bottom')
    })

    it('accepts top placement', () => {
      const wrapper = createTooltipWrapper()
      const el = createMockElement()

      wrapper.vm.tooltip.show(el, 'Top tip', 'top')
      vi.advanceTimersByTime(500)

      expect(wrapper.vm.tooltip.placement.value).toBe('top')
    })

    it('accepts left placement', () => {
      const wrapper = createTooltipWrapper()
      const el = createMockElement()

      wrapper.vm.tooltip.show(el, 'Left tip', 'left')
      vi.advanceTimersByTime(500)

      expect(wrapper.vm.tooltip.placement.value).toBe('left')
    })

    it('accepts right placement', () => {
      const wrapper = createTooltipWrapper()
      const el = createMockElement()

      wrapper.vm.tooltip.show(el, 'Right tip', 'right')
      vi.advanceTimersByTime(500)

      expect(wrapper.vm.tooltip.placement.value).toBe('right')
    })
  })

  describe('referenceEl', () => {
    it('sets referenceEl on show', () => {
      const wrapper = createTooltipWrapper()
      const el = createMockElement()

      expect(wrapper.vm.tooltip.referenceEl.value).toBeNull()

      wrapper.vm.tooltip.show(el, 'Ref test')
      vi.advanceTimersByTime(500)

      expect(wrapper.vm.tooltip.referenceEl.value).toBe(el)
    })

    it('clears referenceEl on hide', () => {
      const wrapper = createTooltipWrapper()
      const el = createMockElement()

      wrapper.vm.tooltip.show(el, 'Ref test')
      vi.advanceTimersByTime(500)
      expect(wrapper.vm.tooltip.referenceEl.value).toBe(el)

      wrapper.vm.tooltip.hide()
      expect(wrapper.vm.tooltip.referenceEl.value).toBeNull()
    })
  })

  describe('rapid show/hide cycles', () => {
    it('re-showing cancels previous timer', () => {
      const wrapper = createTooltipWrapper()
      const el1 = createMockElement()
      const el2 = createMockElement()

      wrapper.vm.tooltip.show(el1, 'First')
      vi.advanceTimersByTime(200)
      wrapper.vm.tooltip.show(el2, 'Second')
      vi.advanceTimersByTime(500)

      expect(wrapper.vm.tooltip.visible.value).toBe(true)
      expect(wrapper.vm.tooltip.content.value).toBe('Second')
    })

    it('hide clears pending show timer', () => {
      const wrapper = createTooltipWrapper()
      const el = createMockElement()

      wrapper.vm.tooltip.show(el, 'Tip')
      vi.advanceTimersByTime(100)
      wrapper.vm.tooltip.hide()
      vi.advanceTimersByTime(600)

      expect(wrapper.vm.tooltip.visible.value).toBe(false)
    })
  })

  describe('provide/inject', () => {
    it('creates and provides state with provide: true', () => {
      let injectedState: ReturnType<typeof useTooltip> | null = null

      const parent = defineComponent({
        setup() {
          useTooltip({ provide: true })
        },
        template: '<slot />',
      })

      const child = defineComponent({
        setup() {
          injectedState = inject(TooltipKey, null)
        },
        template: '<div />',
      })

      mount(parent, {
        slots: { default: child },
      })

      expect(injectedState).not.toBeNull()
      expect(injectedState!.visible).toBeDefined()
      expect(injectedState!.show).toBeTypeOf('function')
      expect(injectedState!.hide).toBeTypeOf('function')
    })

    it('injects existing state from parent', () => {
      let childTooltip: ReturnType<typeof useTooltip> | undefined

      const parent = defineComponent({
        setup() {
          const tooltip = useTooltip({ provide: true })
          return { tooltip }
        },
        template: '<slot />',
      })

      const child = defineComponent({
        setup() {
          childTooltip = useTooltip()
          return { childTooltip }
        },
        template: '<div />',
      })

      const wrapper = mount(parent, {
        slots: { default: child },
      })

      // Show via parent, verify child sees it
      const el = createMockElement()
      wrapper.vm.tooltip.show(el, 'Shared')
      vi.advanceTimersByTime(500)

      expect(childTooltip!.visible.value).toBe(true)
      expect(childTooltip!.content.value).toBe('Shared')
    })

    it('creates standalone instance without provider', () => {
      const wrapper = createTooltipWrapper()
      expect(wrapper.vm.tooltip.visible).toBeDefined()
      expect(wrapper.vm.tooltip.show).toBeTypeOf('function')
    })
  })
})
