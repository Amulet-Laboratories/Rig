<script setup lang="ts">
import { ref } from 'vue'

export interface KanbanItem {
  id: string
  title: string
  description?: string
  tags?: string[]
}

export interface KanbanColumn {
  id: string
  label: string
  items: KanbanItem[]
}

defineProps<{
  /** Column definitions with items */
  columns?: KanbanColumn[]
}>()

const emit = defineEmits<{
  move: [payload: { itemId: string; fromColumn: string; toColumn: string; index: number }]
}>()

const dragItem = ref<{ itemId: string; columnId: string } | null>(null)

function onDragStart(itemId: string, columnId: string) {
  dragItem.value = { itemId, columnId }
}

function onDragEnd() {
  dragItem.value = null
}

function onDrop(targetColumnId: string, index: number) {
  if (!dragItem.value) return
  if (dragItem.value.columnId === targetColumnId) return
  emit('move', {
    itemId: dragItem.value.itemId,
    fromColumn: dragItem.value.columnId,
    toColumn: targetColumnId,
    index,
  })
  dragItem.value = null
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}
</script>

<template>
  <div data-rig-kanban-board role="region" aria-label="Kanban board">
    <div
      v-for="column in columns ?? []"
      :key="column.id"
      data-rig-kanban-column
      @dragover="onDragOver"
      @drop="onDrop(column.id, column.items.length)"
    >
      <div data-rig-kanban-column-header>
        <span data-rig-kanban-column-title>{{ column.label }}</span>
        <span data-rig-kanban-column-count>{{ column.items.length }}</span>
      </div>
      <div data-rig-kanban-column-items>
        <div
          v-for="item in column.items"
          :key="item.id"
          data-rig-kanban-card
          draggable="true"
          role="listitem"
          tabindex="0"
          @keydown.stop
          @dragstart="onDragStart(item.id, column.id)"
          @dragend="onDragEnd"
        >
          <div data-rig-kanban-card-title>{{ item.title }}</div>
          <div v-if="item.description" data-rig-kanban-card-description>{{ item.description }}</div>
          <div v-if="item.tags?.length" data-rig-kanban-card-tags>
            <span v-for="tag in item.tags" :key="tag" data-rig-kanban-card-tag>{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
