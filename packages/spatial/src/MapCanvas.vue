<script setup lang="ts">
import { ref, computed } from 'vue'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  label?: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Map center latitude */
    centerLat?: number
    /** Map center longitude */
    centerLng?: number
    /** Zoom level (1-20) */
    zoom?: number
    /** Width of the canvas */
    width?: number
    /** Height of the canvas */
    height?: number
    /** Markers to display */
    markers?: MapMarker[]
  }>(),
  {
    centerLat: 0,
    centerLng: 0,
    zoom: 3,
    width: 600,
    height: 400,
    markers: () => [],
  },
)

const emit = defineEmits<{
  'marker-click': [marker: MapMarker]
  pan: [payload: { lat: number; lng: number }]
  'zoom-change': [zoom: number]
}>()

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const scale = computed(() => Math.pow(2, props.zoom))

function latLngToXY(lat: number, lng: number) {
  const x = ((lng - props.centerLng) / 360) * scale.value * props.width + props.width / 2
  const y = ((props.centerLat - lat) / 180) * scale.value * props.height + props.height / 2
  return { x, y }
}

function onPointerDown(e: PointerEvent) {
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  dragStart.value = { x: e.clientX, y: e.clientY }
  const dLng = -(dx / props.width) * (360 / scale.value)
  const dLat = (dy / props.height) * (180 / scale.value)
  emit('pan', { lat: props.centerLat + dLat, lng: props.centerLng + dLng })
}

function onPointerUp() {
  isDragging.value = false
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -1 : 1
  const newZoom = Math.max(1, Math.min(20, props.zoom + delta))
  emit('zoom-change', newZoom)
}
</script>

<template>
  <div
    data-rig-map-canvas
    :data-dragging="isDragging || undefined"
    :style="{ width: `${width}px`, height: `${height}px` }"
    role="application"
    aria-label="Interactive map"
    tabindex="0"
    @keydown.stop
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @wheel.passive="onWheel"
  >
    <svg
      data-rig-map-canvas-viewport
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
    >
      <!-- Grid lines for visual reference -->
      <line
        v-for="i in 5"
        :key="`h-${i}`"
        data-rig-map-canvas-grid
        :x1="0"
        :y1="(height / 6) * i"
        :x2="width"
        :y2="(height / 6) * i"
        stroke="currentColor"
        :opacity="'var(--rig-chart-grid-opacity, 0.1)'"
      />
      <line
        v-for="i in 5"
        :key="`v-${i}`"
        data-rig-map-canvas-grid
        :x1="(width / 6) * i"
        :y1="0"
        :x2="(width / 6) * i"
        :y2="height"
        stroke="currentColor"
        :opacity="'var(--rig-chart-grid-opacity, 0.1)'"
      />
      <!-- Markers -->
      <g
        v-for="marker in markers"
        :key="marker.id"
        data-rig-map-canvas-marker
        :transform="`translate(${latLngToXY(marker.lat, marker.lng).x}, ${latLngToXY(marker.lat, marker.lng).y})`"
        role="button"
        :aria-label="marker.label ?? `Marker at ${marker.lat}, ${marker.lng}`"
        @click="emit('marker-click', marker)"
      >
        <circle :r="'var(--rig-chart-marker-radius, 6)'" :fill="marker.color ?? 'currentColor'" />
        <text
          v-if="marker.label"
          data-rig-map-canvas-marker-label
          y="-10"
          text-anchor="middle"
          fill="currentColor"
          :font-size="'var(--rig-chart-label-size, 11)'"
        >
          {{ marker.label }}
        </text>
      </g>
    </svg>
    <slot />
  </div>
</template>
