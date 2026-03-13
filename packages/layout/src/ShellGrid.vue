<script setup lang="ts">
import { computed } from 'vue'
import { Resizer } from '@core/primitives'
import type { Direction } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Text direction */
    direction?: Direction
    /** Whether gutters between areas are resizable */
    resizable?: boolean
    /** Current sizes for sidebar width and panel height */
    sizes?: { sideWidth: number; panelHeight: number }
  }>(),
  {
    direction: 'ltr',
    resizable: true,
    sizes: () => ({ sideWidth: 260, panelHeight: 200 }),
  },
)

const emit = defineEmits<{
  'update:sizes': [sizes: { sideWidth: number; panelHeight: number }]
}>()

// Snapshot sizes at drag start — apply absolute delta against these
let sideWidthAtStart = 0
let panelHeightAtStart = 0

function onSideDragStart() {
  sideWidthAtStart = props.sizes.sideWidth
}

function onSideResize(payload: { delta: number }) {
  const newWidth = Math.max(120, sideWidthAtStart + payload.delta)
  emit('update:sizes', { ...props.sizes, sideWidth: newWidth })
}

function onPanelDragStart() {
  panelHeightAtStart = props.sizes.panelHeight
}

function onPanelResize(payload: { delta: number }) {
  // Dragging up = negative delta = larger panel
  const newHeight = Math.max(100, panelHeightAtStart - payload.delta)
  emit('update:sizes', { ...props.sizes, panelHeight: newHeight })
}

const sideStyle = computed(() => ({
  width: `${props.sizes.sideWidth}px`,
}))

const panelStyle = computed(() => ({
  height: `${props.sizes.panelHeight}px`,
}))
</script>

<template>
  <div data-rig-shell-grid aria-label="Application shell" :data-direction="direction" tabindex="-1" @keydown.stop>
    <div v-if="$slots.titlebar" data-rig-shell-titlebar role="banner">
      <slot name="titlebar" />
    </div>
    <div data-rig-shell-activity role="navigation" aria-label="Activity bar">
      <slot name="activity" />
    </div>
    <div data-rig-shell-sidebar role="complementary" aria-label="Sidebar" :style="sideStyle">
      <slot name="sidebar" />
    </div>
    <Resizer v-if="resizable" orientation="horizontal" @dragstart="onSideDragStart" @drag="onSideResize" />
    <div data-rig-shell-editor role="main" aria-label="Editor">
      <slot name="editor" />
    </div>
    <Resizer v-if="resizable" orientation="vertical" @dragstart="onPanelDragStart" @drag="onPanelResize" />
    <div data-rig-shell-panel role="region" aria-label="Panel" :style="panelStyle">
      <slot name="panel" />
    </div>
    <div data-rig-shell-statusbar role="contentinfo">
      <slot name="statusbar" />
    </div>
  </div>
</template>
