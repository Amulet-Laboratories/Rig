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

defineSlots<{
  'icon'(props: Record<string, never>): unknown
  default(props: Record<string, never>): unknown
  'indicator'(props: Record<string, never>): unknown
  'close'(props: Record<string, never>): unknown
}>()
</script>

<template>
  <div
    data-rig-editor-tab
    role="tab"
    :aria-selected="active"
    :data-state="active ? 'active' : 'inactive'"
    :data-dirty="tab.dirty || undefined"
    :data-pinned="tab.pinned || undefined"
    :draggable="draggable"
    :tabindex="active ? 0 : -1"
    @click="emit('activate')"
    @keydown.enter.prevent="emit('activate')"
    @keydown.space.prevent="emit('activate')"
    @keydown.delete="tab.closable !== false && emit('close')"
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
      <span
        v-if="tab.closable !== false"
        data-rig-editor-tab-close
        role="button"
        aria-label="Close"
        tabindex="0"
        @click.stop="emit('close')"
        @keydown.enter.stop.prevent="emit('close')"
      >
        &times;
      </span>
    </slot>
  </div>
</template>
