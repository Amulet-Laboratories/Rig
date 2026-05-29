<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Whether playback is active */
    playing?: boolean
    /** Current time in seconds */
    currentTime?: number
    /** Total duration in seconds */
    duration?: number
    /** Playback speed (1 = normal) */
    speed?: number
    /** Whether loop is enabled */
    loop?: boolean
    /** Whether to show speed control */
    showSpeed?: boolean
  }>(),
  {
    playing: false,
    currentTime: 0,
    duration: 100,
    speed: 1,
    loop: false,
    showSpeed: false,
  },
)

/**
 * @emits play
 * @emits pause
 * @emits seek
 * @emits speed-change
 */
const emit = defineEmits<{
  play: []
  pause: []
  seek: [time: number]
  'speed-change': [speed: number]
}>()

const progress = computed(() => (props.currentTime / (props.duration || 1)) * 100)

const speeds = [0.5, 1, 1.5, 2]
const currentSpeedIndex = ref(speeds.indexOf(props.speed) >= 0 ? speeds.indexOf(props.speed) : 1)

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function togglePlay() {
  if (props.playing) emit('pause')
  else emit('play')
}

function skipBack() {
  emit('seek', Math.max(0, props.currentTime - 10))
}

function skipForward() {
  emit('seek', Math.min(props.duration, props.currentTime + 10))
}

function cycleSpeed() {
  currentSpeedIndex.value = (currentSpeedIndex.value + 1) % speeds.length
  emit('speed-change', speeds[currentSpeedIndex.value]!)
}

function onTrackClick(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  emit('seek', Math.max(0, Math.min(props.duration, ratio * props.duration)))
}
</script>

<template>
  <div
    data-rig-playback-controls
    :data-playing="playing || undefined"
    role="group"
    aria-label="Playback controls"
    tabindex="0"
    @keydown.stop
  >
    <div data-rig-playback-controls-buttons>
      <button
        type="button"
        data-rig-playback-controls-skip-back
        aria-label="Skip back 10 seconds"
        @click="skipBack"
      >
        ⏪
      </button>
      <button
        type="button"
        data-rig-playback-controls-play
        :aria-label="playing ? 'Pause' : 'Play'"
        @click="togglePlay"
      >
        {{ playing ? '⏸' : '▶' }}
      </button>
      <button
        type="button"
        data-rig-playback-controls-skip-forward
        aria-label="Skip forward 10 seconds"
        @click="skipForward"
      >
        ⏩
      </button>
      <button
        v-if="showSpeed"
        type="button"
        data-rig-playback-controls-speed
        :aria-label="`Speed: ${speeds[currentSpeedIndex]}x`"
        @click="cycleSpeed"
      >
        {{ speeds[currentSpeedIndex] }}x
      </button>
    </div>
    <div data-rig-playback-controls-track @click="onTrackClick">
      <div data-rig-playback-controls-progress :style="{ width: `${progress}%` }" />
    </div>
    <div data-rig-playback-controls-time>
      <span data-rig-playback-controls-current>{{ formatTime(currentTime) }}</span>
      <span data-rig-playback-controls-separator>/</span>
      <span data-rig-playback-controls-duration>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>
