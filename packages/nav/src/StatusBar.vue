<script setup lang="ts">
import { computed } from 'vue'
import type { StatusBarItem } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Status bar items */
    items?: StatusBarItem[]
  }>(),
  {
    items: () => [],
  },
)

const leftItems = computed(() =>
  props.items
    .filter((i) => i.align === 'left')
    .sort((a, b) => a.priority - b.priority),
)

const rightItems = computed(() =>
  props.items
    .filter((i) => i.align === 'right')
    .sort((a, b) => a.priority - b.priority),
)
</script>

<template>
  <footer data-rig-status-bar role="status">
    <div data-rig-status-bar-left>
      <slot name="left">
        <span
          v-for="item in leftItems"
          :key="item.id"
          data-rig-status-bar-item
        >
          <slot name="item" :item="item">
            {{ item.content }}
          </slot>
        </span>
      </slot>
    </div>
    <div data-rig-status-bar-right>
      <slot name="right">
        <span
          v-for="item in rightItems"
          :key="item.id"
          data-rig-status-bar-item
        >
          <slot name="item" :item="item">
            {{ item.content }}
          </slot>
        </span>
      </slot>
    </div>
  </footer>
</template>
