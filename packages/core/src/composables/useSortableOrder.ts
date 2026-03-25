// useSortableOrder — manages drag-and-drop reorder state for list items.
// Persists order to localStorage and reconciles when the source list changes.

import { ref, watch } from 'vue'

export interface SortableOrderOptions {
  /** localStorage key for persisting order */
  storageKey: string
}

function loadOrder(key: string): string[] | null {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.every((v: unknown) => typeof v === 'string')) return parsed
  } catch {
    /* ignore corrupt data */
  }
  return null
}

function saveOrder(key: string, ids: string[]): void {
  localStorage.setItem(key, JSON.stringify(ids))
}

/**
 * Manages drag-and-drop reorder state for a list of items.
 * Persists order to localStorage and reconciles when the active item list changes
 * (new items are appended, removed items are pruned).
 *
 * @param activeIds - Getter that returns the current list of IDs from the source data.
 * @param options - Configuration including the localStorage key.
 *
 * @example
 * ```ts
 * const {
 *   order, dragSourceId, dragOverId, dropEdge,
 *   onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd,
 * } = useSortableOrder(() => items.value.map(i => i.id), { storageKey: 'myapp:order' })
 * ```
 */
export function useSortableOrder(activeIds: () => string[], options: SortableOrderOptions) {
  const { storageKey } = options

  const order = ref<string[]>(loadOrder(storageKey) ?? [])
  const dragSourceId = ref<string | null>(null)
  const dragOverId = ref<string | null>(null)
  const dropEdge = ref<'before' | 'after' | null>(null)

  // Reconcile order when items change (new items appended, deleted items removed)
  watch(
    () => activeIds().join(','),
    () => {
      const knownIds = new Set(activeIds())
      const ordered = order.value.filter((id) => knownIds.has(id))
      for (const id of activeIds()) {
        if (!ordered.includes(id)) ordered.push(id)
      }
      if (ordered.join(',') !== order.value.join(',')) {
        order.value = ordered
        saveOrder(storageKey, ordered)
      }
    },
    { immediate: true },
  )

  function onDragStart(e: DragEvent, itemId: string): void {
    if (!e.dataTransfer) return
    dragSourceId.value = itemId
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', itemId)
  }

  function onDragOver(e: DragEvent, itemId: string): void {
    if (dragSourceId.value === null) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    dragOverId.value = itemId
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const pos = e.clientY - rect.top
    dropEdge.value = pos < rect.height / 2 ? 'before' : 'after'
  }

  function onDragLeave(e: DragEvent, itemId: string): void {
    const related = e.relatedTarget as Node | null
    const current = e.currentTarget as HTMLElement
    if (related && current.contains(related)) return
    if (dragOverId.value === itemId) {
      dragOverId.value = null
      dropEdge.value = null
    }
  }

  function onDrop(e: DragEvent): void {
    if (dragSourceId.value === null || dragOverId.value === null) return
    e.preventDefault()

    const ids = [...order.value]
    const fromIdx = ids.indexOf(dragSourceId.value)
    let toIdx = ids.indexOf(dragOverId.value)

    if (fromIdx === -1 || toIdx === -1) {
      resetDrag()
      return
    }
    if (dropEdge.value === 'after') toIdx += 1
    if (fromIdx < toIdx) toIdx -= 1

    if (fromIdx !== toIdx && toIdx >= 0 && toIdx < ids.length) {
      const [moved] = ids.splice(fromIdx, 1)
      if (moved) ids.splice(toIdx, 0, moved)
      order.value = ids
      saveOrder(storageKey, ids)
    }

    resetDrag()
  }

  function onDragEnd(): void {
    resetDrag()
  }

  function resetDrag(): void {
    dragSourceId.value = null
    dragOverId.value = null
    dropEdge.value = null
  }

  return {
    order,
    dragSourceId,
    dragOverId,
    dropEdge,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
  }
}
