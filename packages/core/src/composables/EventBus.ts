// EventBus — strongly-typed pub/sub event bus.
// Pure TypeScript, no Vue dependency.

type EventHandler<T = unknown> = (payload: T) => void

/**
 * A strongly-typed event bus for decoupled cross-feature communication.
 *
 * @example
 * ```ts
 * type Events = {
 *   'record:created': { id: string; domain: string }
 *   'record:deleted': { id: string }
 *   'theme:changed': { theme: string }
 * }
 *
 * const bus = new EventBus<Events>()
 * bus.on('record:created', ({ id, domain }) => { ... })
 * bus.emit('record:created', { id: 'legal.cases.r-smith', domain: 'legal' })
 * ```
 */
export class EventBus<EventMap extends object = Record<string, unknown>> {
  private handlers = new Map<keyof EventMap, Set<EventHandler>>()

  /**
   * Subscribe to an event. Returns an unsubscribe function.
   */
  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler as EventHandler)
    return () => this.off(event, handler)
  }

  /**
   * Subscribe to an event for a single emission.
   */
  once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    const wrapper: EventHandler<EventMap[K]> = (payload) => {
      this.off(event, wrapper)
      handler(payload)
    }
    return this.on(event, wrapper)
  }

  /**
   * Unsubscribe a specific handler from an event.
   */
  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    this.handlers.get(event)?.delete(handler as EventHandler)
  }

  /**
   * Emit an event to all subscribed handlers.
   */
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const handlers = this.handlers.get(event)
    if (!handlers) return
    for (const handler of handlers) {
      try {
        handler(payload)
      } catch (err) {
        if (import.meta.env?.DEV) {
          console.error(`[EventBus] Handler error on "${String(event)}":`, err)
        }
      }
    }
  }

  /**
   * Remove all handlers for a specific event, or all events if no event specified.
   */
  clear<K extends keyof EventMap>(event?: K): void {
    if (event) {
      this.handlers.delete(event)
    } else {
      this.handlers.clear()
    }
  }

  /**
   * Get the number of handlers registered for an event.
   */
  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.handlers.get(event)?.size ?? 0
  }
}
