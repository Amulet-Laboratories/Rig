<script setup lang="ts">
import StatRow from './StatRow.vue'
import type { WebStatItem } from './StatRow.vue'
import { ref } from 'vue'

const stats: WebStatItem[] = [
  { value: '10K+', label: 'Customers' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9', label: 'Rating' },
  { value: '24/7', label: 'Support' },
]

const statsWithChange: WebStatItem[] = [
  { value: '$2.4M', label: 'Revenue', change: '+12%' },
  { value: '1,200', label: 'Active Users', change: '+8%' },
  { value: '340', label: 'New Signups', change: '+24%' },
  { value: '98%', label: 'Satisfaction', change: '+2%' },
]

const pgVariant = ref<'bordered' | 'card' | 'filled'>('bordered')
</script>

<template>
  <Story title="StatRow" icon="lucide:bar-chart-2" group="web">
    <Variant title="Bordered (Default)">
      <StatRow :stats="stats" variant="bordered" />
    </Variant>

    <Variant title="Card">
      <StatRow :stats="stats" variant="card" />
    </Variant>

    <Variant title="Filled">
      <StatRow :stats="stats" variant="filled" />
    </Variant>

    <Variant title="With Change Indicators">
      <StatRow :stats="statsWithChange" variant="bordered" />
    </Variant>

    <Variant title="Playground">
      <StatRow :stats="statsWithChange" :variant="pgVariant" />

      <template #controls>
        <HstSelect v-model="pgVariant" title="Variant" :options="['bordered', 'card', 'filled']" />
      </template>
    </Variant>
  </Story>
</template>
