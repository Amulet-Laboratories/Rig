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

const emit = defineEmits<{
  'item-click': [item: StatusBarItem]
}>()

const leftItems = computed(() =>
  props.items.filter((i) => i.align === 'left').sort((a, b) => a.priority - b.priority),
)

const rightItems = computed(() =>
  props.items.filter((i) => i.align === 'right').sort((a, b) => a.priority - b.priority),
)

function onItemClick(item: StatusBarItem) {
  if (typeof item.command === 'function') {
    item.command()
  }
  emit('item-click', item)
}
</script>

<template>
  <footer data-rig-status-bar role="status">
    <div data-rig-status-bar-left>
      <slot name="left">
        <component
          :is="item.command ? 'button' : 'span'"
          v-for="item in leftItems"
          :key="item.id"
          data-rig-status-bar-item
          :title="item.tooltip"
          @click="item.command ? onItemClick(item) : undefined"
        >
          <slot name="item" :item="item">
            {{ item.content }}
          </slot>
        </component>
      </slot>
    </div>
    <div data-rig-status-bar-right>
      <slot name="right">
        <component
          :is="item.command ? 'button' : 'span'"
          v-for="item in rightItems"
          :key="item.id"
          data-rig-status-bar-item
          :title="item.tooltip"
          @click="item.command ? onItemClick(item) : undefined"
        >
          <slot name="item" :item="item">
            {{ item.content }}
          </slot>
        </component>
      </slot>
    </div>
  </footer>
</template>
