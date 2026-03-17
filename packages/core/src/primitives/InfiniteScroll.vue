<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Whether a load operation is currently in progress */
    loading?: boolean
    /** Whether further loading is disabled (e.g., no more data) */
    disabled?: boolean
    /** Distance in pixels from the bottom to trigger load-more */
    threshold?: number
    /** Accessible label for the loading indicator */
    loadingLabel?: string
  }>(),
  {
    loading: false,
    disabled: false,
    threshold: 100,
    loadingLabel: 'Loading more items',
  },
)

const emit = defineEmits<{
  'load-more': []
}>()

defineSlots<{
  default?: (props: Record<string, never>) => unknown
  loading?: (props: Record<string, never>) => unknown
}>()

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function createObserver() {
  destroyObserver()

  if (props.disabled) return
  if (typeof IntersectionObserver === 'undefined') return
  if (!sentinelRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting && !props.loading && !props.disabled) {
        emit('load-more')
      }
    },
    {
      rootMargin: `0px 0px ${props.threshold}px 0px`,
    },
  )

  observer.observe(sentinelRef.value)
}

function destroyObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

watch(
  () => [props.disabled, props.threshold],
  () => {
    createObserver()
  },
)

onMounted(() => {
  createObserver()
})

onUnmounted(() => {
  destroyObserver()
})
</script>

<template>
  <div
    data-rig-infinite-scroll
    :data-loading="loading || undefined"
    :data-disabled="disabled || undefined"
  >
    <slot />

    <div ref="sentinelRef" data-rig-infinite-scroll-sentinel aria-hidden="true" />

    <div
      v-if="loading"
      data-rig-infinite-scroll-loading
      role="status"
      aria-live="polite"
      :aria-label="loadingLabel"
    >
      <slot name="loading">
        {{ loadingLabel }}
      </slot>
    </div>
  </div>
</template>
