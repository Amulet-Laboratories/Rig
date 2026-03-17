<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Image source URL */
    src: string
    /** Alt text for the image */
    alt?: string
    /** Fallback image source on error */
    fallback?: string
    /** Whether clicking the image emits a zoom event */
    zoomable?: boolean
  }>(),
  {
    alt: '',
    fallback: '',
    zoomable: false,
  },
)

const emit = defineEmits<{
  zoom: [src: string]
  load: []
  error: [event: Event]
}>()

defineSlots<{
  loading?: (props: Record<string, never>) => unknown
  error?: (props: { src: string }) => unknown
  overlay?: (props: Record<string, never>) => unknown
}>()

const loaded = ref(false)
const errored = ref(false)
const currentSrc = ref(props.src)

watch(
  () => props.src,
  (newSrc) => {
    loaded.value = false
    errored.value = false
    currentSrc.value = newSrc
  },
)

function onLoad() {
  loaded.value = true
  errored.value = false
  emit('load')
}

function onError(e: Event) {
  errored.value = true
  loaded.value = false
  emit('error', e)
  if (props.fallback && currentSrc.value !== props.fallback) {
    currentSrc.value = props.fallback
    errored.value = false
  }
}

function onClick() {
  if (props.zoomable && loaded.value) {
    emit('zoom', currentSrc.value)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (props.zoomable && loaded.value && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault()
    emit('zoom', currentSrc.value)
  }
}
</script>

<template>
  <div
    data-rig-image-preview
    :data-loaded="loaded || undefined"
    :data-error="errored || undefined"
    :data-zoomable="zoomable || undefined"
    :role="zoomable ? 'button' : undefined"
    :tabindex="zoomable ? 0 : undefined"
    :aria-label="zoomable ? `Zoom image: ${alt}` : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-if="!loaded && !errored" name="loading" />
    <img
      v-if="!errored"
      data-rig-image-preview-img
      :src="currentSrc"
      :alt="alt"
      loading="lazy"
      @load="onLoad"
      @error="onError"
    />
    <div v-if="errored && !fallback" data-rig-image-preview-fallback>
      <slot name="error" :src="src" />
    </div>
    <div v-if="loaded && $slots.overlay" data-rig-image-preview-overlay>
      <slot name="overlay" />
    </div>
  </div>
</template>
