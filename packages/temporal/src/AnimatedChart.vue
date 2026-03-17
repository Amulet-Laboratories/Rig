<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useReducedMotion } from '@core/composables'

export interface AnimatedChartFrame {
  label: string
  data: number[]
}

const props = withDefaults(
  defineProps<{
    /** Frames of animation data */
    frames?: AnimatedChartFrame[]
    /** Width */
    width?: number
    /** Height */
    height?: number
    /** Auto-play speed in ms per frame */
    speed?: number
    /** Whether to auto-play */
    autoPlay?: boolean
    /** Chart type */
    type?: 'bar' | 'line'
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    frames: () => [],
    width: 400,
    height: 300,
    speed: 500,
    autoPlay: false,
    type: 'bar',
    responsive: false,
  },
)

/**
 * @emits frame-change
 */
const emit = defineEmits<{
  'frame-change': [index: number]
}>()

const currentFrame = ref(0)
const prefersReducedMotion = useReducedMotion()
const isPlaying = ref(props.autoPlay && !prefersReducedMotion.value)
let timer: ReturnType<typeof setInterval> | null = null

const frame = computed(() => props.frames[currentFrame.value])
const maxValue = computed(() => {
  if (!frame.value) return 1
  return Math.max(...frame.value.data, 1)
})

const padding = { top: 20, right: 20, bottom: 40, left: 20 }
const innerWidth = computed(() => props.width - padding.left - padding.right)
const innerHeight = computed(() => props.height - padding.top - padding.bottom)

const bars = computed(() => {
  if (!frame.value || props.type !== 'bar') return []
  const gap = 4
  const barWidth =
    (innerWidth.value - (frame.value.data.length - 1) * gap) / frame.value.data.length
  return frame.value.data.map((v, i) => {
    const h = (v / maxValue.value) * innerHeight.value
    return {
      x: padding.left + i * (barWidth + gap),
      y: padding.top + innerHeight.value - h,
      width: barWidth,
      height: h,
    }
  })
})

const linePath = computed(() => {
  if (!frame.value || props.type !== 'line') return ''
  return frame.value.data
    .map((v, i) => {
      const x = padding.left + (i / Math.max(frame.value!.data.length - 1, 1)) * innerWidth.value
      const y = padding.top + ((maxValue.value - v) / maxValue.value) * innerHeight.value
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
})

function play() {
  if (isPlaying.value || prefersReducedMotion.value) return
  isPlaying.value = true
}

function pause() {
  isPlaying.value = false
}

function goToFrame(index: number) {
  currentFrame.value = Math.max(0, Math.min(index, props.frames.length - 1))
  emit('frame-change', currentFrame.value)
}

function startTimer() {
  stopTimer()
  timer = setInterval(() => {
    const next = (currentFrame.value + 1) % props.frames.length
    goToFrame(next)
  }, props.speed)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(isPlaying, (val) => {
  if (val) startTimer()
  else stopTimer()
})

watch(
  () => props.autoPlay,
  (val) => {
    isPlaying.value = val
  },
)

onBeforeUnmount(() => stopTimer())
</script>

<template>
  <div
    data-rig-animated-chart
    :data-type="type"
    role="figure"
    aria-label="Animated chart"
    tabindex="0"
    @keydown.stop
  >
    <svg
      data-rig-animated-chart-canvas
      :width="responsive ? undefined : width"
      :height="responsive ? undefined : height"
      :viewBox="`0 0 ${width} ${height}`"
    >
      <template v-if="type === 'bar'">
        <rect
          v-for="(bar, i) in bars"
          :key="i"
          data-rig-animated-chart-bar
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          fill="currentColor"
        />
      </template>
      <template v-else>
        <path
          data-rig-animated-chart-line
          :d="linePath"
          fill="none"
          stroke="currentColor"
          :stroke-width="'var(--rig-chart-stroke-width, 2)'"
        />
      </template>
    </svg>
    <div data-rig-animated-chart-controls>
      <button
        type="button"
        data-rig-animated-chart-play
        :aria-label="isPlaying ? 'Pause' : 'Play'"
        @click="isPlaying ? pause() : play()"
      >
        {{ isPlaying ? '⏸' : '▶' }}
      </button>
      <span v-if="frame" data-rig-animated-chart-label>{{ frame.label }}</span>
      <span data-rig-animated-chart-counter>{{ currentFrame + 1 }} / {{ frames.length }}</span>
    </div>
  </div>
</template>
