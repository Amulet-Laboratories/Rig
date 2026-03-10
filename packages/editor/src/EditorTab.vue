<script setup lang="ts">
import type { TabItem } from '@core/types'

withDefaults(
  defineProps<{
    /** Tab data */
    tab: TabItem
    /** Whether this tab is currently active */
    active?: boolean
    /** Whether this tab can be dragged to reorder */
    draggable?: boolean
  }>(),
  {
    active: false,
    draggable: true,
  },
)

const emit = defineEmits<{
  close: []
  activate: []
  pin: []
  dragstart: []
  dragend: []
}>()
</script>

<template>
  <button
    data-rig-editor-tab
    role="tab"
    :aria-selected="active"
    :data-state="active ? 'active' : 'inactive'"
    :data-dirty="tab.dirty || undefined"
    :data-pinned="tab.pinned || undefined"
    :draggable="draggable"
    @click="emit('activate')"
    @mousedown.middle.prevent="tab.closable !== false && emit('close')"
    @dragstart="emit('dragstart')"
    @dragend="emit('dragend')"
  >
    <slot name="icon" />
    <slot>
      <span data-rig-editor-tab-label>{{ tab.label }}</span>
    </slot>
    <slot name="indicator">
      <span v-if="tab.dirty" data-rig-editor-tab-dirty aria-label="Unsaved changes" />
    </slot>
    <slot name="close">
      <button
        v-if="tab.closable !== false"
        data-rig-editor-tab-close
        aria-label="Close"
        tabindex="-1"
        @click.stop="emit('close')"
      >
        &times;
      </button>
    </slot>
  </button>
</template>
