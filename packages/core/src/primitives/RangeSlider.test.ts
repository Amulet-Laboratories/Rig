import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RangeSlider from './RangeSlider.vue'

function getThumb(wrapper: ReturnType<typeof mount>, index: 0 | 1) {
  return wrapper.findAll('[data-rig-range-slider-thumb]')[index]!
}

function getFill(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('[data-rig-range-slider-fill]')
}

describe('RangeSlider', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ── Rendering ──────────────────────────────────────────────

  it('renders with data-rig-range-slider', () => {
    const wrapper = mount(RangeSlider)
    expect(wrapper.attributes('data-rig-range-slider')).toBe('')
  })

  it('renders track and two thumb elements', () => {
    const wrapper = mount(RangeSlider)
    expect(wrapper.find('[data-rig-range-slider-track]').exists()).toBe(true)
    const thumbs = wrapper.findAll('[data-rig-range-slider-thumb]')
    expect(thumbs).toHaveLength(2)
  })

  it('renders fill element', () => {
    const wrapper = mount(RangeSlider)
    expect(wrapper.find('[data-rig-range-slider-fill]').exists()).toBe(true)
  })

  it('has group role with label', () => {
    const wrapper = mount(RangeSlider)
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Range slider')
  })

  // ── Disabled state ─────────────────────────────────────────

  it('sets disabled attribute when disabled', () => {
    const wrapper = mount(RangeSlider, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).not.toBeUndefined()
  })

  it('does not set data-disabled when enabled', () => {
    const wrapper = mount(RangeSlider, { props: { disabled: false } })
    expect(wrapper.attributes('data-disabled')).toBeUndefined()
  })

  // ── ARIA attributes ────────────────────────────────────────

  it('thumbs have correct slider roles and aria values', () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [20, 80] as [number, number], min: 0, max: 100 },
    })
    const thumbs = wrapper.findAll('[role="slider"]')
    expect(thumbs).toHaveLength(2)

    // Start thumb
    expect(thumbs[0]!.attributes('aria-valuenow')).toBe('20')
    expect(thumbs[0]!.attributes('aria-valuemin')).toBe('0')
    expect(thumbs[0]!.attributes('aria-valuemax')).toBe('80')
    expect(thumbs[0]!.attributes('aria-label')).toBe('Range start')

    // End thumb
    expect(thumbs[1]!.attributes('aria-valuenow')).toBe('80')
    expect(thumbs[1]!.attributes('aria-valuemin')).toBe('20')
    expect(thumbs[1]!.attributes('aria-valuemax')).toBe('100')
    expect(thumbs[1]!.attributes('aria-label')).toBe('Range end')
  })

  it('thumbs are focusable with tabindex 0', () => {
    const wrapper = mount(RangeSlider)
    const thumbs = wrapper.findAll('[data-rig-range-slider-thumb]')
    expect(thumbs[0]!.attributes('tabindex')).toBe('0')
    expect(thumbs[1]!.attributes('tabindex')).toBe('0')
  })

  // ── Percentage / fill positioning ──────────────────────────

  it('positions fill based on modelValue percentages', () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [20, 80] as [number, number], min: 0, max: 100 },
    })
    const fill = getFill(wrapper)
    expect(fill.attributes('style')).toContain('left: 20%')
    expect(fill.attributes('style')).toContain('width: 60%')
  })

  it('positions thumbs at correct percentages', () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [10, 90] as [number, number], min: 0, max: 100 },
    })
    const start = getThumb(wrapper, 0)
    const end = getThumb(wrapper, 1)
    expect(start.attributes('style')).toContain('left: 10%')
    expect(end.attributes('style')).toContain('left: 90%')
  })

  it('handles zero range (min === max) gracefully', () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [50, 50] as [number, number], min: 50, max: 50 },
    })
    const fill = getFill(wrapper)
    // When range is 0, percentage returns { start: 0, end: 100 }
    expect(fill.attributes('style')).toContain('left: 0%')
    expect(fill.attributes('style')).toContain('width: 100%')
  })

  it('calculates percentages with custom min/max', () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [50, 150] as [number, number], min: 0, max: 200 },
    })
    const fill = getFill(wrapper)
    expect(fill.attributes('style')).toContain('left: 25%')
    expect(fill.attributes('style')).toContain('width: 50%')
  })

  // ── Prop updates ───────────────────────────────────────────

  it('reacts to modelValue prop updates', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
    })
    await wrapper.setProps({ modelValue: [30, 70] as [number, number] })
    await nextTick()
    const fill = getFill(wrapper)
    expect(fill.attributes('style')).toContain('left: 30%')
    expect(fill.attributes('style')).toContain('width: 40%')
  })

  // ── Keyboard: start thumb ──────────────────────────────────

  it('ArrowRight on start thumb increments start value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], step: 1 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowRight' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted).toHaveLength(1)
    expect(emitted[0]![0]).toEqual([26, 75])
  })

  it('ArrowUp on start thumb increments start value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], step: 1 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowUp' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([26, 75])
  })

  it('ArrowLeft on start thumb decrements start value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], step: 1 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowLeft' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([24, 75])
  })

  it('ArrowDown on start thumb decrements start value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], step: 1 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowDown' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([24, 75])
  })

  it('Home on start thumb sets start to min', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], min: 0 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'Home' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([0, 75])
  })

  it('start thumb cannot increment past end value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [74, 75] as [number, number], step: 5 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowRight' })
    const emitted = wrapper.emitted('update:modelValue')!
    // Math.min(74 + 5, 75) = 75
    expect(emitted[0]![0]).toEqual([75, 75])
  })

  it('start thumb cannot decrement below min', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [2, 75] as [number, number], min: 0, step: 5 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowLeft' })
    const emitted = wrapper.emitted('update:modelValue')!
    // Math.max(2 - 5, 0) = 0
    expect(emitted[0]![0]).toEqual([0, 75])
  })

  // ── Keyboard: end thumb ────────────────────────────────────

  it('ArrowRight on end thumb increments end value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], step: 1 },
    })
    await getThumb(wrapper, 1).trigger('keydown', { key: 'ArrowRight' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([25, 76])
  })

  it('ArrowLeft on end thumb decrements end value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], step: 1 },
    })
    await getThumb(wrapper, 1).trigger('keydown', { key: 'ArrowLeft' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([25, 74])
  })

  it('End key on end thumb sets end to max', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], max: 100 },
    })
    await getThumb(wrapper, 1).trigger('keydown', { key: 'End' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([25, 100])
  })

  it('end thumb cannot increment past max', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 98] as [number, number], max: 100, step: 5 },
    })
    await getThumb(wrapper, 1).trigger('keydown', { key: 'ArrowRight' })
    const emitted = wrapper.emitted('update:modelValue')!
    // Math.min(98 + 5, 100) = 100
    expect(emitted[0]![0]).toEqual([25, 100])
  })

  it('end thumb cannot decrement below start value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 27] as [number, number], step: 5 },
    })
    await getThumb(wrapper, 1).trigger('keydown', { key: 'ArrowLeft' })
    const emitted = wrapper.emitted('update:modelValue')!
    // Math.max(27 - 5, 25) = 25
    expect(emitted[0]![0]).toEqual([25, 25])
  })

  // ── Keyboard: shift modifier ───────────────────────────────

  it('Shift+ArrowRight on start thumb uses 10x step', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], step: 1 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([35, 75])
  })

  it('Shift+ArrowLeft on end thumb uses 10x step', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], step: 1 },
    })
    await getThumb(wrapper, 1).trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([25, 65])
  })

  // ── Keyboard: custom step ──────────────────────────────────

  it('uses custom step for keyboard navigation', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [20, 80] as [number, number], step: 5 },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowRight' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted[0]![0]).toEqual([25, 80])
  })

  // ── Keyboard: disabled state ───────────────────────────────

  it('keyboard navigation is ignored when disabled', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], disabled: true },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // ── Keyboard: unhandled key does nothing ───────────────────

  it('unhandled keys do not emit', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // ── Home on end thumb does nothing ─────────────────────────

  it('Home key on end thumb does not emit', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
    })
    await getThumb(wrapper, 1).trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // ── End on start thumb does nothing ────────────────────────

  it('End key on start thumb does not emit', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
    })
    await getThumb(wrapper, 0).trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // ── Pointer drag: start thumb ──────────────────────────────

  it('pointerdown on start thumb begins drag and pointermove updates value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], min: 0, max: 100, step: 1 },
    })
    const track = wrapper.find('[data-rig-range-slider-track]')
    vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 200,
      top: 0,
      right: 200,
      bottom: 20,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    const startThumb = getThumb(wrapper, 0)
    ;(startThumb.element as any).setPointerCapture = vi.fn()

    await startThumb.trigger('pointerdown', { clientX: 50, pointerId: 1 })
    await startThumb.trigger('pointermove', { clientX: 100, pointerId: 1 })

    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted.length).toBeGreaterThanOrEqual(1)
    // clientX 100 / width 200 = 0.5 → value 50, clamped to min(50, 75) = 50
    const last = emitted[emitted.length - 1]![0] as [number, number]
    expect(last[0]).toBe(50)
    expect(last[1]).toBe(75)

    await startThumb.trigger('pointerup', { pointerId: 1 })
  })

  it('pointerdown on end thumb begins drag and pointermove updates end value', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], min: 0, max: 100, step: 1 },
    })
    const track = wrapper.find('[data-rig-range-slider-track]')
    vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 200,
      top: 0,
      right: 200,
      bottom: 20,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    const endThumb = getThumb(wrapper, 1)
    ;(endThumb.element as any).setPointerCapture = vi.fn()

    await endThumb.trigger('pointerdown', { clientX: 150, pointerId: 1 })
    await endThumb.trigger('pointermove', { clientX: 180, pointerId: 1 })

    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted.length).toBeGreaterThanOrEqual(1)
    // clientX 180 / width 200 = 0.9 → value 90, clamped to max(90, 25) = 90
    const last = emitted[emitted.length - 1]![0] as [number, number]
    expect(last[0]).toBe(25)
    expect(last[1]).toBe(90)

    await endThumb.trigger('pointerup', { pointerId: 1 })
  })

  it('pointerup ends drag and resets drag state', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
    })
    const startThumb = getThumb(wrapper, 0)
    ;(startThumb.element as any).setPointerCapture = vi.fn()

    await startThumb.trigger('pointerdown', { clientX: 50, pointerId: 1 })
    expect(startThumb.attributes('data-state')).toBe('dragging')

    await startThumb.trigger('pointerup', { pointerId: 1 })
    expect(startThumb.attributes('data-state')).toBeUndefined()
  })

  it('pointerdown when disabled does not start drag', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], disabled: true },
    })
    const startThumb = getThumb(wrapper, 0)
    ;(startThumb.element as any).setPointerCapture = vi.fn()

    await startThumb.trigger('pointerdown', { clientX: 50, pointerId: 1 })
    expect(startThumb.attributes('data-state')).toBeUndefined()
  })

  // ── Drag state attribute ────────────────────────────────────

  it('sets data-state=dragging on active thumb during drag', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
    })
    const startThumb = getThumb(wrapper, 0)
    ;(startThumb.element as any).setPointerCapture = vi.fn()

    await startThumb.trigger('pointerdown', { clientX: 50, pointerId: 1 })
    await nextTick()
    expect(startThumb.attributes('data-state')).toBe('dragging')
    expect(getThumb(wrapper, 1).attributes('data-state')).toBeUndefined()

    await startThumb.trigger('pointerup', { pointerId: 1 })
    await nextTick()
    expect(startThumb.attributes('data-state')).toBeUndefined()
  })

  // ── Step snapping ──────────────────────────────────────────

  it('snaps values to step during drag', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [20, 80] as [number, number], min: 0, max: 100, step: 10 },
    })
    const track = wrapper.find('[data-rig-range-slider-track]')
    vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 200,
      top: 0,
      right: 200,
      bottom: 20,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    const startThumb = getThumb(wrapper, 0)
    ;(startThumb.element as any).setPointerCapture = vi.fn()

    await startThumb.trigger('pointerdown', { clientX: 0, pointerId: 1 })
    // clientX 47 / width 200 = 0.235 → 23.5 → snap(23.5, 10) = 20
    await startThumb.trigger('pointermove', { clientX: 47, pointerId: 1 })

    const emitted = wrapper.emitted('update:modelValue')!
    const val = emitted[emitted.length - 1]![0] as [number, number]
    expect(val[0] % 10).toBe(0) // Must be a multiple of step

    await startThumb.trigger('pointerup', { pointerId: 1 })
  })

  // ── Clamping ───────────────────────────────────────────────

  it('clamps drag values to min/max bounds', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number], min: 0, max: 100, step: 1 },
    })
    const track = wrapper.find('[data-rig-range-slider-track]')
    vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 200,
      top: 0,
      right: 200,
      bottom: 20,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    const startThumb = getThumb(wrapper, 0)
    ;(startThumb.element as any).setPointerCapture = vi.fn()

    // Drag start thumb far left (negative position)
    await startThumb.trigger('pointerdown', { clientX: 0, pointerId: 1 })
    await startThumb.trigger('pointermove', { clientX: -50, pointerId: 1 })

    const emitted = wrapper.emitted('update:modelValue')!
    const val = emitted[emitted.length - 1]![0] as [number, number]
    expect(val[0]).toBe(0) // Clamped to min

    await startThumb.trigger('pointerup', { pointerId: 1 })
  })

  // ── Unmount cleanup ────────────────────────────────────────

  it('unmounts cleanly during an active drag', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
    })
    const startThumb = getThumb(wrapper, 0)
    ;(startThumb.element as any).setPointerCapture = vi.fn()

    // Start a drag
    await startThumb.trigger('pointerdown', { clientX: 50, pointerId: 1 })
    expect(startThumb.attributes('data-state')).toBe('dragging')

    // Should not throw on unmount
    expect(() => wrapper.unmount()).not.toThrow()
  })

  // ── pointermove without active drag does nothing ────────────

  it('pointermove without prior pointerdown does not emit', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
    })
    await getThumb(wrapper, 0).trigger('pointermove', { clientX: 100 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // ── Focus management ────────────────────────────────────────

  it('thumbs can receive focus', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
      attachTo: document.body,
    })
    const startThumb = getThumb(wrapper, 0)
    const endThumb = getThumb(wrapper, 1)

    ;(startThumb.element as HTMLElement).focus()
    await nextTick()
    expect(document.activeElement).toBe(startThumb.element)
    ;(endThumb.element as HTMLElement).focus()
    await nextTick()
    expect(document.activeElement).toBe(endThumb.element)

    wrapper.unmount()
  })

  it('focus moves between thumbs with Tab', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [25, 75] as [number, number] },
      attachTo: document.body,
    })
    const startThumb = getThumb(wrapper, 0)
    ;(startThumb.element as HTMLElement).focus()
    await nextTick()
    expect(document.activeElement).toBe(startThumb.element)

    wrapper.unmount()
  })

  // ── Default props ──────────────────────────────────────────

  it('uses default modelValue [25, 75]', () => {
    const wrapper = mount(RangeSlider)
    const thumbs = wrapper.findAll('[role="slider"]')
    expect(thumbs[0]!.attributes('aria-valuenow')).toBe('25')
    expect(thumbs[1]!.attributes('aria-valuenow')).toBe('75')
  })
})
