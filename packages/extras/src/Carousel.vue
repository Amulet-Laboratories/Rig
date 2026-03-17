<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Index of the currently active slide */
    modelValue?: number
    /** Array of items to display as slides */
    items?: unknown[]
    /** Whether to auto-advance slides */
    autoplay?: boolean
    /** Interval in ms between auto-advance (when autoplay is true) */
    interval?: number
    /** Whether to loop back to start after last slide */
    loop?: boolean
    /** Accessible label for the carousel region */
    ariaLabel?: string
  }>(),
  {
    modelValue: 0,
    items: () => [],
    autoplay: false,
    interval: 5000,
    loop: false,
    ariaLabel: 'Carousel',
  },
)

const emit = defineEmits<{
  'update:modelValue': [index: number]
}>()

defineSlots<{
  slide?: (props: { item: unknown; index: number; active: boolean }) => unknown
  prev?: (props: Record<string, never>) => unknown
  next?: (props: Record<string, never>) => unknown
  indicators?: (props: { total: number; current: number; goTo: (index: number) => void }) => unknown
}>()

let autoplayTimer: ReturnType<typeof setInterval> | null = null

const total = computed(() => props.items.length)
const canPrev = computed(() => props.loop || props.modelValue > 0)
const canNext = computed(() => props.loop || props.modelValue < total.value - 1)

function goTo(index: number) {
  if (total.value === 0) return
  let target = index
  if (props.loop) {
    target = ((index % total.value) + total.value) % total.value
  } else {
    target = Math.min(Math.max(0, index), total.value - 1)
  }
  if (target !== props.modelValue) {
    emit('update:modelValue', target)
  }
}

function prev() {
  if (!canPrev.value) return
  goTo(props.modelValue - 1)
}

function next() {
  if (!canNext.value) return
  goTo(props.modelValue + 1)
}

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      prev()
      break
    case 'ArrowRight':
      e.preventDefault()
      next()
      break
    case 'Home':
      e.preventDefault()
      goTo(0)
      break
    case 'End':
      e.preventDefault()
      goTo(total.value - 1)
      break
  }
}

function startAutoplay() {
  stopAutoplay()
  if (props.autoplay && total.value > 1) {
    autoplayTimer = setInterval(() => next(), props.interval)
  }
}

function stopAutoplay() {
  if (autoplayTimer !== null) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

watch(
  () => [props.autoplay, props.interval],
  () => {
    if (props.autoplay) startAutoplay()
    else stopAutoplay()
  },
)

onMounted(() => {
  if (props.autoplay) startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <div
    data-rig-carousel
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    @keydown="onKeydown"
    @mouseenter="stopAutoplay"
    @mouseleave="autoplay ? startAutoplay() : undefined"
  >
    <button
      data-rig-carousel-prev
      :disabled="!canPrev"
      :aria-disabled="!canPrev"
      aria-label="Previous slide"
      @click="prev"
    >
      <slot name="prev">&lsaquo;</slot>
    </button>

    <div data-rig-carousel-track aria-live="polite">
      <div
        v-for="(item, index) in items"
        :key="index"
        data-rig-carousel-slide
        :data-active="index === modelValue || undefined"
        role="group"
        :aria-roledescription="'slide'"
        :aria-label="`Slide ${index + 1} of ${total}`"
        :aria-hidden="index !== modelValue"
      >
        <slot name="slide" :item="item" :index="index" :active="index === modelValue" />
      </div>
    </div>

    <button
      data-rig-carousel-next
      :disabled="!canNext"
      :aria-disabled="!canNext"
      aria-label="Next slide"
      @click="next"
    >
      <slot name="next">&rsaquo;</slot>
    </button>

    <div data-rig-carousel-indicators role="tablist" aria-label="Slide indicators">
      <slot name="indicators" :total="total" :current="modelValue" :go-to="goTo">
        <button
          v-for="(_, index) in items"
          :key="index"
          data-rig-carousel-indicator
          :data-active="index === modelValue || undefined"
          role="tab"
          :aria-selected="index === modelValue"
          :aria-label="`Go to slide ${index + 1}`"
          @click="goTo(index)"
        />
      </slot>
    </div>
  </div>
</template>
