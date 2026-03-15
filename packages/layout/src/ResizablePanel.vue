<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Direction of the resize handle */
    direction?: 'horizontal' | 'vertical'
    /** Minimum size in pixels */
    minSize?: number
    /** Maximum size in pixels */
    maxSize?: number
    /** Initial size in pixels */
    initialSize?: number
    /** Whether resizing is disabled */
    disabled?: boolean
  }>(),
  {
    direction: 'horizontal',
    minSize: 100,
    maxSize: Infinity,
    initialSize: 300,
    disabled: false,
  },
)

const emit = defineEmits<{
  resize: [size: number]
}>()

const panelRef = ref<HTMLElement | null>(null)
const size = ref(props.initialSize)
const isDragging = ref(false)
const startPos = ref(0)
const startSize = ref(0)

const panelStyle = computed(() => {
  const dimension = props.direction === 'horizontal' ? 'width' : 'height'
  return { [dimension]: `${size.value}px` }
})

function clamp(value: number): number {
  return Math.min(Math.max(value, props.minSize), props.maxSize)
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  isDragging.value = true
  startPos.value = props.direction === 'horizontal' ? e.clientX : e.clientY
  startSize.value = size.value
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  e.preventDefault()
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  const currentPos = props.direction === 'horizontal' ? e.clientX : e.clientY
  const delta = currentPos - startPos.value
  size.value = clamp(startSize.value + delta)
  emit('resize', size.value)
}

function onPointerUp() {
  isDragging.value = false
}

function onKeyDown(e: KeyboardEvent) {
  if (props.disabled) return
  const step = e.shiftKey ? 50 : 10
  if (
    (props.direction === 'horizontal' && e.key === 'ArrowRight') ||
    (props.direction === 'vertical' && e.key === 'ArrowDown')
  ) {
    e.preventDefault()
    size.value = clamp(size.value + step)
    emit('resize', size.value)
  } else if (
    (props.direction === 'horizontal' && e.key === 'ArrowLeft') ||
    (props.direction === 'vertical' && e.key === 'ArrowUp')
  ) {
    e.preventDefault()
    size.value = clamp(size.value - step)
    emit('resize', size.value)
  } else if (e.key === 'Home') {
    e.preventDefault()
    size.value = props.minSize
    emit('resize', size.value)
  } else if (e.key === 'End') {
    e.preventDefault()
    size.value = props.maxSize === Infinity ? size.value : props.maxSize
    emit('resize', size.value)
  }
}

onMounted(() => {
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
})
</script>

<template>
  <div
    ref="panelRef"
    data-rig-resizable-panel
    :data-direction="direction"
    :data-disabled="disabled || undefined"
    :data-dragging="isDragging || undefined"
    :style="panelStyle"
  >
    <div data-rig-resizable-panel-content>
      <slot />
    </div>
    <div
      data-rig-resizable-panel-handle
      role="separator"
      :aria-orientation="direction"
      :aria-valuenow="size"
      :aria-valuemin="minSize"
      :aria-valuemax="maxSize === Infinity ? undefined : maxSize"
      :tabindex="disabled ? -1 : 0"
      @pointerdown="onPointerDown"
      @keydown="onKeyDown"
    />
  </div>
</template>
