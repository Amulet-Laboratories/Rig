import { ref, provide, inject, type Ref } from 'vue'
import { DragDropKey, type DragDropController } from '../injection-keys'

// ─── Types ─────────────────────────────────────────────────────────────

export interface DragItem<T = unknown> {
  /** The source container identifier */
  sourceId: string
  /** Index within the source container */
  sourceIndex: number
  /** The data payload being dragged */
  data: T
}

export interface DropResult<T = unknown> {
  /** The item that was dropped */
  item: DragItem<T>
  /** The target container identifier */
  targetId: string
  /** Index within the target container */
  targetIndex: number
}

export interface DragOptions {
  /** Called when a drag starts */
  onDragStart?: (item: DragItem) => void
  /** Called when an item is dragged over a drop zone */
  onDragOver?: (item: DragItem, targetId: string, targetIndex: number) => void
  /** Called when an item is dropped */
  onDrop?: (result: DropResult) => void
  /** Called when a drag is cancelled */
  onDragEnd?: () => void
}

// ─── Composable ────────────────────────────────────────────────────────

/**
 * Provides drag-and-drop state management via the DragDropKey injection.
 *
 * Call `provideDragDrop()` at the root of a drag-and-drop region to set up
 * the controller. Child components use `useDragDrop()` to access it.
 *
 * Wraps native HTML5 drag events with reactive state for Vue integration.
 */
export function provideDragDrop(options: DragOptions = {}): DragDropController & {
  currentItem: Ref<DragItem | null>
  dropTargetId: Ref<string | null>
  dropTargetIndex: Ref<number>
  dragAttributes: (sourceId: string, index: number, data: unknown) => Record<string, unknown>
  dropZoneHandlers: (targetId: string, getIndex: (e: DragEvent) => number) => Record<string, unknown>
  handleDrop: (targetId: string, targetIndex: number) => void
} {
  const isDragging = ref(false)
  const dragData = ref<unknown>(null)
  const currentItem = ref<DragItem | null>(null)
  const dropTargetId = ref<string | null>(null)
  const dropTargetIndex = ref(0)

  function startDrag(data: unknown) {
    isDragging.value = true
    dragData.value = data
  }

  function endDrag() {
    isDragging.value = false
    dragData.value = null
    currentItem.value = null
    dropTargetId.value = null
    dropTargetIndex.value = 0
    options.onDragEnd?.()
  }

  /**
   * Returns HTML attributes + event handlers to make an element draggable.
   */
  function dragAttributes(
    sourceId: string,
    index: number,
    data: unknown,
  ): Record<string, unknown> {
    return {
      draggable: true,
      onDragstart: (e: DragEvent) => {
        const item: DragItem = { sourceId, sourceIndex: index, data }
        currentItem.value = item
        startDrag(data)
        options.onDragStart?.(item)

        // Set minimal transfer data for native DnD to work
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', '')
        }
      },
      onDragend: () => {
        endDrag()
      },
    }
  }

  /**
   * Returns event handlers for a container that accepts drops.
   * `getIndex` converts the mouse position to the target insertion index.
   */
  function dropZoneHandlers(
    targetId: string,
    getIndex: (e: DragEvent) => number,
  ): Record<string, unknown> {
    return {
      onDragover: (e: DragEvent) => {
        e.preventDefault()
        if (!currentItem.value) return
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
        const idx = getIndex(e)
        dropTargetId.value = targetId
        dropTargetIndex.value = idx
        options.onDragOver?.(currentItem.value, targetId, idx)
      },
      onDragleave: (e: DragEvent) => {
        // Only clear if leaving the container (not entering a child)
        const related = e.relatedTarget as HTMLElement | null
        const target = e.currentTarget as HTMLElement
        if (related && target.contains(related)) return
        if (dropTargetId.value === targetId) {
          dropTargetId.value = null
        }
      },
      onDrop: (e: DragEvent) => {
        e.preventDefault()
        const idx = getIndex(e)
        handleDrop(targetId, idx)
      },
    }
  }

  function handleDrop(targetId: string, targetIndex: number) {
    if (!currentItem.value) return
    const result: DropResult = {
      item: { ...currentItem.value },
      targetId,
      targetIndex,
    }
    options.onDrop?.(result)
    endDrag()
  }

  const controller: DragDropController = {
    isDragging,
    dragData,
    startDrag,
    endDrag,
  }

  provide(DragDropKey, controller)

  return {
    ...controller,
    currentItem,
    dropTargetId,
    dropTargetIndex,
    dragAttributes,
    dropZoneHandlers,
    handleDrop,
  }
}

/**
 * Access the DragDropController from an ancestor that called `provideDragDrop()`.
 * Falls back to a no-op controller if none is provided.
 */
export function useDragDrop(): DragDropController {
  const fallback: DragDropController = {
    isDragging: ref(false),
    dragData: ref(null),
    startDrag: () => {},
    endDrag: () => {},
  }
  return inject(DragDropKey, fallback)
}
