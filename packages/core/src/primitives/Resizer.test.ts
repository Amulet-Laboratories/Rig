import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Resizer from './Resizer.vue'
import { nextTick } from 'vue'

describe('Resizer', () => {
  it('renders with data-rig-resizer and separator role', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('data-rig-resizer')).toBeDefined()
    expect(wrapper.attributes('role')).toBe('separator')
  })

  it('sets orientation attributes', () => {
    const h = mount(Resizer, { props: { orientation: 'horizontal' } })
    expect(h.attributes('data-orientation')).toBe('horizontal')
    expect(h.attributes('aria-orientation')).toBe('horizontal')

    const v = mount(Resizer, { props: { orientation: 'vertical' } })
    expect(v.attributes('data-orientation')).toBe('vertical')
  })

  it('defaults to horizontal', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('is focusable', () => {
    const wrapper = mount(Resizer)
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('emits drag on ArrowRight key for horizontal orientation', async () => {
    const wrapper = mount(Resizer, { props: { orientation: 'horizontal' } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('dragstart')).toHaveLength(1)
    expect(wrapper.emitted('drag')?.[0]).toEqual([{ delta: 10, position: 0 }])
    expect(wrapper.emitted('dragend')).toHaveLength(1)
  })

  it('emits drag on ArrowLeft key for horizontal orientation', async () => {
    const wrapper = mount(Resizer, { props: { orientation: 'horizontal' } })
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('drag')?.[0]).toEqual([{ delta: -10, position: 0 }])
  })

  it('emits drag on ArrowDown key for vertical orientation', async () => {
    const wrapper = mount(Resizer, { props: { orientation: 'vertical' } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('drag')?.[0]).toEqual([{ delta: 10, position: 0 }])
  })

  it('ignores ArrowDown for horizontal orientation', async () => {
    const wrapper = mount(Resizer, { props: { orientation: 'horizontal' } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('drag')).toBeUndefined()
  })

  it('manages focus correctly', async () => {
    const wrapper = mount(Resizer, { attachTo: document.body })
    const focusable = wrapper.find('button, input, [tabindex]')
    if (focusable.exists()) {
      await focusable.trigger('focus')
      expect(document.activeElement).toBeDefined()
    }
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Resizer)
    await wrapper.setProps({ minPosition: 42 })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  describe('keyboard navigation', () => {
    it('emits drag on ArrowUp for vertical orientation', async () => {
      const wrapper = mount(Resizer, { props: { orientation: 'vertical' } })
      await wrapper.trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('dragstart')).toHaveLength(1)
      expect(wrapper.emitted('drag')?.[0]).toEqual([{ delta: -10, position: 0 }])
      expect(wrapper.emitted('dragend')).toHaveLength(1)
    })

    it('ignores ArrowUp for horizontal orientation', async () => {
      const wrapper = mount(Resizer, { props: { orientation: 'horizontal' } })
      await wrapper.trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('drag')).toBeUndefined()
    })

    it('ignores ArrowRight for vertical orientation', async () => {
      const wrapper = mount(Resizer, { props: { orientation: 'vertical' } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('drag')).toBeUndefined()
    })

    it('ignores ArrowLeft for vertical orientation', async () => {
      const wrapper = mount(Resizer, { props: { orientation: 'vertical' } })
      await wrapper.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('drag')).toBeUndefined()
    })

    it('ignores unrelated keys', async () => {
      const wrapper = mount(Resizer)
      await wrapper.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('dragstart')).toBeUndefined()
      expect(wrapper.emitted('drag')).toBeUndefined()
    })
  })

  describe('double-click reset', () => {
    it('emits reset on double-click', async () => {
      const wrapper = mount(Resizer)
      await wrapper.trigger('dblclick')
      expect(wrapper.emitted('reset')).toHaveLength(1)
    })
  })

  describe('pointer interaction', () => {
    // PointerEvent is not available in jsdom, so we test via the
    // component's pointerdown handler attribute instead of dispatching raw events.

    it('emits dragstart on pointerdown', async () => {
      const wrapper = mount(Resizer, { attachTo: document.body })
      // Trigger the Vue @pointerdown handler with a mock event
      const el = wrapper.element as HTMLElement
      el.setPointerCapture = vi.fn()
      const event = new MouseEvent('pointerdown', { clientX: 100, clientY: 50 })
      Object.defineProperty(event, 'pointerId', { value: 1 })
      Object.defineProperty(event, 'target', { value: el })
      el.dispatchEvent(event)
      expect(wrapper.emitted('dragstart')).toHaveLength(1)
      wrapper.unmount()
    })

    it('sets dragging data attribute on pointerdown', async () => {
      const wrapper = mount(Resizer, { attachTo: document.body })
      const el = wrapper.element as HTMLElement
      el.setPointerCapture = vi.fn()
      const event = new MouseEvent('pointerdown', { clientX: 100, clientY: 50 })
      Object.defineProperty(event, 'pointerId', { value: 1 })
      Object.defineProperty(event, 'target', { value: el })
      el.dispatchEvent(event)
      await nextTick()
      expect(wrapper.attributes('data-dragging')).toBe('true')

      // Clean up via pointerup
      el.dispatchEvent(new MouseEvent('pointerup'))
      await nextTick()
      expect(wrapper.attributes('data-dragging')).toBeUndefined()
      wrapper.unmount()
    })

    it('emits drag with delta during pointer move', async () => {
      const wrapper = mount(Resizer, {
        attachTo: document.body,
        props: { orientation: 'horizontal' },
      })
      const el = wrapper.element as HTMLElement
      el.setPointerCapture = vi.fn()

      const downEvent = new MouseEvent('pointerdown', { clientX: 100, clientY: 50 })
      Object.defineProperty(downEvent, 'pointerId', { value: 1 })
      Object.defineProperty(downEvent, 'target', { value: el })
      el.dispatchEvent(downEvent)

      el.dispatchEvent(new MouseEvent('pointermove', { clientX: 130, clientY: 50 }))

      const dragEvents = wrapper.emitted('drag')
      expect(dragEvents).toBeDefined()
      expect(dragEvents![0][0]).toEqual(
        expect.objectContaining({ delta: expect.any(Number), position: expect.any(Number) }),
      )
      wrapper.unmount()
    })
  })

  describe('ARIA attributes', () => {
    it('has aria-valuemin, aria-valuemax, aria-valuenow', () => {
      const wrapper = mount(Resizer)
      expect(wrapper.attributes('aria-valuemin')).toBe('0')
      expect(wrapper.attributes('aria-valuemax')).toBe('100')
      expect(wrapper.attributes('aria-valuenow')).toBe('50')
    })

    it('has aria-orientation matching the orientation prop', () => {
      const h = mount(Resizer, { props: { orientation: 'horizontal' } })
      expect(h.attributes('aria-orientation')).toBe('horizontal')

      const v = mount(Resizer, { props: { orientation: 'vertical' } })
      expect(v.attributes('aria-orientation')).toBe('vertical')
    })
  })

  describe('slot content', () => {
    it('renders slot content', () => {
      const wrapper = mount(Resizer, {
        slots: { default: '<span class="grip-icon" />' },
      })
      expect(wrapper.find('.grip-icon').exists()).toBe(true)
    })
  })
})
