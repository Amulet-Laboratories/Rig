import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TimelineScrubber from './TimelineScrubber.vue'

// Polyfill PointerEvent for jsdom
if (typeof globalThis.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    readonly pointerId: number
    constructor(type: string, init?: PointerEventInit) {
      super(type, init)
      this.pointerId = init?.pointerId ?? 0
    }
  }
  globalThis.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent
}

describe('TimelineScrubber', () => {
  it('renders with data-rig-timeline-scrubber', () => {
    const wrapper = mount(TimelineScrubber)
    expect(wrapper.find('[data-rig-timeline-scrubber]').exists()).toBe(true)
  })

  it('renders track and thumb', () => {
    const wrapper = mount(TimelineScrubber)
    expect(wrapper.find('[data-rig-timeline-scrubber-track]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-timeline-scrubber-thumb]').exists()).toBe(true)
  })

  it('renders fill bar', () => {
    const wrapper = mount(TimelineScrubber, { props: { modelValue: 50, min: 0, max: 100 } })
    const fill = wrapper.find('[data-rig-timeline-scrubber-fill]')
    expect(fill.exists()).toBe(true)
    expect(fill.attributes('style')).toContain('width: 50%')
  })

  it('displays formatted value', () => {
    const wrapper = mount(TimelineScrubber, { props: { modelValue: 42 } })
    expect(wrapper.find('[data-rig-timeline-scrubber-value]').text()).toBe('42')
  })

  it('has correct ARIA attributes', () => {
    const wrapper = mount(TimelineScrubber, { props: { modelValue: 25, min: 0, max: 100 } })
    const el = wrapper.find('[data-rig-timeline-scrubber]')
    expect(el.attributes('role')).toBe('slider')
    expect(el.attributes('aria-valuenow')).toBe('25')
    expect(el.attributes('aria-valuemin')).toBe('0')
    expect(el.attributes('aria-valuemax')).toBe('100')
  })

  it('sets disabled attribute', () => {
    const wrapper = mount(TimelineScrubber, { props: { disabled: true } })
    expect(wrapper.find('[data-rig-timeline-scrubber]').attributes('data-disabled')).toBeDefined()
  })

  it('applies dimensions', () => {
    const wrapper = mount(TimelineScrubber, { props: { width: 300, height: 40 } })
    const el = wrapper.find('[data-rig-timeline-scrubber]')
    expect(el.attributes('style')).toContain('width: 300px')
    expect(el.attributes('style')).toContain('height: 40px')
  })

  it('handles keyboard navigation', async () => {
    const wrapper = mount(TimelineScrubber, {
      props: { modelValue: 50, min: 0, max: 100, step: 1 },
      attachTo: document.body,
    })
    await wrapper
      .find('[data-rig-timeline-scrubber]')
      .trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([40])
    wrapper.unmount()
  })

  it('supports focus management', async () => {
    const wrapper = mount(TimelineScrubber, {
      props: { modelValue: 50 },
      attachTo: document.body,
    })
    const el = wrapper.find('[data-rig-timeline-scrubber]').element as HTMLElement
    el.focus()
    expect(document.activeElement).toBe(el)
    wrapper.unmount()
  })

  it('handles emit interactions', () => {
    const wrapper = mount(TimelineScrubber, { props: { modelValue: 50 } })
    expect(wrapper.find('[data-rig-timeline-scrubber]').attributes('data-dragging')).toBeUndefined()
  })

  it('reacts to prop updates', async () => {
    const wrapper = mount(TimelineScrubber, { props: { modelValue: 50 } })
    expect(wrapper.find('[data-rig-timeline-scrubber-value]').text()).toBe('50')
    expect(wrapper.find('[data-rig-timeline-scrubber]').attributes('aria-valuenow')).toBe('50')
    await wrapper.setProps({ modelValue: 75 })
    expect(wrapper.find('[data-rig-timeline-scrubber-value]').text()).toBe('75')
    expect(wrapper.find('[data-rig-timeline-scrubber]').attributes('aria-valuenow')).toBe('75')
  })

  it('uses custom formatValue', () => {
    const wrapper = mount(TimelineScrubber, {
      props: { modelValue: 42, formatValue: (v: number) => `${v}s` },
    })
    expect(wrapper.find('[data-rig-timeline-scrubber-value]').text()).toBe('42s')
  })

  it('sets tabindex=-1 when disabled', () => {
    const wrapper = mount(TimelineScrubber, { props: { disabled: true } })
    expect(wrapper.find('[data-rig-timeline-scrubber]').attributes('tabindex')).toBe('-1')
  })

  it('sets tabindex=0 when enabled', () => {
    const wrapper = mount(TimelineScrubber)
    expect(wrapper.find('[data-rig-timeline-scrubber]').attributes('tabindex')).toBe('0')
  })

  it('sets aria-label', () => {
    const wrapper = mount(TimelineScrubber)
    expect(wrapper.find('[data-rig-timeline-scrubber]').attributes('aria-label')).toBe(
      'Timeline scrubber',
    )
  })

  it('positions thumb at correct percentage', () => {
    const wrapper = mount(TimelineScrubber, { props: { modelValue: 25, min: 0, max: 100 } })
    const thumb = wrapper.find('[data-rig-timeline-scrubber-thumb]')
    expect(thumb.attributes('style')).toContain('left: 25%')
  })

  it('handles min === max gracefully', () => {
    const wrapper = mount(TimelineScrubber, { props: { modelValue: 0, min: 0, max: 0 } })
    const fill = wrapper.find('[data-rig-timeline-scrubber-fill]')
    expect(fill.attributes('style')).toContain('width: 0%')
  })

  describe('keyboard navigation', () => {
    it('ArrowRight increases value', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, min: 0, max: 100, step: 1 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([51])
      wrapper.unmount()
    })

    it('ArrowUp increases value', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, min: 0, max: 100, step: 1 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([51])
      wrapper.unmount()
    })

    it('ArrowLeft decreases value', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, min: 0, max: 100, step: 1 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([49])
      wrapper.unmount()
    })

    it('ArrowDown decreases value', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, min: 0, max: 100, step: 1 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([49])
      wrapper.unmount()
    })

    it('Shift multiplies step by 10', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, min: 0, max: 100, step: 1 },
        attachTo: document.body,
      })
      await wrapper
        .find('[data-rig-timeline-scrubber]')
        .trigger('keydown', { key: 'ArrowRight', shiftKey: true })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([60])
      wrapper.unmount()
    })

    it('Home emits min value', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, min: 10, max: 100 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([10])
      wrapper.unmount()
    })

    it('End emits max value', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, min: 0, max: 100 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([100])
      wrapper.unmount()
    })

    it('clamps at min', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 0, min: 0, max: 100, step: 1 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([0])
      wrapper.unmount()
    })

    it('clamps at max', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 100, min: 0, max: 100, step: 1 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([100])
      wrapper.unmount()
    })

    it('does not emit when disabled', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, disabled: true },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      wrapper.unmount()
    })

    it('rounds to step', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, min: 0, max: 100, step: 5 },
        attachTo: document.body,
      })
      await wrapper.find('[data-rig-timeline-scrubber]').trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([55])
      wrapper.unmount()
    })
  })

  describe('pointer interactions', () => {
    it('starts drag on pointerdown', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50 },
        attachTo: document.body,
      })
      const track = wrapper.find('[data-rig-timeline-scrubber-track]')
      const el = track.element as HTMLElement
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }),
      )
      await nextTick()
      expect(wrapper.find('[data-rig-timeline-scrubber]').attributes('data-dragging')).toBeDefined()
      wrapper.unmount()
    })

    it('does not start drag when disabled', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50, disabled: true },
        attachTo: document.body,
      })
      const track = wrapper.find('[data-rig-timeline-scrubber-track]')
      const el = track.element as HTMLElement
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }),
      )
      await nextTick()
      expect(
        wrapper.find('[data-rig-timeline-scrubber]').attributes('data-dragging'),
      ).toBeUndefined()
      wrapper.unmount()
    })

    it('emits scrub event on pointerdown', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50 },
        attachTo: document.body,
      })
      const track = wrapper.find('[data-rig-timeline-scrubber-track]')
      const el = track.element as HTMLElement
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }),
      )
      await nextTick()
      expect(wrapper.emitted('scrub')).toBeTruthy()
      wrapper.unmount()
    })

    it('stops drag on pointerup', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50 },
        attachTo: document.body,
      })
      const track = wrapper.find('[data-rig-timeline-scrubber-track]')
      const el = track.element as HTMLElement
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }),
      )
      await nextTick()

      el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      await nextTick()
      expect(
        wrapper.find('[data-rig-timeline-scrubber]').attributes('data-dragging'),
      ).toBeUndefined()
      wrapper.unmount()
    })

    it('does not emit on pointermove when not dragging', async () => {
      const wrapper = mount(TimelineScrubber, {
        props: { modelValue: 50 },
        attachTo: document.body,
      })
      const track = wrapper.find('[data-rig-timeline-scrubber-track]')
      const el = track.element as HTMLElement

      el.dispatchEvent(new PointerEvent('pointermove', { clientX: 150, bubbles: true }))
      await nextTick()
      expect(wrapper.emitted('scrub')).toBeUndefined()
      wrapper.unmount()
    })
  })
})
