<script setup lang="ts">
// Lightbox — a full-screen viewer over a set of images.
//
// ImagePreview has emitted `zoom` since it shipped and nothing ever consumed
// it: every consumer that wanted click-to-enlarge composed Modal + img + key
// handling by hand or skipped it. This is that composition, once — Modal for
// the focus trap and overlay, ImagePreview for the loading/error states, and
// arrow-key navigation over the set.
//
// The `#extra` slot renders inside the stage in place of the image for items a
// flat picture cannot carry — a 3D viewer for a model, a video element — while
// navigation and chrome stay the lightbox's problem.
import { computed } from 'vue'
import { Modal } from '@layout/index'
import ImagePreview from './ImagePreview.vue'

export interface LightboxItem {
  src: string
  alt?: string
  caption?: string
}

const props = withDefaults(
  defineProps<{
    items: LightboxItem[]
    /** Accessible label for the dialog */
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'Image viewer',
  },
)

const emit = defineEmits<{
  change: [index: number]
}>()

defineSlots<{
  /** Replaces the caption line. */
  caption?: (props: { item: LightboxItem; index: number }) => unknown
  /** Replaces the image for the current item — a 3D viewer, a video. */
  extra?: (props: { item: LightboxItem; index: number }) => unknown
}>()

const open = defineModel<boolean>('open', { default: false })
const index = defineModel<number>('index', { default: 0 })

const current = computed(() => props.items[index.value])

function go(delta: number) {
  if (!props.items.length) return
  const next = Math.max(0, Math.min(index.value + delta, props.items.length - 1))
  if (next === index.value) return
  index.value = next
  emit('change', next)
}

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      go(1)
      break
    case 'ArrowLeft':
      e.preventDefault()
      go(-1)
      break
    case 'Home':
      e.preventDefault()
      go(-index.value)
      break
    case 'End':
      e.preventDefault()
      go(props.items.length - 1 - index.value)
      break
  }
}
</script>

<template>
  <Modal v-model:open="open" :aria-label="ariaLabel">
    <div v-if="current" data-rig-lightbox @keydown="onKeydown">
      <div data-rig-lightbox-stage>
        <button
          type="button"
          data-rig-lightbox-nav="prev"
          aria-label="Previous"
          :disabled="index === 0"
          @click="go(-1)"
        >
          ‹
        </button>
        <slot name="extra" :item="current" :index="index">
          <ImagePreview :key="current.src" :src="current.src" :alt="current.alt ?? ''" />
        </slot>
        <button
          type="button"
          data-rig-lightbox-nav="next"
          aria-label="Next"
          :disabled="index >= items.length - 1"
          @click="go(1)"
        >
          ›
        </button>
      </div>
      <div data-rig-lightbox-bar>
        <span data-rig-lightbox-caption>
          <slot name="caption" :item="current" :index="index">{{ current.caption ?? '' }}</slot>
        </span>
        <span v-if="items.length > 1" data-rig-lightbox-counter>
          {{ index + 1 }} / {{ items.length }}
        </span>
        <button type="button" data-rig-lightbox-close aria-label="Close" @click="open = false">
          ✕
        </button>
      </div>
    </div>
  </Modal>
</template>
