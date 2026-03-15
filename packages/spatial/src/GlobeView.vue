<script setup lang="ts">
import { ref, computed } from 'vue'

export interface GlobeMarker {
  id: string
  lat: number
  lng: number
  label?: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Size of the globe (diameter) */
    size?: number
    /** Rotation on Y axis (longitude) in degrees */
    rotationY?: number
    /** Rotation on X axis (latitude) in degrees */
    rotationX?: number
    /** Markers to display */
    markers?: GlobeMarker[]
    /** Whether to show grid lines */
    showGrid?: boolean
  }>(),
  {
    size: 300,
    rotationY: 0,
    rotationX: 0,
    markers: () => [],
    showGrid: true,
  },
)

const emit = defineEmits<{
  'marker-click': [marker: GlobeMarker]
  rotate: [payload: { rotationX: number; rotationY: number }]
}>()

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const radius = computed(() => props.size / 2 - 10)
const center = computed(() => props.size / 2)

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

function project(lat: number, lng: number) {
  const phi = toRad(lat)
  const lambda = toRad(lng - props.rotationY)
  const cosRotX = Math.cos(toRad(props.rotationX))
  const sinRotX = Math.sin(toRad(props.rotationX))

  const x = Math.cos(phi) * Math.sin(lambda)
  const y = Math.sin(phi) * cosRotX - Math.cos(phi) * Math.cos(lambda) * sinRotX
  const z = Math.sin(phi) * sinRotX + Math.cos(phi) * Math.cos(lambda) * cosRotX

  return {
    x: center.value + x * radius.value,
    y: center.value - y * radius.value,
    visible: z > 0,
  }
}

const gridLines = computed(() => {
  if (!props.showGrid) return []
  const lines: string[] = []
  // Longitude lines
  for (let lng = -180; lng < 180; lng += 30) {
    const points: string[] = []
    for (let lat = -90; lat <= 90; lat += 5) {
      const p = project(lat, lng)
      if (p.visible) points.push(`${p.x},${p.y}`)
    }
    if (points.length > 1) lines.push(`M${points.join(' L')}`)
  }
  // Latitude lines
  for (let lat = -60; lat <= 60; lat += 30) {
    const points: string[] = []
    for (let lng = -180; lng <= 180; lng += 5) {
      const p = project(lat, lng)
      if (p.visible) points.push(`${p.x},${p.y}`)
    }
    if (points.length > 1) lines.push(`M${points.join(' L')}`)
  }
  return lines
})

const visibleMarkers = computed(() =>
  props.markers
    .map((m) => {
      const p = project(m.lat, m.lng)
      return { ...m, x: p.x, y: p.y, visible: p.visible }
    })
    .filter((m) => m.visible),
)

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
  emit('rotate', {
    rotationX: props.rotationX - dy * 0.5,
    rotationY: props.rotationY + dx * 0.5,
  })
}

function onPointerUp() {
  isDragging.value = false
}
</script>

<template>
  <svg
    data-rig-globe-view
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    role="application"
    aria-label="Interactive globe"
    tabindex="0"
    @keydown.stop
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <!-- Globe outline -->
    <circle
      data-rig-globe-view-sphere
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      stroke="currentColor"
      :opacity="'var(--rig-chart-grid-opacity, 0.3)'"
    />
    <!-- Grid -->
    <path
      v-for="(line, i) in gridLines"
      :key="`grid-${i}`"
      data-rig-globe-view-grid
      :d="line"
      fill="none"
      stroke="currentColor"
      :opacity="'var(--rig-chart-grid-opacity, 0.1)'"
    />
    <!-- Markers -->
    <g
      v-for="marker in visibleMarkers"
      :key="marker.id"
      data-rig-globe-view-marker
      :transform="`translate(${marker.x}, ${marker.y})`"
      role="button"
      :aria-label="marker.label ?? `${marker.lat}, ${marker.lng}`"
      @click="emit('marker-click', marker)"
    >
      <circle :r="'var(--rig-chart-marker-radius, 4)'" :fill="marker.color ?? 'currentColor'" />
      <text
        v-if="marker.label"
        data-rig-globe-view-marker-label
        y="-8"
        text-anchor="middle"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 10)'"
      >
        {{ marker.label }}
      </text>
    </g>
  </svg>
</template>
