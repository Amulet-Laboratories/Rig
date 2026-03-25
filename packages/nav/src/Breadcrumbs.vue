<script setup lang="ts">
import type { ID } from '@core/types'

export interface BreadcrumbItem {
  id: ID
  label: string
  /** When set, renders an <a> instead of a <button> — better for SSR/SEO. */
  href?: string
}

withDefaults(
  defineProps<{
    /** Breadcrumb segments */
    items: BreadcrumbItem[]
    /** Separator character between segments */
    separator?: string
  }>(),
  {
    separator: '/',
  },
)

const emit = defineEmits<{
  select: [id: ID]
}>()

defineSlots<{
  item: (props: { item: BreadcrumbItem; isLast: boolean }) => unknown
}>()
</script>

<template>
  <nav data-rig-breadcrumbs aria-label="Breadcrumb" @keydown.stop>
    <ol data-rig-breadcrumbs-list>
      <li v-for="(item, index) in items" :key="item.id" data-rig-breadcrumbs-item>
        <span v-if="index > 0" data-rig-breadcrumbs-separator aria-hidden="true">
          {{ separator }}
        </span>
        <span
          v-if="index === items.length - 1"
          data-rig-breadcrumbs-current
          aria-current="page"
          tabindex="-1"
        >
          <slot name="item" :item="item" :isLast="true">
            {{ item.label }}
          </slot>
        </span>
        <a
          v-else-if="item.href"
          :href="item.href"
          data-rig-breadcrumbs-link
          @click.prevent="emit('select', item.id)"
        >
          <slot name="item" :item="item" :isLast="false">
            {{ item.label }}
          </slot>
        </a>
        <button v-else data-rig-breadcrumbs-link @click="emit('select', item.id)">
          <slot name="item" :item="item" :isLast="false">
            {{ item.label }}
          </slot>
        </button>
      </li>
    </ol>
  </nav>
</template>
