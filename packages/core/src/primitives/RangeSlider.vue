<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Current range value [start, end] */
    modelValue?: [number, number]
    /** Step increment */
    step?: number
    /** Whether the slider is disabled */
    disabled?: boolean
  }>(),
  {
    min: 0,
    max: 100,
    modelValue: () => [25, 75],
    step: 1,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: [number, number]]
}>()

const trackRef = ref<HTMLElement | null>(null)
const dragging = ref<'start' | 'end' | null>(null)

const percentage = computed(() => {
  const range = props.max - props.min
  if (range === 0) return { start: 0, end: 100 }
  return {
    start: ((props.modelValue[0] - props.min) / range) * 100,
    end: ((props.modelValue[1] - props.min) / range) * 100,
  }
})

function clamp(val: number): number {
  return Math.min(props.max, Math.max(props.min, val))
}

function snap(val: number): number {
  return Math.round(val / props.step) * props.step
}

function getValueFromEvent(e: MouseEvent | TouchEvent): number {
  if (!trackRef.value) return props.min
  const rect = trackRef.value.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0]!.clientX : e.clientX
  const ratio = (clientX - rect.left) / rect.width
  return snap(clamp(props.min + ratio * (props.max - props.min)))
}

function onPointerDown(e: MouseEvent, handle: 'start' | 'end') {
  if (props.disabled) return
  e.preventDefault()
  dragging.value = handle
  document.addEventListener('mousemove', onPointerMove)
  document.addEventListener('mouseup', onPointerUp)
}

function onPointerMove(e: MouseEvent) {
  if (!dragging.value) return
  const val = getValueFromEvent(e)
  const [start, end] = props.modelValue
  if (dragging.value === 'start') {
    emit('update:modelValue', [Math.min(val, end), end])
  } else {
    emit('update:modelValue', [start, Math.max(val, start)])
  }
}

function onPointerUp() {
  dragging.value = null
  document.removeEventListener('mousemove', onPointerMove)
  document.removeEventListener('mouseup', onPointerUp)
}

function onKeydown(e: KeyboardEvent, handle: 'start' | 'end') {
  if (props.disabled) return
  const delta = e.shiftKey ? props.step * 10 : props.step
  const [start, end] = props.modelValue

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      e.preventDefault()
      if (handle === 'start') {
        emit('update:modelValue', [Math.min(start + delta, end), end])
      } else {
        emit('update:modelValue', [start, Math.min(end + delta, props.max)])
      }
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      e.preventDefault()
      if (handle === 'start') {
        emit('update:modelValue', [Math.max(start - delta, props.min), end])
      } else {
        emit('update:modelValue', [start, Math.max(end - delta, start)])
      }
      break
    case 'Home':
      e.preventDefault()
      if (handle === 'start') {
        emit('update:modelValue', [props.min, end])
      }
      break
    case 'End':
      e.preventDefault()
      if (handle === 'end') {
        emit('update:modelValue', [start, props.max])
      }
      break
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onPointerMove)
  document.removeEventListener('mouseup', onPointerUp)
})
</script>

<template>
  <div
    data-rig-range-slider
    :data-disabled="disabled || undefined"
    role="group"
    aria-label="Range slider"
  >
    <div ref="trackRef" data-rig-range-slider-track>
      <div
        data-rig-range-slider-fill
        :style="{
          left: `${percentage.start}%`,
          width: `${percentage.end - percentage.start}%`,
        }"
      />
      <div
        data-rig-range-slider-thumb
        role="slider"
        tabindex="0"
        :aria-valuenow="modelValue[0]"
        :aria-valuemin="min"
        :aria-valuemax="modelValue[1]"
        aria-label="Range start"
        :style="{ left: `${percentage.start}%` }"
        :data-state="dragging === 'start' ? 'dragging' : undefined"
        @keydown="onKeydown($event, 'start')"
        @mousedown="onPointerDown($event, 'start')"
      />
      <div
        data-rig-range-slider-thumb
        role="slider"
        tabindex="0"
        :aria-valuenow="modelValue[1]"
        :aria-valuemin="modelValue[0]"
        :aria-valuemax="max"
        aria-label="Range end"
        :style="{ left: `${percentage.end}%` }"
        :data-state="dragging === 'end' ? 'dragging' : undefined"
        @keydown="onKeydown($event, 'end')"
        @mousedown="onPointerDown($event, 'end')"
      />
    </div>
  </div>
</template>
