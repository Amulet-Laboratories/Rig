<script setup lang="ts">
import { computed } from 'vue'
import { Resizer } from '@core/primitives'

const props = withDefaults(
  defineProps<{
    /** Whether the panel is open */
    open?: boolean
    /** Which edge the panel slides from */
    position?: 'bottom' | 'right' | 'left'
    /** Whether the panel edge is resizable */
    resizable?: boolean
    /** Minimum size in pixels */
    minSize?: number
    /** Maximum size in pixels */
    maxSize?: number
    /** Current size in pixels */
    size?: number
  }>(),
  {
    open: false,
    position: 'bottom',
    resizable: true,
    minSize: 100,
    size: 200,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:size': [value: number]
}>()

defineSlots<{
  'header'?(props: Record<string, never>): unknown
  default?(props: Record<string, never>): unknown
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('update:open', false)
  }
}

function onResize(payload: { delta: number }) {
  const isVertical = props.position === 'bottom'
  // For bottom panel: drag up = negative delta = bigger panel
  // For left panel: drag right = positive delta = bigger panel
  // For right panel: drag left = negative delta = bigger panel
  const multiplier = props.position === 'left' ? 1 : -1
  const factor = isVertical ? -1 : multiplier
  let newSize = props.size + payload.delta * factor
  newSize = Math.max(props.minSize, newSize)
  if (props.maxSize) newSize = Math.min(props.maxSize, newSize)
  emit('update:size', newSize)
}

const resizerOrientation = computed(() => (props.position === 'bottom' ? 'vertical' : 'horizontal'))

const sizeProperty = computed(() => (props.position === 'bottom' ? 'height' : 'width'))
</script>

<template>
  <div
    v-show="open"
    data-rig-panel
    role="region"
    aria-label="Panel"
    tabindex="-1"
    :data-position="position"
    :data-state="open ? 'open' : 'closed'"
    :style="{ [sizeProperty]: `${size}px` }"
    @keydown="onKeydown"
  >
    <Resizer v-if="resizable" :orientation="resizerOrientation" @drag="onResize" />
    <div data-rig-panel-header>
      <slot name="header" />
    </div>
    <div data-rig-panel-content>
      <slot />
    </div>
  </div>
</template>
