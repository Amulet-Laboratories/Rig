<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TabItem, ID } from '@core/types'

const props = defineProps<{
  /** Tabs to display */
  tabs: TabItem[]
  /** Currently active tab ID */
  activeId?: ID
}>()

const emit = defineEmits<{
  'update:activeId': [id: ID]
  close: [id: ID]
  reorder: [payload: { from: number; to: number }]
  contextmenu: [payload: { tab: TabItem; event: MouseEvent }]
}>()

const activeTab = computed(() => props.tabs.find((t) => t.id === props.activeId))

const dragFrom = ref(-1)
const dragTo = ref(-1)

function onDragStart(index: number) {
  dragFrom.value = index
}

function onDragOver(index: number, e: DragEvent) {
  e.preventDefault()
  dragTo.value = index
}

function onDrop(index: number) {
  if (dragFrom.value !== -1 && dragFrom.value !== index) {
    emit('reorder', { from: dragFrom.value, to: index })
  }
  dragFrom.value = -1
  dragTo.value = -1
}

function onDragEnd() {
  dragFrom.value = -1
  dragTo.value = -1
}
</script>

<template>
  <div data-rig-editor-workbench>
    <div data-rig-editor-workbench-tabs role="tablist">
      <slot name="tabs" :tabs="tabs" :activeId="activeId">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          data-rig-editor-tab
          role="tab"
          draggable="true"
          :aria-selected="activeId === tab.id"
          :data-state="activeId === tab.id ? 'active' : 'inactive'"
          :data-dirty="tab.dirty || undefined"
          :data-pinned="tab.pinned || undefined"
          :data-drag-over="dragTo === index || undefined"
          @click="emit('update:activeId', tab.id)"
          @contextmenu.prevent="emit('contextmenu', { tab, event: $event })"
          @mousedown.middle.prevent="tab.closable !== false && emit('close', tab.id)"
          @dragstart="onDragStart(index)"
          @dragover="onDragOver(index, $event)"
          @drop="onDrop(index)"
          @dragend="onDragEnd()"
        >
          <slot name="tab" :tab="tab" :isActive="activeId === tab.id">
            <span data-rig-editor-tab-label>{{ tab.label }}</span>
            <span v-if="tab.dirty" data-rig-editor-tab-dirty aria-label="Unsaved changes" />
            <button
              v-if="tab.closable !== false"
              data-rig-editor-tab-close
              aria-label="Close"
              tabindex="-1"
              @click.stop="emit('close', tab.id)"
            >
              &times;
            </button>
          </slot>
        </button>
      </slot>
    </div>
    <div data-rig-editor-workbench-content role="tabpanel">
      <slot v-if="tabs.length > 0" :activeTab="activeTab" />
      <slot v-else name="empty">
        <div data-rig-editor-workbench-empty />
      </slot>
    </div>
  </div>
</template>
