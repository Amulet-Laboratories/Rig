<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Show horizontal scrollbar */
    horizontal?: boolean
    /** Show vertical scrollbar (default true) */
    vertical?: boolean
    /** Accessible label — when provided, sets role="region" on the outer container */
    ariaLabel?: string
    /** Render stepper (arrow) buttons at each end of the scrollbar */
    steppers?: boolean
    /**
     * Where the steppers sit. `split` puts one at each end, as Windows and the
     * classic Mac did; `start` and `end` group both together at one end, as
     * NeXTSTEP and Mac OS 8 did.
     */
    stepperPlacement?: 'split' | 'start' | 'end'
    /** Distance in px a stepper press or arrow key scrolls */
    step?: number
  }>(),
  {
    horizontal: false,
    vertical: true,
    steppers: false,
    stepperPlacement: 'split',
    step: 40,
  },
)

defineSlots<{
  default(props: Record<string, never>): unknown
  /** Override the stepper arrow glyphs — era skins supply their own pixel marks */
  'stepper-up'?: (props: Record<string, never>) => unknown
  'stepper-down'?: (props: Record<string, never>) => unknown
  'stepper-left'?: (props: Record<string, never>) => unknown
  'stepper-right'?: (props: Record<string, never>) => unknown
}>()

const viewportId = `rig-scroll-viewport-${useId()}`
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
  stopRepeat()
})

/* ── Thumb dragging ──────────────────────────────────────────────────────
 * Pointer capture keeps the drag alive when the cursor leaves the thumb, which
 * is what makes a scrollbar feel native rather than slippery. */

const dragging = ref<'vertical' | 'horizontal' | null>(null)

function onThumbPointerdown(e: PointerEvent, axis: 'vertical' | 'horizontal') {
  const el = viewportRef.value
  if (!el) return
  e.preventDefault()
  e.stopPropagation()

  // Bound to a non-nullable local so the move handler below keeps the narrowing
  // across the closure.
  const view: HTMLElement = el

  const thumb = e.currentTarget as HTMLElement
  // Not every environment implements pointer capture; the drag still works
  // without it, it just stops tracking if the pointer leaves the window.
  thumb.setPointerCapture?.(e.pointerId)
  dragging.value = axis

  const vertical = axis === 'vertical'
  const thumbRect = thumb.getBoundingClientRect()
  const trackRect = (thumb.parentElement as HTMLElement).getBoundingClientRect()

  // Grab offset within the thumb, so the thumb doesn't jump to centre on grab.
  const grab = vertical ? e.clientY - thumbRect.top : e.clientX - thumbRect.left
  const trackLen = vertical ? trackRect.height : trackRect.width
  const thumbLen = vertical ? thumbRect.height : thumbRect.width
  const freeTrack = trackLen - thumbLen
  const maxScroll = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth

  function onMove(ev: PointerEvent) {
    if (freeTrack <= 0) return
    const pos = vertical ? ev.clientY - trackRect.top : ev.clientX - trackRect.left
    const ratio = Math.min(1, Math.max(0, (pos - grab) / freeTrack))
    if (vertical) view.scrollTop = ratio * maxScroll
    else view.scrollLeft = ratio * maxScroll
  }

  function onUp(ev: PointerEvent) {
    dragging.value = null
    thumb.releasePointerCapture?.(ev.pointerId)
    thumb.removeEventListener('pointermove', onMove)
    thumb.removeEventListener('pointerup', onUp)
    thumb.removeEventListener('pointercancel', onUp)
  }

  thumb.addEventListener('pointermove', onMove)
  thumb.addEventListener('pointerup', onUp)
  thumb.addEventListener('pointercancel', onUp)
}

/** Clicking the trough pages toward the click, as every scrollbar has since 1984. */
function onTrackPointerdown(e: PointerEvent, axis: 'vertical' | 'horizontal') {
  const el = viewportRef.value
  if (!el) return

  const track = e.currentTarget as HTMLElement
  const rect = track.getBoundingClientRect()
  const vertical = axis === 'vertical'
  const pos = vertical ? e.clientY - rect.top : e.clientX - rect.left
  const thumbStartPct = vertical ? thumbTopPct.value : thumbLeftPct.value
  const thumbLenPct = vertical ? thumbHeightPct.value : thumbWidthPct.value
  const trackLen = vertical ? rect.height : rect.width

  const thumbStart = (thumbStartPct / 100) * trackLen
  const thumbEnd = thumbStart + (thumbLenPct / 100) * trackLen
  const page = vertical ? el.clientHeight : el.clientWidth

  if (pos < thumbStart) {
    if (vertical) el.scrollTop -= page
    else el.scrollLeft -= page
  } else if (pos > thumbEnd) {
    if (vertical) el.scrollTop += page
    else el.scrollLeft += page
  }
}

/* ── Steppers ────────────────────────────────────────────────────────────
 * Held steppers auto-repeat after an initial delay — the same two-stage timing
 * every platform scrollbar has used. */

let repeatTimer: ReturnType<typeof setTimeout> | null = null
let repeatInterval: ReturnType<typeof setInterval> | null = null

function scrollBy(axis: 'vertical' | 'horizontal', delta: number) {
  const el = viewportRef.value
  if (!el) return
  if (axis === 'vertical') el.scrollTop += delta
  else el.scrollLeft += delta
}

function stopRepeat() {
  if (repeatTimer !== null) clearTimeout(repeatTimer)
  if (repeatInterval !== null) clearInterval(repeatInterval)
  repeatTimer = null
  repeatInterval = null
}

function onStepperPointerdown(e: PointerEvent, axis: 'vertical' | 'horizontal', dir: -1 | 1) {
  e.preventDefault()
  e.stopPropagation()
  const delta = dir * props.step
  scrollBy(axis, delta)

  stopRepeat()
  repeatTimer = setTimeout(() => {
    repeatInterval = setInterval(() => scrollBy(axis, delta), 40)
  }, 300)

  const target = e.currentTarget as HTMLElement
  target.setPointerCapture?.(e.pointerId)
  const release = () => {
    stopRepeat()
    target.removeEventListener('pointerup', release)
    target.removeEventListener('pointercancel', release)
  }
  target.addEventListener('pointerup', release)
  target.addEventListener('pointercancel', release)
}

function onScrollbarKeydown(e: KeyboardEvent, axis: 'vertical' | 'horizontal') {
  const el = viewportRef.value
  if (!el) return

  const step = props.step
  const pageStep = axis === 'vertical' ? el.clientHeight : el.clientWidth

  switch (e.key) {
    case 'ArrowDown':
      if (axis === 'vertical') {
        e.preventDefault()
        el.scrollTop += step
      }
      break
    case 'ArrowUp':
      if (axis === 'vertical') {
        e.preventDefault()
        el.scrollTop -= step
      }
      break
    case 'ArrowRight':
      if (axis === 'horizontal') {
        e.preventDefault()
        el.scrollLeft += step
      }
      break
    case 'ArrowLeft':
      if (axis === 'horizontal') {
        e.preventDefault()
        el.scrollLeft -= step
      }
      break
    case 'PageDown':
      if (axis === 'vertical') {
        e.preventDefault()
        el.scrollTop += pageStep
      }
      break
    case 'PageUp':
      if (axis === 'vertical') {
        e.preventDefault()
        el.scrollTop -= pageStep
      }
      break
    case 'Home':
      e.preventDefault()
      if (axis === 'vertical') el.scrollTop = 0
      else el.scrollLeft = 0
      break
    case 'End':
      e.preventDefault()
      if (axis === 'vertical') el.scrollTop = el.scrollHeight
      else el.scrollLeft = el.scrollWidth
      break
  }
}
</script>

<template>
  <div
    data-rig-scroll-area
    :role="ariaLabel ? 'region' : undefined"
    :aria-label="ariaLabel || undefined"
  >
    <div :id="viewportId" ref="viewportRef" data-rig-scroll-viewport @scroll="onScroll">
      <slot />
    </div>

    <!-- Vertical track -->
    <div
      v-if="vertical && hasVerticalScroll"
      data-rig-scroll-bar
      role="scrollbar"
      tabindex="0"
      aria-label="Vertical scroll"
      :aria-controls="viewportId"
      aria-orientation="vertical"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="verticalScrollPct"
      data-orientation="vertical"
      :data-steppers="steppers || undefined"
      :data-stepper-placement="steppers ? stepperPlacement : undefined"
      :data-dragging="dragging === 'vertical' || undefined"
      @keydown="onScrollbarKeydown($event, 'vertical')"
    >
      <button
        v-if="steppers"
        type="button"
        tabindex="-1"
        aria-hidden="true"
        data-rig-scroll-stepper
        data-direction="up"
        @pointerdown="onStepperPointerdown($event, 'vertical', -1)"
      >
        <slot name="stepper-up">
          <svg viewBox="0 0 8 8" aria-hidden="true">
            <path d="M4 2 7 6H1z" fill="currentColor" />
          </svg>
        </slot>
      </button>

      <div data-rig-scroll-track @pointerdown="onTrackPointerdown($event, 'vertical')">
        <div
          data-rig-scroll-thumb
          :style="{
            height: `${thumbHeightPct}%`,
            transform: `translateY(${thumbTopPct}%)`,
          }"
          @pointerdown="onThumbPointerdown($event, 'vertical')"
        />
      </div>

      <button
        v-if="steppers"
        type="button"
        tabindex="-1"
        aria-hidden="true"
        data-rig-scroll-stepper
        data-direction="down"
        @pointerdown="onStepperPointerdown($event, 'vertical', 1)"
      >
        <slot name="stepper-down">
          <svg viewBox="0 0 8 8" aria-hidden="true">
            <path d="M4 6 1 2h6z" fill="currentColor" />
          </svg>
        </slot>
      </button>
    </div>

    <!-- Horizontal track -->
    <div
      v-if="horizontal && hasHorizontalScroll"
      data-rig-scroll-bar
      role="scrollbar"
      tabindex="0"
      aria-label="Horizontal scroll"
      :aria-controls="viewportId"
      aria-orientation="horizontal"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="horizontalScrollPct"
      data-orientation="horizontal"
      :data-steppers="steppers || undefined"
      :data-stepper-placement="steppers ? stepperPlacement : undefined"
      :data-dragging="dragging === 'horizontal' || undefined"
      @keydown="onScrollbarKeydown($event, 'horizontal')"
    >
      <button
        v-if="steppers"
        type="button"
        tabindex="-1"
        aria-hidden="true"
        data-rig-scroll-stepper
        data-direction="left"
        @pointerdown="onStepperPointerdown($event, 'horizontal', -1)"
      >
        <slot name="stepper-left">
          <svg viewBox="0 0 8 8" aria-hidden="true">
            <path d="M2 4 6 1v6z" fill="currentColor" />
          </svg>
        </slot>
      </button>

      <div data-rig-scroll-track @pointerdown="onTrackPointerdown($event, 'horizontal')">
        <div
          data-rig-scroll-thumb
          :style="{
            width: `${thumbWidthPct}%`,
            transform: `translateX(${thumbLeftPct}%)`,
          }"
          @pointerdown="onThumbPointerdown($event, 'horizontal')"
        />
      </div>

      <button
        v-if="steppers"
        type="button"
        tabindex="-1"
        aria-hidden="true"
        data-rig-scroll-stepper
        data-direction="right"
        @pointerdown="onStepperPointerdown($event, 'horizontal', 1)"
      >
        <slot name="stepper-right">
          <svg viewBox="0 0 8 8" aria-hidden="true">
            <path d="M6 4 2 7V1z" fill="currentColor" />
          </svg>
        </slot>
      </button>
    </div>
  </div>
</template>
