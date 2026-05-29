<script setup lang="ts">
/**
 * ReadingProgress — Scroll progress indicator for long-form content.
 *
 * Renders a horizontal progress bar that fills based on vertical scroll
 * position. Designed for article pages to show reading progress.
 *
 * Uses passive scroll listeners for performance.
 * Includes proper ARIA progressbar attributes.
 *
 * Slots:
 *   (none — purely visual)
 */
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
let onScroll: (() => void) | null = null

onMounted(() => {
  onScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    progress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  if (onScroll) {
    window.removeEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <div
    data-rig-reading-progress
    role="progressbar"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Reading progress"
  >
    <div data-rig-reading-progress-bar :style="{ width: `${progress}%` }" />
  </div>
</template>
