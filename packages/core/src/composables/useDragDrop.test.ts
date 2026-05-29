import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { provideDragDrop, useDragDrop } from './useDragDrop'

/**
 * Helper to test provideDragDrop in a component context.
 * Returns a wrapper whose `vm.dd` is the return value of provideDragDrop.
 */
function createProvider(options = {}) {
  const Provider = defineComponent({
    setup() {
      const dd = provideDragDrop(options)
      return { dd }
    },
    render() {
      return h('div')
    },
  })
  return mount(Provider)
}

/**
 * Helper that mounts a provider + consumer pair.
 * Returns both wrappers.
 */
function createProviderConsumer(options = {}) {
  let consumerDD: ReturnType<typeof useDragDrop> | undefined

  const Consumer = defineComponent({
    setup() {
      consumerDD = useDragDrop()
      return { dd: consumerDD }
    },
    render() {
      return h('div')
    },
  })

  const Provider = defineComponent({
    setup() {
      const dd = provideDragDrop(options)
      return { dd }
    },
    render() {
      return h('div', [h(Consumer)])
    },
  })

  const wrapper = mount(Provider)
  return { wrapper, consumerDD: consumerDD! }
}

describe('provideDragDrop', () => {
  it('returns reactive currentItem, dropTargetId, dropTargetIndex', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd
    expect(dd.currentItem.value).toBeNull()
    expect(dd.dropTargetId.value).toBeNull()
    expect(dd.dropTargetIndex.value).toBe(0)
  })

  it('starts not dragging', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd
    expect(dd.isDragging.value).toBe(false)
    expect(dd.dragData.value).toBeNull()
  })

  it('startDrag sets isDragging and dragData', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd
    dd.startDrag({ type: 'card', id: 1 })
    expect(dd.isDragging.value).toBe(true)
    expect(dd.dragData.value).toEqual({ type: 'card', id: 1 })
  })

  it('endDrag resets all state', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd
    dd.startDrag('data')
    dd.endDrag()
    expect(dd.isDragging.value).toBe(false)
    expect(dd.dragData.value).toBeNull()
    expect(dd.currentItem.value).toBeNull()
    expect(dd.dropTargetId.value).toBeNull()
    expect(dd.dropTargetIndex.value).toBe(0)
  })

  it('dragAttributes returns draggable attributes', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd
    const attrs = dd.dragAttributes('list-a', 0, { id: 'item-1' })
    expect(attrs.draggable).toBe(true)
    expect(attrs.onDragstart).toBeTypeOf('function')
    expect(attrs.onDragend).toBeTypeOf('function')
  })

  it('dragAttributes.onDragstart sets currentItem', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd
    const attrs = dd.dragAttributes('source', 2, { id: 'x' })
    const fakeEvent = { dataTransfer: { effectAllowed: '', setData: vi.fn() } }
    attrs.onDragstart(fakeEvent)
    expect(dd.currentItem.value).toEqual({
      sourceId: 'source',
      sourceIndex: 2,
      data: { id: 'x' },
    })
    expect(dd.isDragging.value).toBe(true)
  })

  it('dropZoneHandlers returns onDragover, onDragleave, onDrop', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd
    const handlers = dd.dropZoneHandlers('zone-a', () => 0)
    expect(handlers.onDragover).toBeTypeOf('function')
    expect(handlers.onDragleave).toBeTypeOf('function')
    expect(handlers.onDrop).toBeTypeOf('function')
  })

  it('handleDrop calls onDrop callback with DropResult', () => {
    const onDrop = vi.fn()
    const wrapper = createProvider({ onDrop })
    const dd = (wrapper.vm as any).dd

    // Simulate a drag start
    const attrs = dd.dragAttributes('list-a', 1, { name: 'Card' })
    attrs.onDragstart({ dataTransfer: { effectAllowed: '', setData: vi.fn() } })

    dd.handleDrop('list-b', 3)

    expect(onDrop).toHaveBeenCalledWith({
      item: { sourceId: 'list-a', sourceIndex: 1, data: { name: 'Card' } },
      targetId: 'list-b',
      targetIndex: 3,
    })
  })

  it('onDragEnd callback fires on endDrag', () => {
    const onDragEnd = vi.fn()
    const wrapper = createProvider({ onDragEnd })
    const dd = (wrapper.vm as any).dd
    dd.startDrag('x')
    dd.endDrag()
    expect(onDragEnd).toHaveBeenCalled()
  })

  it('onDragStart callback fires during dragAttributes.onDragstart', () => {
    const onDragStart = vi.fn()
    const wrapper = createProvider({ onDragStart })
    const dd = (wrapper.vm as any).dd
    const attrs = dd.dragAttributes('src', 0, 'payload')
    attrs.onDragstart({ dataTransfer: { effectAllowed: '', setData: vi.fn() } })
    expect(onDragStart).toHaveBeenCalledWith({
      sourceId: 'src',
      sourceIndex: 0,
      data: 'payload',
    })
  })
})

describe('useDragDrop', () => {
  it('returns injected controller from provider', () => {
    const { consumerDD } = createProviderConsumer()
    expect(consumerDD.isDragging).toBeDefined()
    expect(consumerDD.startDrag).toBeTypeOf('function')
    expect(consumerDD.endDrag).toBeTypeOf('function')
  })

  it('falls back to no-op controller without provider', () => {
    const Consumer = defineComponent({
      setup() {
        const dd = useDragDrop()
        return { dd }
      },
      render() {
        return h('div')
      },
    })
    const wrapper = mount(Consumer)
    const dd = (wrapper.vm as any).dd
    expect(dd.isDragging.value).toBe(false)
    // Should not throw
    dd.startDrag('x')
    dd.endDrag()
  })

  it('shares isDragging state with provider', () => {
    const { wrapper, consumerDD } = createProviderConsumer()
    const providerDD = (wrapper.vm as any).dd
    providerDD.startDrag('data')
    expect(consumerDD.isDragging.value).toBe(true)
  })
})

describe('dropZoneHandlers', () => {
  it('onDragover sets dropTargetId and calls onDragOver callback', () => {
    const onDragOver = vi.fn()
    const wrapper = createProvider({ onDragOver })
    const dd = (wrapper.vm as any).dd

    // Start a drag first
    const attrs = dd.dragAttributes('src', 0, 'payload')
    attrs.onDragstart({ dataTransfer: { effectAllowed: '', setData: vi.fn() } })

    const handlers = dd.dropZoneHandlers('zone-a', () => 2)
    const fakeEvent = {
      preventDefault: vi.fn(),
      dataTransfer: { dropEffect: '' },
    }
    handlers.onDragover(fakeEvent)

    expect(fakeEvent.preventDefault).toHaveBeenCalled()
    expect(fakeEvent.dataTransfer.dropEffect).toBe('move')
    expect(dd.dropTargetId.value).toBe('zone-a')
    expect(dd.dropTargetIndex.value).toBe(2)
    expect(onDragOver).toHaveBeenCalledWith(
      expect.objectContaining({ sourceId: 'src', sourceIndex: 0, data: 'payload' }),
      'zone-a',
      2,
    )
  })

  it('onDragover is no-op without current item', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd

    const handlers = dd.dropZoneHandlers('zone-b', () => 0)
    const fakeEvent = {
      preventDefault: vi.fn(),
      dataTransfer: { dropEffect: '' },
    }
    handlers.onDragover(fakeEvent)

    // preventDefault still called but no state change
    expect(dd.dropTargetId.value).toBeNull()
  })

  it('onDragleave clears dropTargetId when leaving container', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd

    dd.dropTargetId.value = 'zone-a'

    const handlers = dd.dropZoneHandlers('zone-a', () => 0)
    handlers.onDragleave({
      relatedTarget: null,
      currentTarget: document.createElement('div'),
    })

    expect(dd.dropTargetId.value).toBeNull()
  })

  it('onDragleave does not clear if entering child element', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd

    dd.dropTargetId.value = 'zone-a'

    const parent = document.createElement('div')
    const child = document.createElement('span')
    parent.appendChild(child)

    const handlers = dd.dropZoneHandlers('zone-a', () => 0)
    handlers.onDragleave({
      relatedTarget: child,
      currentTarget: parent,
    })

    // Should NOT clear because child is inside parent
    expect(dd.dropTargetId.value).toBe('zone-a')
  })

  it('onDragleave ignores if dropTargetId is different', () => {
    const wrapper = createProvider()
    const dd = (wrapper.vm as any).dd

    dd.dropTargetId.value = 'zone-b'

    const handlers = dd.dropZoneHandlers('zone-a', () => 0)
    handlers.onDragleave({
      relatedTarget: null,
      currentTarget: document.createElement('div'),
    })

    // Should not change zone-b
    expect(dd.dropTargetId.value).toBe('zone-b')
  })

  it('onDrop calls handleDrop and triggers onDrop callback', () => {
    const onDrop = vi.fn()
    const wrapper = createProvider({ onDrop })
    const dd = (wrapper.vm as any).dd

    const attrs = dd.dragAttributes('list-a', 1, { name: 'Card' })
    attrs.onDragstart({ dataTransfer: { effectAllowed: '', setData: vi.fn() } })

    const handlers = dd.dropZoneHandlers('list-b', () => 3)
    const fakeEvent = { preventDefault: vi.fn() }
    handlers.onDrop(fakeEvent)

    expect(fakeEvent.preventDefault).toHaveBeenCalled()
    expect(onDrop).toHaveBeenCalledWith({
      item: { sourceId: 'list-a', sourceIndex: 1, data: { name: 'Card' } },
      targetId: 'list-b',
      targetIndex: 3,
    })
    // Should also end the drag
    expect(dd.isDragging.value).toBe(false)
  })
})

describe('handleDrop edge cases', () => {
  it('handleDrop is no-op without currentItem', () => {
    const onDrop = vi.fn()
    const wrapper = createProvider({ onDrop })
    const dd = (wrapper.vm as any).dd

    dd.handleDrop('zone', 0)
    expect(onDrop).not.toHaveBeenCalled()
  })
})

describe('dragAttributes.onDragend', () => {
  it('calls endDrag and resets state', () => {
    const onDragEnd = vi.fn()
    const wrapper = createProvider({ onDragEnd })
    const dd = (wrapper.vm as any).dd

    const attrs = dd.dragAttributes('src', 0, 'data')
    attrs.onDragstart({ dataTransfer: { effectAllowed: '', setData: vi.fn() } })
    expect(dd.isDragging.value).toBe(true)

    attrs.onDragend()
    expect(dd.isDragging.value).toBe(false)
    expect(dd.currentItem.value).toBeNull()
    expect(onDragEnd).toHaveBeenCalled()
  })
})
