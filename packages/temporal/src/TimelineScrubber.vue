<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Current value */
    modelValue?: number
    /** Step increment */
    step?: number
    /** Width of the scrubber */
    width?: number
    /** Height of the scrubber */
    height?: number
    /** Whether the scrubber is disabled */
    disabled?: boolean
    /** Format function for the value display */
    formatValue?: (value: number) => string
  }>(),
  {
    min: 0,
    max: 100,
    modelValue: 0,
    step: 1,
    width: 400,
    height: 48,
    disabled: false,
    formatValue: (v: number) => String(v),
  },
)

/**
 * @emits update:modelValue
 * @emits scrub
 */
const emit = defineEmits<{
  'update:modelValue': [value: number]
  scrub: [value: number]
}>()

const isDragging = ref(false)
const trackRef = ref<HTMLElement | null>(null)

const progress = computed(() => (props.modelValue - props.min) / (props.max - props.min || 1))

function clamp(value: number): number {
  const stepped = Math.round(value / props.step) * props.step
  return Math.min(Math.max(stepped, props.min), props.max)
}

function getValueFromX(clientX: number): number {
  if (!trackRef.value) return props.min
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return clamp(props.min + ratio * (props.max - props.min))
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  isDragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  const value = getValueFromX(e.clientX)
  emit('update:modelValue', value)
  emit('scrub', value)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  const value = getValueFromX(e.clientX)
  emit('update:modelValue', value)
  emit('scrub', value)
}

function onPointerUp() {
  isDragging.value = false
}

function onKeyDown(e: KeyboardEvent) {
  if (props.disabled) return
  const step = e.shiftKey ? props.step * 10 : props.step
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    emit('update:modelValue', clamp(props.modelValue + step))
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    emit('update:modelValue', clamp(props.modelValue - step))
  } else if (e.key === 'Home') {
    e.preventDefault()
    emit('update:modelValue', props.min)
  } else if (e.key === 'End') {
    e.preventDefault()
    emit('update:modelValue', props.max)
  }
}
</script>

<template>
  <div
    data-rig-timeline-scrubber
    :data-disabled="disabled || undefined"
    :data-dragging="isDragging || undefined"
    :style="{ width: `${width}px`, height: `${height}px` }"
    role="slider"
    :aria-valuenow="modelValue"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-label="'Timeline scrubber'"
    :tabindex="disabled ? -1 : 0"
    @keydown="onKeyDown"
  >
    <div
      ref="trackRef"
      data-rig-timeline-scrubber-track
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    >
      <div data-rig-timeline-scrubber-fill :style="{ width: `${progress * 100}%` }" />
      <div data-rig-timeline-scrubber-thumb :style="{ left: `${progress * 100}%` }" />
    </div>
    <div data-rig-timeline-scrubber-value>{{ formatValue(modelValue) }}</div>
  </div>
</template>
