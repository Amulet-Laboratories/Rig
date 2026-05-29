<script setup lang="ts">
import CalendarGrid from './CalendarGrid.vue'
import { ref } from 'vue'

const selected = ref(new Date().toISOString().split('T')[0])
const view = ref<'month' | 'week'>('month')

const events = [
  { date: '2024-12-15', label: 'Sprint Review', color: '#c9956d' },
  { date: '2024-12-20', label: 'Release Day', color: '#22c55e' },
  { date: '2024-12-25', label: 'Holiday', color: '#ef4444' },
  { date: '2024-12-31', label: 'New Year Eve', color: '#3b82f6' },
]
</script>

<template>
  <Story title="CalendarGrid" icon="lucide:calendar-days" group="extras">
    <Variant title="Month View">
      <CalendarGrid v-model="selected" :events="events" view="month" />
    </Variant>

    <Variant title="Week View">
      <CalendarGrid v-model="selected" :events="events" view="week" />
    </Variant>

    <Variant title="Playground">
      <CalendarGrid v-model="selected" :events="events" :view="view" />

      <template #controls>
        <HstSelect v-model="view" title="View" :options="['month', 'week']" />
      </template>
    </Variant>
  </Story>
</template>
