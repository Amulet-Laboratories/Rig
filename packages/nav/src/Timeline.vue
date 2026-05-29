<script setup lang="ts">
import type { Orientation } from '@core/types'

export interface TimelineItem {
  label: string
  description?: string
  timestamp?: string
  status?: 'completed' | 'active' | 'pending'
}

withDefaults(
  defineProps<{
    /** Timeline items */
    items?: TimelineItem[]
    /** Layout direction */
    orientation?: Orientation
  }>(),
  {
    items: () => [],
    orientation: 'vertical',
  },
)

defineEmits<{
  select: [item: TimelineItem, index: number]
}>()
</script>

<template>
  <div data-rig-timeline :data-orientation="orientation" role="list" aria-label="Timeline">
    <div
      v-for="(item, i) in items"
      :key="i"
      data-rig-timeline-item
      :data-status="item.status ?? 'pending'"
      role="listitem"
      tabindex="0"
      @keydown.enter="$emit('select', item, i)"
      @click="$emit('select', item, i)"
    >
      <div data-rig-timeline-marker>
        <div data-rig-timeline-dot />
        <div v-if="i < items.length - 1" data-rig-timeline-connector />
      </div>
      <div data-rig-timeline-content>
        <div data-rig-timeline-label>{{ item.label }}</div>
        <div v-if="item.description" data-rig-timeline-description>{{ item.description }}</div>
        <div v-if="item.timestamp" data-rig-timeline-timestamp>{{ item.timestamp }}</div>
      </div>
    </div>
  </div>
</template>
