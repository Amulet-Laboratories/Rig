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

function onSideResize(payload: { delta: number }) {
  const newWidth = Math.max(120, props.sizes.sideWidth + payload.delta)
  emit('update:sizes', { ...props.sizes, sideWidth: newWidth })
}

function onPanelResize(payload: { delta: number }) {
  // Dragging up = negative delta = larger panel
  const newHeight = Math.max(100, props.sizes.panelHeight - payload.delta)
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
  <div data-rig-shell-grid :data-direction="direction">
    <div data-rig-shell-activity>
      <slot name="activity" />
    </div>
    <div data-rig-shell-sidebar :style="sideStyle">
      <slot name="sidebar" />
    </div>
    <Resizer
      v-if="resizable"
      orientation="horizontal"
      @drag="onSideResize"
    />
    <div data-rig-shell-editor>
      <slot name="editor" />
    </div>
    <Resizer
      v-if="resizable"
      orientation="vertical"
      @drag="onPanelResize"
    />
    <div data-rig-shell-panel :style="panelStyle">
      <slot name="panel" />
    </div>
    <div data-rig-shell-statusbar>
      <slot name="statusbar" />
    </div>
  </div>
</template>
