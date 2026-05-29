<script setup lang="ts">
import DateRangePicker from './DateRangePicker.vue'
import { ref } from 'vue'

const range = ref<[string | null, string | null]>([null, null])
</script>

<template>
  <Story title="DateRangePicker" icon="lucide:calendar-range" group="nav">
    <Variant title="Default">
      <div style="width: 360px">
        <DateRangePicker v-model="range" />
      </div>
      <div
        v-if="range[0] || range[1]"
        style="color: var(--muted-foreground); font-size: 12px; margin-top: 8px"
      >
        {{ range[0] }} to {{ range[1] }}
      </div>
    </Variant>

    <Variant title="With Constraints">
      <div style="width: 360px">
        <DateRangePicker v-model="range" min="2024-01-01" max="2024-12-31" />
      </div>
    </Variant>

    <Variant title="Custom Placeholders">
      <div style="width: 360px">
        <DateRangePicker v-model="range" start-placeholder="Check-in" end-placeholder="Check-out" />
      </div>
    </Variant>
  </Story>
</template>
