import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ResizablePanel from './ResizablePanel.vue'

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

describe('ResizablePanel', () => {
  it('renders with data-rig-resizable-panel', () => {
    const wrapper = mount(ResizablePanel)
    expect(wrapper.find('[data-rig-resizable-panel]').exists()).toBe(true)
  })

  it('renders content slot', () => {
    const wrapper = mount(ResizablePanel, {
      slots: { default: '<p>Panel content</p>' },
    })
    expect(wrapper.find('[data-rig-resizable-panel-content]').text()).toBe('Panel content')
  })

  it('renders resize handle', () => {
    const wrapper = mount(ResizablePanel)
    expect(wrapper.find('[data-rig-resizable-panel-handle]').exists()).toBe(true)
  })

  it('sets direction attribute', () => {
    const wrapper = mount(ResizablePanel, { props: { direction: 'vertical' } })
    expect(wrapper.find('[data-rig-resizable-panel]').attributes('data-direction')).toBe('vertical')
  })

  it('applies initial size as width for horizontal direction', () => {
    const wrapper = mount(ResizablePanel, { props: { initialSize: 400, direction: 'horizontal' } })
    expect(wrapper.find('[data-rig-resizable-panel]').attributes('style')).toContain('width: 400px')
  })

  it('applies initial size as height for vertical direction', () => {
    const wrapper = mount(ResizablePanel, { props: { initialSize: 200, direction: 'vertical' } })
    expect(wrapper.find('[data-rig-resizable-panel]').attributes('style')).toContain(
      'height: 200px',
    )
  })

  it('has correct ARIA on handle', () => {
    const wrapper = mount(ResizablePanel, {
      props: { minSize: 50, maxSize: 500, initialSize: 200 },
    })
    const handle = wrapper.find('[data-rig-resizable-panel-handle]')
    expect(handle.attributes('role')).toBe('separator')
    expect(handle.attributes('aria-valuenow')).toBe('200')
    expect(handle.attributes('aria-valuemin')).toBe('50')
    expect(handle.attributes('aria-valuemax')).toBe('500')
  })

  it('sets disabled attribute when disabled', () => {
    const wrapper = mount(ResizablePanel, { props: { disabled: true } })
    expect(
      wrapper.find('[data-rig-resizable-panel]').attributes('data-disabled'),
    ).not.toBeUndefined()
  })

  it('does not set disabled attribute when not disabled', () => {
    const wrapper = mount(ResizablePanel, { props: { disabled: false } })
    expect(wrapper.find('[data-rig-resizable-panel]').attributes('data-disabled')).toBeUndefined()
  })

  it('does not emit resize on non-arrow keys', async () => {
    const wrapper = mount(ResizablePanel, {
      props: { initialSize: 200 },
      attachTo: document.body,
    })
    const handle = wrapper.find('[data-rig-resizable-panel-handle]')
    await handle.trigger('keydown', { key: 'Tab' })
    expect(wrapper.emitted('resize')).toBeUndefined()
    wrapper.unmount()
  })

  it('handle can receive focus when enabled', () => {
    const wrapper = mount(ResizablePanel, {
      props: { disabled: false },
      attachTo: document.body,
    })
    const handle = wrapper.find('[data-rig-resizable-panel-handle]')
    ;(handle.element as HTMLElement).focus()
    expect(document.activeElement).toBe(handle.element)
    wrapper.unmount()
  })

  it('does not emit resize on click', async () => {
    const wrapper = mount(ResizablePanel, {
      props: { initialSize: 200 },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('resize')).toBeUndefined()
  })

  it('updates data-disabled when disabled prop changes', async () => {
    const wrapper = mount(ResizablePanel, { props: { disabled: false } })
    expect(wrapper.find('[data-rig-resizable-panel]').attributes('data-disabled')).toBeUndefined()
    await wrapper.setProps({ disabled: true })
    expect(
      wrapper.find('[data-rig-resizable-panel]').attributes('data-disabled'),
    ).not.toBeUndefined()
  })

  it('omits aria-valuemax when maxSize is Infinity', () => {
    const wrapper = mount(ResizablePanel, { props: { maxSize: Infinity } })
    const handle = wrapper.find('[data-rig-resizable-panel-handle]')
    expect(handle.attributes('aria-valuemax')).toBeUndefined()
  })

  it('sets tabindex=-1 when disabled', () => {
    const wrapper = mount(ResizablePanel, { props: { disabled: true } })
    const handle = wrapper.find('[data-rig-resizable-panel-handle]')
    expect(handle.attributes('tabindex')).toBe('-1')
  })

  it('sets tabindex=0 when enabled', () => {
    const wrapper = mount(ResizablePanel, { props: { disabled: false } })
    const handle = wrapper.find('[data-rig-resizable-panel-handle]')
    expect(handle.attributes('tabindex')).toBe('0')
  })

  describe('keyboard resize', () => {
    it('ArrowRight increases size for horizontal', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 200, minSize: 100, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('resize')).toBeTruthy()
      expect(wrapper.emitted('resize')![0]![0]).toBe(210)
      wrapper.unmount()
    })

    it('ArrowLeft decreases size for horizontal', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 200, minSize: 100, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('resize')![0]![0]).toBe(190)
      wrapper.unmount()
    })

    it('ArrowDown increases size for vertical', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'vertical', initialSize: 200, minSize: 100, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('resize')![0]![0]).toBe(210)
      wrapper.unmount()
    })

    it('ArrowUp decreases size for vertical', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'vertical', initialSize: 200, minSize: 100, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('resize')![0]![0]).toBe(190)
      wrapper.unmount()
    })

    it('Shift increases step to 50', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 200, minSize: 100, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'ArrowRight', shiftKey: true })
      expect(wrapper.emitted('resize')![0]![0]).toBe(250)
      wrapper.unmount()
    })

    it('Home sets to minSize', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 200, minSize: 100, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('resize')![0]![0]).toBe(100)
      wrapper.unmount()
    })

    it('End sets to maxSize', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 200, minSize: 100, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('resize')![0]![0]).toBe(500)
      wrapper.unmount()
    })

    it('End with Infinity maxSize keeps current size', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 200, minSize: 100, maxSize: Infinity },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('resize')![0]![0]).toBe(200)
      wrapper.unmount()
    })

    it('does not resize when disabled', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { disabled: true, initialSize: 200 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('resize')).toBeUndefined()
      wrapper.unmount()
    })

    it('clamps size at minSize', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 105, minSize: 100 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('resize')![0]![0]).toBe(100)
      wrapper.unmount()
    })

    it('clamps size at maxSize', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 495, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      await handle.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('resize')![0]![0]).toBe(500)
      wrapper.unmount()
    })
  })

  describe('pointer drag', () => {
    it('starts drag on pointerdown', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { initialSize: 200 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      const el = handle.element as HTMLElement
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }),
      )
      await nextTick()
      expect(
        wrapper.find('[data-rig-resizable-panel]').attributes('data-dragging'),
      ).not.toBeUndefined()
      wrapper.unmount()
    })

    it('does not start drag when disabled', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { initialSize: 200, disabled: true },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      const el = handle.element as HTMLElement
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }),
      )
      await nextTick()
      expect(wrapper.find('[data-rig-resizable-panel]').attributes('data-dragging')).toBeUndefined()
      wrapper.unmount()
    })

    it('updates size on pointermove during drag', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { direction: 'horizontal', initialSize: 200, minSize: 100, maxSize: 500 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      const el = handle.element as HTMLElement
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }),
      )
      await nextTick()

      document.dispatchEvent(new PointerEvent('pointermove', { clientX: 150 }))
      await nextTick()
      expect(wrapper.emitted('resize')).toBeTruthy()
      wrapper.unmount()
    })

    it('stops drag on pointerup', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { initialSize: 200 },
        attachTo: document.body,
      })
      const handle = wrapper.find('[data-rig-resizable-panel-handle]')
      const el = handle.element as HTMLElement
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }),
      )
      await nextTick()
      expect(
        wrapper.find('[data-rig-resizable-panel]').attributes('data-dragging'),
      ).not.toBeUndefined()

      document.dispatchEvent(new PointerEvent('pointerup'))
      await nextTick()
      expect(wrapper.find('[data-rig-resizable-panel]').attributes('data-dragging')).toBeUndefined()
      wrapper.unmount()
    })

    it('ignores pointermove when not dragging', async () => {
      const wrapper = mount(ResizablePanel, {
        props: { initialSize: 200 },
        attachTo: document.body,
      })
      document.dispatchEvent(new PointerEvent('pointermove', { clientX: 150 }))
      await nextTick()
      expect(wrapper.emitted('resize')).toBeUndefined()
      wrapper.unmount()
    })
  })

  it('cleans up event listeners on unmount', async () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const wrapper = mount(ResizablePanel, { attachTo: document.body })
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function))
    removeSpy.mockRestore()
  })
})
