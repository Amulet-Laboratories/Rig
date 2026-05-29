<script setup lang="ts">
/**
 * FeatureList — icon + text pairs for amenities, features, benefits, checklists.
 *
 * Layouts:
 *   list   — vertical stack (default)
 *   grid   — multi-column grid
 *   inline — horizontal flow with wrapping
 *
 * Slots allow custom icon rendering per item.
 */
export interface FeatureItem {
  /** Unique identifier. */
  id: string
  /** Primary text. */
  text: string
  /** Optional detail or secondary text. */
  detail?: string
}

defineProps<{
  /** Feature items to render. */
  items: FeatureItem[]
  /** Layout variant. */
  layout?: 'list' | 'grid' | 'inline'
  /** Grid columns at sm+ breakpoint. */
  columns?: 2 | 3 | 4
}>()

defineSlots<{
  item?(props: { item: FeatureItem; index: number }): unknown
  icon?(props: { item: FeatureItem; index: number }): unknown
  text?(props: { item: FeatureItem }): unknown
  detail?(props: { item: FeatureItem }): unknown
}>()
</script>

<template>
  <div data-rig-feature-list :data-layout="layout ?? 'list'" :data-columns="columns ?? 2">
    <div v-for="(item, i) in items" :key="item.id" data-rig-feature-list-item>
      <slot name="item" :item="item" :index="i">
        <div v-if="$slots.icon" data-rig-feature-list-icon>
          <slot name="icon" :item="item" :index="i" />
        </div>

        <div data-rig-feature-list-text>
          <slot name="text" :item="item">{{ item.text }}</slot>
        </div>

        <div v-if="item.detail || $slots.detail" data-rig-feature-list-detail>
          <slot name="detail" :item="item">{{ item.detail }}</slot>
        </div>
      </slot>
    </div>
  </div>
</template>
