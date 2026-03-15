<script setup lang="ts">
import type { ID } from '@core/types'

withDefaults(
  defineProps<{
    /** Breadcrumb segments */
    items: { id: ID; label: string }[]
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
  item: (props: { item: { id: ID; label: string }; isLast: boolean }) => unknown
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
        <button v-else data-rig-breadcrumbs-link @click="emit('select', item.id)">
          <slot name="item" :item="item" :isLast="false">
            {{ item.label }}
          </slot>
        </button>
      </li>
    </ol>
  </nav>
</template>
