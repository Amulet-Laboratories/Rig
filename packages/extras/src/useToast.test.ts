import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { toast, useToast } from './useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    toast.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with empty toasts', () => {
    const { toasts } = useToast()
    expect(toasts.value).toHaveLength(0)
  })

  it('add() pushes a toast and returns its id', () => {
    const { toasts } = useToast()
    const id = toast.add({ message: 'Hello' })
    expect(id).toBeTypeOf('string')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]!.message).toBe('Hello')
  })

  it('uses info variant by default', () => {
    toast.add({ message: 'Default' })
    const { toasts } = useToast()
    expect(toasts.value[0]!.variant).toBe('info')
  })

  it('respects custom variant', () => {
    toast.add({ message: 'Err', variant: 'error' })
    const { toasts } = useToast()
    expect(toasts.value[0]!.variant).toBe('error')
  })

  it('makes toasts dismissible by default', () => {
    toast.add({ message: 'D' })
    const { toasts } = useToast()
    expect(toasts.value[0]!.dismissible).toBe(true)
  })

  it('auto-dismisses after default 5s', () => {
    toast.add({ message: 'Temp' })
    const { toasts } = useToast()
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(5100)
    expect(toasts.value).toHaveLength(0)
  })

  it('auto-dismisses after custom duration', () => {
    toast.add({ message: 'Quick', duration: 1000 })
    const { toasts } = useToast()
    vi.advanceTimersByTime(1100)
    expect(toasts.value).toHaveLength(0)
  })

  it('does not auto-dismiss when duration is 0', () => {
    toast.add({ message: 'Sticky', duration: 0 })
    const { toasts } = useToast()
    vi.advanceTimersByTime(60_000)
    expect(toasts.value).toHaveLength(1)
  })

  it('dismiss() removes a specific toast', () => {
    const id1 = toast.add({ message: 'First', duration: 0 })
    toast.add({ message: 'Second', duration: 0 })
    const { toasts } = useToast()
    expect(toasts.value).toHaveLength(2)
    toast.dismiss(id1)
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]!.message).toBe('Second')
  })

  it('dismiss() is a no-op for unknown id', () => {
    toast.add({ message: 'A', duration: 0 })
    const { toasts } = useToast()
    toast.dismiss('nonexistent')
    expect(toasts.value).toHaveLength(1)
  })

  it('clear() removes all toasts', () => {
    toast.add({ message: 'One', duration: 0 })
    toast.add({ message: 'Two', duration: 0 })
    const { toasts } = useToast()
    expect(toasts.value).toHaveLength(2)
    toast.clear()
    expect(toasts.value).toHaveLength(0)
  })

  it('uses custom id when provided', () => {
    const id = toast.add({ id: 'custom-id', message: 'Custom' })
    expect(id).toBe('custom-id')
    const { toasts } = useToast()
    expect(toasts.value[0]!.id).toBe('custom-id')
  })

  it('useToast() returns the same reactive state', () => {
    const a = useToast()
    const b = useToast()
    toast.add({ message: 'Shared', duration: 0 })
    expect(a.toasts.value).toHaveLength(1)
    expect(b.toasts.value).toHaveLength(1)
    expect(a.toasts).toBe(b.toasts)
  })
})
