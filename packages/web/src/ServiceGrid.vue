<script setup lang="ts">
/**
 * ServiceGrid — display a list of services, features, or capabilities.
 *
 * Layouts:
 *   grid     — multi-column card grid (default)
 *   list     — single-column with dividers between items
 *   numbered — like list but with auto-incrementing numbers
 *
 * Slots allow full customization of each item's icon, title, and description.
 */
export interface ServiceItem {
  /** Unique identifier. */
  id: string
  /** Service title. */
  title: string
  /** Service description. */
  description?: string
}

defineProps<{
  /** Service items to render. */
  items: ServiceItem[]
  /** Layout variant. */
  layout?: 'grid' | 'list' | 'numbered'
  /** Grid columns at sm+ breakpoint. */
  columns?: 2 | 3 | 4
}>()

defineSlots<{
  item?(props: { item: ServiceItem; index: number }): unknown
  icon?(props: { item: ServiceItem; index: number }): unknown
  title?(props: { item: ServiceItem }): unknown
  description?(props: { item: ServiceItem }): unknown
}>()
</script>

<template>
  <div data-rig-service-grid :data-layout="layout ?? 'grid'" :data-columns="columns ?? 3">
    <article v-for="(item, i) in items" :key="item.id" data-rig-service-grid-item>
      <slot name="item" :item="item" :index="i">
        <div v-if="$slots.icon" data-rig-service-grid-icon>
          <slot name="icon" :item="item" :index="i" />
        </div>

        <div v-if="(layout ?? 'grid') === 'numbered'" data-rig-service-grid-number>
          {{ String(i + 1).padStart(2, '0') }}
        </div>

        <div data-rig-service-grid-title>
          <slot name="title" :item="item">{{ item.title }}</slot>
        </div>

        <div v-if="item.description || $slots.description" data-rig-service-grid-description>
          <slot name="description" :item="item">{{ item.description }}</slot>
        </div>
      </slot>
    </article>
  </div>
</template>
