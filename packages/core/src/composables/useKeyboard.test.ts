import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useKeyboard } from './useKeyboard'

function createWrapper(shortcuts: Record<string, () => void>) {
  return mount(
    defineComponent({
      setup() {
        const result = useKeyboard(shortcuts)
        return { result }
      },
      template: '<div />',
    }),
  )
}

describe('useKeyboard', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('invokes handler on matching keydown', async () => {
    const handler = vi.fn()
    createWrapper({ 'Ctrl+K': handler })

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    )

    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not invoke handler on non-matching keydown', () => {
    const handler = vi.fn()
    createWrapper({ 'Ctrl+K': handler })

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'j', ctrlKey: true, bubbles: true }),
    )

    expect(handler).not.toHaveBeenCalled()
  })

  it('suppresses shortcuts in text inputs', () => {
    const handler = vi.fn()
    createWrapper({ 'Ctrl+K': handler })

    const input = document.createElement('input')
    document.body.appendChild(input)

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    })
    Object.defineProperty(event, 'target', { value: input })
    window.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })

  it('allows Escape in text inputs', () => {
    const handler = vi.fn()
    createWrapper({ Escape: handler })

    const input = document.createElement('input')
    document.body.appendChild(input)

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    })
    Object.defineProperty(event, 'target', { value: input })
    window.dispatchEvent(event)

    expect(handler).toHaveBeenCalledOnce()
    document.body.removeChild(input)
  })

  it('returns active shortcuts list', () => {
    const wrapper = createWrapper({ 'Ctrl+K': () => {}, 'Ctrl+P': () => {} })
    expect(wrapper.vm.result.activeShortcuts.value.length).toBe(2)
  })

  it('cleans up on unmount', () => {
    const handler = vi.fn()
    const wrapper = createWrapper({ 'Ctrl+K': handler })
    wrapper.unmount()

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    )

    expect(handler).not.toHaveBeenCalled()
  })
})
