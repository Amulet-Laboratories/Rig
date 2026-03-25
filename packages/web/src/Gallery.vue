<script setup lang="ts">
/**
 * Gallery — image + text layout for portfolios and showcases.
 *
 * Layouts:
 *   alternating — image and content alternate sides per item (default)
 *   grid        — standard multi-column image grid
 *   masonry     — masonry-style stacked layout
 *
 * The alternating layout automatically swaps image position between left
 * and right for each item, creating a zigzag visual flow.
 */
export interface GalleryItem {
  /** Unique identifier. */
  id: string
  /** Item title. */
  title?: string
  /** Item description. */
  description?: string
  /** Image URL. */
  img?: string
  /** Image alt text. */
  imgAlt?: string
}

const props = defineProps<{
  /** Gallery items to render. */
  items: GalleryItem[]
  /** Layout variant. */
  layout?: 'alternating' | 'grid' | 'masonry'
  /** Whether the first item starts with image on left or right. */
  startSide?: 'left' | 'right'
}>()

defineSlots<{
  item?(props: { item: GalleryItem; index: number; imageFirst: boolean }): unknown
  image?(props: { item: GalleryItem; index: number }): unknown
  content?(props: { item: GalleryItem; index: number }): unknown
}>()

function isImageFirst(index: number): boolean {
  const startsLeft = (props.startSide ?? 'left') === 'left'
  return startsLeft ? index % 2 === 0 : index % 2 !== 0
}
</script>

<template>
  <div data-rig-gallery :data-layout="layout ?? 'alternating'">
    <article
      v-for="(item, i) in items"
      :key="item.id"
      data-rig-gallery-item
      :data-image-first="isImageFirst(i) || undefined"
    >
      <slot name="item" :item="item" :index="i" :image-first="isImageFirst(i)">
        <div data-rig-gallery-image :data-side="isImageFirst(i) ? 'left' : 'right'">
          <slot name="image" :item="item" :index="i">
            <img
              v-if="item.img"
              :src="item.img"
              :alt="item.imgAlt ?? item.title ?? ''"
              loading="lazy"
              data-rig-gallery-img
            />
          </slot>
        </div>

        <div data-rig-gallery-content>
          <slot name="content" :item="item" :index="i">
            <h3 v-if="item.title" data-rig-gallery-title>{{ item.title }}</h3>
            <p v-if="item.description" data-rig-gallery-description>
              {{ item.description }}
            </p>
          </slot>
        </div>
      </slot>
    </article>
  </div>
</template>
