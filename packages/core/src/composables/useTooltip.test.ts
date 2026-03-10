import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useTooltip } from './useTooltip'

describe('useTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts hidden', () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const tooltip = useTooltip()
          return { tooltip }
        },
        template: '<div />',
      }),
    )

    expect(wrapper.vm.tooltip.visible.value).toBe(false)
    expect(wrapper.vm.tooltip.content.value).toBe('')
  })

  it('shows after delay', () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const tooltip = useTooltip()
          return { tooltip }
        },
        template: '<div />',
      }),
    )

    const el = document.createElement('button')
    el.getBoundingClientRect = () =>
      ({ left: 10, right: 110, top: 20, bottom: 50, width: 100, height: 30 }) as DOMRect

    wrapper.vm.tooltip.show(el, 'Hello')

    // Not visible yet
    expect(wrapper.vm.tooltip.visible.value).toBe(false)

    vi.advanceTimersByTime(500)

    expect(wrapper.vm.tooltip.visible.value).toBe(true)
    expect(wrapper.vm.tooltip.content.value).toBe('Hello')
  })

  it('hides immediately', () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const tooltip = useTooltip()
          return { tooltip }
        },
        template: '<div />',
      }),
    )

    const el = document.createElement('button')
    el.getBoundingClientRect = () =>
      ({ left: 0, right: 100, top: 0, bottom: 30, width: 100, height: 30 }) as DOMRect

    wrapper.vm.tooltip.show(el, 'Tip')
    vi.advanceTimersByTime(500)
    expect(wrapper.vm.tooltip.visible.value).toBe(true)

    wrapper.vm.tooltip.hide()
    expect(wrapper.vm.tooltip.visible.value).toBe(false)
  })

  it('cancels show if hidden before delay', () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const tooltip = useTooltip()
          return { tooltip }
        },
        template: '<div />',
      }),
    )

    const el = document.createElement('button')
    el.getBoundingClientRect = () =>
      ({ left: 0, right: 100, top: 0, bottom: 30, width: 100, height: 30 }) as DOMRect

    wrapper.vm.tooltip.show(el, 'Tip')
    wrapper.vm.tooltip.hide()
    vi.advanceTimersByTime(500)

    expect(wrapper.vm.tooltip.visible.value).toBe(false)
  })
})
