<script setup lang="ts">
import TemporalHeatmap from './TemporalHeatmap.vue'

const data = Array.from({ length: 168 }, (_, i) => ({
  time: i % 24,
  category: Math.floor(i / 24),
  value: Math.round(Math.random() * 100),
}))

const timeLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
const categoryLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<template>
  <Story title="TemporalHeatmap" icon="lucide:calendar-clock" group="temporal">
    <Variant title="Default">
      <TemporalHeatmap
        :data="data"
        :time-labels="timeLabels"
        :category-labels="categoryLabels"
        :time-slots="24"
        :categories="7"
      />
    </Variant>

    <Variant title="Compact">
      <TemporalHeatmap
        :data="data"
        :time-labels="timeLabels"
        :category-labels="categoryLabels"
        :time-slots="24"
        :categories="7"
        :cell-size="12"
        :gap="1"
      />
    </Variant>
  </Story>
</template>
