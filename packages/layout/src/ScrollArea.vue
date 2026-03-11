<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

withDefaults(
  defineProps<{
    /** Show horizontal scrollbar */
    horizontal?: boolean
    /** Show vertical scrollbar (default true) */
    vertical?: boolean
  }>(),
  {
    horizontal: false,
    vertical: true,
  },
)

const viewportRef = ref<HTMLElement | null>(null)

// Scroll metrics — updated on scroll + resize
const scrollTop = ref(0)
const scrollLeft = ref(0)
const scrollHeight = ref(0)
const scrollWidth = ref(0)
const clientHeight = ref(0)
const clientWidth = ref(0)

const thumbHeightPct = computed(() => {
  if (!scrollHeight.value) return 100
  return Math.max(10, (clientHeight.value / scrollHeight.value) * 100)
})

const thumbTopPct = computed(() => {
  const maxScroll = scrollHeight.value - clientHeight.value
  if (!maxScroll) return 0
  return (scrollTop.value / maxScroll) * (100 - thumbHeightPct.value)
})

const thumbWidthPct = computed(() => {
  if (!scrollWidth.value) return 100
  return Math.max(10, (clientWidth.value / scrollWidth.value) * 100)
})

const thumbLeftPct = computed(() => {
  const maxScroll = scrollWidth.value - clientWidth.value
  if (!maxScroll) return 0
  return (scrollLeft.value / maxScroll) * (100 - thumbWidthPct.value)
})

const hasVerticalScroll = computed(() => scrollHeight.value > clientHeight.value)
const hasHorizontalScroll = computed(() => scrollWidth.value > clientWidth.value)

/** 0-100 value representing how far the user has scrolled — used for aria-valuenow */
const verticalScrollPct = computed(() => {
  const max = scrollHeight.value - clientHeight.value
  return max > 0 ? Math.round((scrollTop.value / max) * 100) : 0
})
const horizontalScrollPct = computed(() => {
  const max = scrollWidth.value - clientWidth.value
  return max > 0 ? Math.round((scrollLeft.value / max) * 100) : 0
})

let rafId: number | null = null

function measure() {
  // Debounce via rAF to avoid forced style recalcs inside ResizeObserver
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const el = viewportRef.value
    if (!el) return
    scrollHeight.value = el.scrollHeight
    scrollWidth.value = el.scrollWidth
    clientHeight.value = el.clientHeight
    clientWidth.value = el.clientWidth
    scrollTop.value = el.scrollTop
    scrollLeft.value = el.scrollLeft
  })
}

function onScroll() {
  measure()
}

let ro: ResizeObserver | null = null

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(measure)
    if (viewportRef.value) ro.observe(viewportRef.value)
  }
})

onUnmounted(() => {
  ro?.disconnect()
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div data-rig-scroll-area>
    <div ref="viewportRef" data-rig-scroll-viewport @scroll="onScroll">
      <slot />
    </div>

    <!-- Vertical track -->
    <div
      v-if="vertical && hasVerticalScroll"
      data-rig-scroll-bar
      role="scrollbar"
      aria-orientation="vertical"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="verticalScrollPct"
      data-orientation="vertical"
    >
      <div
        data-rig-scroll-thumb
        :style="{
          height: `${thumbHeightPct}%`,
          transform: `translateY(${thumbTopPct}%)`,
        }"
      />
    </div>

    <!-- Horizontal track -->
    <div
      v-if="horizontal && hasHorizontalScroll"
      data-rig-scroll-bar
      role="scrollbar"
      aria-orientation="horizontal"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="horizontalScrollPct"
      data-orientation="horizontal"
    >
      <div
        data-rig-scroll-thumb
        :style="{
          width: `${thumbWidthPct}%`,
          transform: `translateX(${thumbLeftPct}%)`,
        }"
      />
    </div>
  </div>
</template>
