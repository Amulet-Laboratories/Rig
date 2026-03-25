<script setup lang="ts">
/**
 * MenuList — priced item list for restaurants, menus, and product catalogs.
 *
 * Renders a vertically stacked list of items with optional price column.
 * Commonly used for food menus, drink lists, product catalogs, and service pricing.
 *
 * Slots allow full customization of each item's name, description, price, and note.
 */
export interface MenuItem {
  /** Unique identifier. */
  id: string
  /** Item name. */
  name: string
  /** Description or details. */
  description?: string
  /** Display price (pre-formatted string). */
  price?: string
  /** Additional note (e.g., "seasonal", "sold out"). */
  note?: string
}

import { computed } from 'vue'

const props = defineProps<{
  /** Menu items to render. */
  items: MenuItem[]
  /** Whether to show the price column. Defaults to true if any item has a price. */
  priced?: boolean
}>()

defineSlots<{
  item?(props: { item: MenuItem; index: number }): unknown
  name?(props: { item: MenuItem }): unknown
  description?(props: { item: MenuItem }): unknown
  price?(props: { item: MenuItem }): unknown
  note?(props: { item: MenuItem }): unknown
}>()

const hasPrices = computed(() => props.priced ?? props.items.some((i) => !!i.price))
</script>

<template>
  <div data-rig-menu-list :data-priced="hasPrices ? 'true' : undefined">
    <div v-for="(item, i) in items" :key="item.id" data-rig-menu-list-item>
      <slot name="item" :item="item" :index="i">
        <div data-rig-menu-list-content>
          <div data-rig-menu-list-name>
            <slot name="name" :item="item">{{ item.name }}</slot>
            <span v-if="item.note || $slots.note" data-rig-menu-list-note>
              <slot name="note" :item="item">{{ item.note }}</slot>
            </span>
          </div>
          <div v-if="item.description || $slots.description" data-rig-menu-list-description>
            <slot name="description" :item="item">{{ item.description }}</slot>
          </div>
        </div>
        <div v-if="item.price || $slots.price" data-rig-menu-list-price>
          <slot name="price" :item="item">{{ item.price }}</slot>
        </div>
      </slot>
    </div>
  </div>
</template>
