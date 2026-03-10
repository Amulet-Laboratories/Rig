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
  }>(),
  {
    orientation: 'horizontal',
  },
)

const emit = defineEmits<{
  drag: [payload: { delta: number; position: number }]
  dragstart: []
  dragend: []
}>()

const dragging = ref(false)
let startPos = 0

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
    startPos = currentPos
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
    :data-orientation="orientation"
    :data-dragging="dragging || undefined"
    tabindex="0"
    @pointerdown="onPointerDown"
  >
    <slot />
  </div>
</template>
