import { describe, it, expect, vi } from 'vitest'
import { EventBus } from './EventBus'

describe('EventBus', () => {
  it('emits and receives events', () => {
    const bus = new EventBus<{ ping: { msg: string } }>()
    const handler = vi.fn()
    bus.on('ping', handler)
    bus.emit('ping', { msg: 'hello' })
    expect(handler).toHaveBeenCalledWith({ msg: 'hello' })
  })

  it('returns unsubscribe function from on()', () => {
    const bus = new EventBus<{ tick: number }>()
    const handler = vi.fn()
    const unsub = bus.on('tick', handler)
    bus.emit('tick', 1)
    unsub()
    bus.emit('tick', 2)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('once() fires handler only once', () => {
    const bus = new EventBus<{ once: string }>()
    const handler = vi.fn()
    bus.once('once', handler)
    bus.emit('once', 'a')
    bus.emit('once', 'b')
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('a')
  })

  it('off() removes a specific handler', () => {
    const bus = new EventBus<{ ev: number }>()
    const h1 = vi.fn()
    const h2 = vi.fn()
    bus.on('ev', h1)
    bus.on('ev', h2)
    bus.off('ev', h1)
    bus.emit('ev', 42)
    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalledWith(42)
  })

  it('clear(event) removes all handlers for one event', () => {
    const bus = new EventBus<{ a: number; b: number }>()
    const ha = vi.fn()
    const hb = vi.fn()
    bus.on('a', ha)
    bus.on('b', hb)
    bus.clear('a')
    bus.emit('a', 1)
    bus.emit('b', 2)
    expect(ha).not.toHaveBeenCalled()
    expect(hb).toHaveBeenCalledWith(2)
  })

  it('clear() removes all handlers for all events', () => {
    const bus = new EventBus<{ a: number; b: number }>()
    const ha = vi.fn()
    const hb = vi.fn()
    bus.on('a', ha)
    bus.on('b', hb)
    bus.clear()
    bus.emit('a', 1)
    bus.emit('b', 2)
    expect(ha).not.toHaveBeenCalled()
    expect(hb).not.toHaveBeenCalled()
  })

  it('listenerCount() returns correct count', () => {
    const bus = new EventBus<{ ev: number }>()
    expect(bus.listenerCount('ev')).toBe(0)
    const unsub = bus.on('ev', () => {})
    bus.on('ev', () => {})
    expect(bus.listenerCount('ev')).toBe(2)
    unsub()
    expect(bus.listenerCount('ev')).toBe(1)
  })

  it('handler errors are swallowed and do not break other handlers', () => {
    const bus = new EventBus<{ err: number }>()
    const bad = vi.fn(() => {
      throw new Error('boom')
    })
    const good = vi.fn()
    bus.on('err', bad)
    bus.on('err', good)
    bus.emit('err', 1)
    expect(bad).toHaveBeenCalled()
    expect(good).toHaveBeenCalledWith(1)
  })

  it('emitting an event with no handlers is a no-op', () => {
    const bus = new EventBus<{ noop: string }>()
    expect(() => bus.emit('noop', 'test')).not.toThrow()
  })
})
