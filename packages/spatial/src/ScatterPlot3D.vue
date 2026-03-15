<script setup lang="ts">
import { computed } from 'vue'

export interface ScatterPlot3DPoint {
  x: number
  y: number
  z: number
  label?: string
  color?: string
  size?: number
}

const props = withDefaults(
  defineProps<{
    /** Data points */
    data?: ScatterPlot3DPoint[]
    /** Width of the chart */
    width?: number
    /** Height of the chart */
    height?: number
    /** Rotation angle around Y axis in degrees */
    rotationY?: number
    /** Tilt angle in degrees */
    tilt?: number
  }>(),
  {
    data: () => [],
    width: 400,
    height: 400,
    rotationY: 30,
    tilt: 20,
  },
)

const emit = defineEmits<{
  'point-click': [point: ScatterPlot3DPoint, index: number]
}>()

const center = computed(() => ({ x: props.width / 2, y: props.height / 2 }))

function project(x: number, y: number, z: number) {
  const rad = (props.rotationY * Math.PI) / 180
  const tiltRad = (props.tilt * Math.PI) / 180
  const cosR = Math.cos(rad)
  const sinR = Math.sin(rad)
  const cosT = Math.cos(tiltRad)
  const sinT = Math.sin(tiltRad)

  // Rotate around Y then tilt around X
  const rx = x * cosR + z * sinR
  const ry = y * cosT - (-x * sinR + z * cosR) * sinT
  const scale = props.width / 4

  return {
    px: center.value.x + rx * scale,
    py: center.value.y - ry * scale,
  }
}

const xRange = computed(() => {
  const xs = props.data.map((d) => d.x)
  const min = Math.min(...xs, 0)
  const max = Math.max(...xs, 1)
  return { min, max, range: max - min || 1 }
})

const yRange = computed(() => {
  const ys = props.data.map((d) => d.y)
  const min = Math.min(...ys, 0)
  const max = Math.max(...ys, 1)
  return { min, max, range: max - min || 1 }
})

const zRange = computed(() => {
  const zs = props.data.map((d) => d.z)
  const min = Math.min(...zs, 0)
  const max = Math.max(...zs, 1)
  return { min, max, range: max - min || 1 }
})

const projectedPoints = computed(() =>
  props.data.map((d) => {
    const nx = ((d.x - xRange.value.min) / xRange.value.range - 0.5) * 2
    const ny = ((d.y - yRange.value.min) / yRange.value.range - 0.5) * 2
    const nz = ((d.z - zRange.value.min) / zRange.value.range - 0.5) * 2
    const p = project(nx, ny, nz)
    return {
      cx: p.px,
      cy: p.py,
      r: d.size ?? 4,
      color: d.color,
      label: d.label ?? `(${d.x}, ${d.y}, ${d.z})`,
      raw: d,
    }
  }),
)

// Draw axes
const axes = computed(() => {
  const o = project(0, 0, 0)
  const xEnd = project(1.2, 0, 0)
  const yEnd = project(0, 1.2, 0)
  const zEnd = project(0, 0, 1.2)
  return [
    { x1: o.px, y1: o.py, x2: xEnd.px, y2: xEnd.py, label: 'X' },
    { x1: o.px, y1: o.py, x2: yEnd.px, y2: yEnd.py, label: 'Y' },
    { x1: o.px, y1: o.py, x2: zEnd.px, y2: zEnd.py, label: 'Z' },
  ]
})
</script>

<template>
  <svg
    data-rig-scatter-plot-3d
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="3D scatter plot"
    tabindex="0"
    @keydown.stop
  >
    <!-- Axes -->
    <g data-rig-scatter-plot-3d-axes>
      <line
        v-for="(axis, i) in axes"
        :key="`axis-${i}`"
        data-rig-scatter-plot-3d-axis
        :x1="axis.x1"
        :y1="axis.y1"
        :x2="axis.x2"
        :y2="axis.y2"
        stroke="currentColor"
        :opacity="'var(--rig-chart-axis-opacity, 0.3)'"
      />
      <text
        v-for="(axis, i) in axes"
        :key="`label-${i}`"
        data-rig-scatter-plot-3d-axis-label
        :x="axis.x2"
        :y="axis.y2"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 11)'"
        text-anchor="middle"
      >
        {{ axis.label }}
      </text>
    </g>
    <!-- Points -->
    <circle
      v-for="(pt, i) in projectedPoints"
      :key="i"
      data-rig-scatter-plot-3d-point
      :cx="pt.cx"
      :cy="pt.cy"
      :r="pt.r"
      :fill="pt.color ?? 'currentColor'"
      :opacity="'var(--rig-chart-point-opacity, 0.8)'"
      role="graphics-symbol"
      :aria-label="pt.label"
      @click="emit('point-click', pt.raw, i)"
    />
  </svg>
</template>
