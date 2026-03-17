<script setup lang="ts">
import { ref } from 'vue'
import type { Orientation } from '../types'

const props = withDefaults(
  defineProps<{
    /** Resizer orientation */
    orientation?: Orientation
    /** Minimum position constraint */
    minPosition?: number
    /** Maximum position constraint */
    maxPosition?: number
    /** Current split position (0–100) for aria-valuenow — pass from parent */
    valuenow?: number
    /** Minimum split position for aria-valuemin */
    valuemin?: number
    /** Maximum split position for aria-valuemax */
    valuemax?: number
  }>(),
  {
    orientation: 'horizontal',
    valuenow: 50,
    valuemin: 0,
    valuemax: 100,
  },
)

const emit = defineEmits<{
  drag: [payload: { delta: number; position: number }]
  dragstart: []
  dragend: []
  /** Emitted on double-click — consumers can reset to default size */
  reset: []
}>()

defineSlots<{
  default(props: Record<string, never>): unknown
}>()

const KEYBOARD_STEP = 10

const dragging = ref(false)
let startPos = 0

function onKeydown(e: KeyboardEvent) {
  const isHorizontal = props.orientation === 'horizontal'
  let delta = 0

  switch (e.key) {
    case 'ArrowRight':
      if (isHorizontal) delta = KEYBOARD_STEP
      break
    case 'ArrowLeft':
      if (isHorizontal) delta = -KEYBOARD_STEP
      break
    case 'ArrowDown':
      if (!isHorizontal) delta = KEYBOARD_STEP
      break
    case 'ArrowUp':
      if (!isHorizontal) delta = -KEYBOARD_STEP
      break
    default:
      return
  }

  if (delta !== 0) {
    e.preventDefault()
    emit('dragstart')
    emit('drag', { delta, position: 0 })
    emit('dragend')
  }
}

function onPointerDown(e: PointerEvent) {
  e.preventDefault()
  dragging.value = true
  startPos = props.orientation === 'horizontal' ? e.clientX : e.clientY

  const el = e.target as HTMLElement
  el.setPointerCapture(e.pointerId)

  emit('dragstart')

  function onPointerMove(me: PointerEvent) {
    const currentPos = props.orientation === 'horizontal' ? me.clientX : me.clientY
    const delta = currentPos - startPos

    let position = currentPos
    if (props.minPosition !== undefined) position = Math.max(position, props.minPosition)
    if (props.maxPosition !== undefined) position = Math.min(position, props.maxPosition)

    emit('drag', { delta, position })
  }

  function onPointerUp() {
    dragging.value = false
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    emit('dragend')
  }

  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerUp)
}
</script>

<template>
  <div
    data-rig-resizer
    role="separator"
    :aria-orientation="orientation"
    :aria-valuemin="valuemin"
    :aria-valuemax="valuemax"
    :aria-valuenow="valuenow"
    :data-orientation="orientation"
    :data-dragging="dragging || undefined"
    tabindex="0"
    @pointerdown="onPointerDown"
    @dblclick="emit('reset')"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
