import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useFocusTrap } from './useFocusTrap'

function createWrapper(
  opts: { autoFocus?: boolean; restoreFocus?: boolean; onEscape?: () => void } = {},
) {
  const active = ref(false)

  const Comp = defineComponent({
    setup() {
      const containerRef = ref<HTMLElement | null>(null)
      useFocusTrap({
        containerRef,
        active,
        autoFocus: opts.autoFocus ?? true,
        restoreFocus: opts.restoreFocus ?? true,
        onEscape: opts.onEscape,
      })
      return { containerRef }
    },
    render() {
      return h('div', { ref: 'containerRef' }, [
        h('button', { id: 'btn-a' }, 'A'),
        h('button', { id: 'btn-b' }, 'B'),
        h('button', { id: 'btn-c' }, 'C'),
      ])
    },
  })

  const wrapper = mount(Comp, { attachTo: document.body })
  return { wrapper, active }
}

describe('useFocusTrap', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('auto-focuses first element on activation', async () => {
    const { active } = createWrapper()

    active.value = true
    await nextTick()
    await nextTick()
    await nextTick()

    expect(document.activeElement?.id).toBe('btn-a')
  })

  it('does not auto-focus when autoFocus is false', async () => {
    const { active } = createWrapper({ autoFocus: false })

    active.value = true
    await nextTick()
    await nextTick()

    expect(document.activeElement?.id).not.toBe('btn-a')
  })

  it('traps Tab at the last element', async () => {
    const { active } = createWrapper()

    active.value = true
    await nextTick()
    await nextTick()

    // Focus the last button
    const btnC = document.getElementById('btn-c')!
    btnC.focus()
    expect(document.activeElement?.id).toBe('btn-c')

    // Press Tab — should wrap to first
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(tabEvent)

    expect(document.activeElement?.id).toBe('btn-a')
  })

  it('traps Shift+Tab at the first element', async () => {
    const { active } = createWrapper()

    active.value = true
    await nextTick()
    await nextTick()
    await nextTick()

    // Focus first button (auto-focused)
    expect(document.activeElement?.id).toBe('btn-a')

    // Press Shift+Tab — should wrap to last
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(shiftTabEvent)

    expect(document.activeElement?.id).toBe('btn-c')
  })

  it('calls onEscape when Escape is pressed', async () => {
    const onEscape = vi.fn()
    const { active } = createWrapper({ onEscape })

    active.value = true
    await nextTick()
    await nextTick()

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )

    expect(onEscape).toHaveBeenCalledOnce()
  })

  it('does not call onEscape when trap is inactive', async () => {
    const onEscape = vi.fn()
    createWrapper({ onEscape })

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )

    expect(onEscape).not.toHaveBeenCalled()
  })

  it('restores focus on deactivation', async () => {
    // Create a button to hold initial focus
    const outer = document.createElement('button')
    outer.id = 'outer-btn'
    document.body.appendChild(outer)
    outer.focus()

    const { active } = createWrapper()

    active.value = true
    await nextTick()
    await nextTick()
    await nextTick()
    expect(document.activeElement?.id).toBe('btn-a')

    active.value = false
    await nextTick()

    expect(document.activeElement?.id).toBe('outer-btn')
  })

  it('does not restore focus when restoreFocus is false', async () => {
    const outer = document.createElement('button')
    outer.id = 'outer-btn'
    document.body.appendChild(outer)
    outer.focus()

    const { active } = createWrapper({ restoreFocus: false })

    active.value = true
    await nextTick()
    await nextTick()

    active.value = false
    await nextTick()

    expect(document.activeElement?.id).not.toBe('outer-btn')
  })

  it('cleans up keydown listener on unmount', async () => {
    const onEscape = vi.fn()
    const { wrapper, active } = createWrapper({ onEscape })

    active.value = true
    await nextTick()

    wrapper.unmount()

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )

    expect(onEscape).not.toHaveBeenCalled()
  })

  it('handles container with no focusable elements', async () => {
    const active = ref(false)

    const Comp = defineComponent({
      setup() {
        const containerRef = ref<HTMLElement | null>(null)
        useFocusTrap({ containerRef, active })
        return { containerRef }
      },
      render() {
        return h('div', { ref: 'containerRef' }, [h('span', 'No focusable elements')])
      },
    })

    mount(Comp, { attachTo: document.body })
    active.value = true
    await nextTick()
    await nextTick()

    // Tab should be prevented, no error
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(tabEvent)

    expect(tabEvent.defaultPrevented).toBe(true)
  })
})
