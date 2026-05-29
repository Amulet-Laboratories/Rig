// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { effectScope, nextTick, ref, type EffectScope } from 'vue'
import { useSortableOrder } from './useSortableOrder'

describe('useSortableOrder', () => {
  let scope: EffectScope

  beforeEach(() => {
    localStorage.clear()
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
  })

  it('initializes with empty order when localStorage is empty', () => {
    scope.run(() => {
      const { order } = useSortableOrder(() => [], { storageKey: 'test:order' })
      expect(order.value).toEqual([])
    })
  })

  it('loads persisted order from localStorage', () => {
    localStorage.setItem('test:order', JSON.stringify(['a', 'b', 'c']))
    scope.run(() => {
      const { order } = useSortableOrder(() => ['a', 'b', 'c'], { storageKey: 'test:order' })
      expect(order.value).toEqual(['a', 'b', 'c'])
    })
  })

  it('ignores corrupt localStorage data', () => {
    localStorage.setItem('test:order', 'not json')
    scope.run(() => {
      const { order } = useSortableOrder(() => [], { storageKey: 'test:order' })
      expect(order.value).toEqual([])
    })
  })

  it('reconciles order when new items appear', async () => {
    const ids = ref(['a', 'b'])
    let order: ReturnType<typeof useSortableOrder>['order']
    scope.run(() => {
      const result = useSortableOrder(() => ids.value, { storageKey: 'test:order' })
      order = result.order
    })
    expect(order!.value).toEqual(['a', 'b'])

    ids.value = ['a', 'b', 'c']
    await nextTick()
    expect(order!.value).toContain('c')
  })

  it('removes deleted items from order', async () => {
    localStorage.setItem('test:order', JSON.stringify(['a', 'b', 'c']))
    const ids = ref(['a', 'b', 'c'])
    let order: ReturnType<typeof useSortableOrder>['order']
    scope.run(() => {
      const result = useSortableOrder(() => ids.value, { storageKey: 'test:order' })
      order = result.order
    })

    ids.value = ['a', 'c']
    await nextTick()
    expect(order!.value).not.toContain('b')
    expect(order!.value).toEqual(['a', 'c'])
  })

  it('exposes drag state refs', () => {
    scope.run(() => {
      const { dragSourceId, dragOverId, dropEdge } = useSortableOrder(() => [], {
        storageKey: 'test:order',
      })
      expect(dragSourceId.value).toBe(null)
      expect(dragOverId.value).toBe(null)
      expect(dropEdge.value).toBe(null)
    })
  })

  it('resets drag state on onDragEnd', () => {
    scope.run(() => {
      const { dragSourceId, dragOverId, dropEdge, onDragEnd } = useSortableOrder(() => ['a', 'b'], {
        storageKey: 'test:order',
      })
      dragSourceId.value = 'a'
      dragOverId.value = 'b'
      dropEdge.value = 'before'

      onDragEnd()
      expect(dragSourceId.value).toBe(null)
      expect(dragOverId.value).toBe(null)
      expect(dropEdge.value).toBe(null)
    })
  })
})
