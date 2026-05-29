<script setup lang="ts">
import DatePicker from './DatePicker.vue'
import { ref } from 'vue'

const date = ref<string | null>(null)
const pgDate = ref<string | null>(null)
const pgPlaceholder = ref('Select date')
const pgMin = ref('')
const pgMax = ref('')
</script>

<template>
  <Story title="DatePicker" icon="lucide:calendar" group="nav">
    <Variant title="Default">
      <div style="width: 280px">
        <DatePicker v-model="date" />
      </div>
      <div v-if="date" style="color: var(--muted-foreground); font-size: 12px; margin-top: 8px">
        Selected: {{ date }}
      </div>
    </Variant>

    <Variant title="With Constraints">
      <div style="width: 280px">
        <DatePicker
          v-model="date"
          min="2024-01-01"
          max="2024-12-31"
          placeholder="Pick a 2024 date"
        />
      </div>
    </Variant>

    <Variant title="Disabled Dates">
      <div style="width: 280px">
        <DatePicker
          v-model="date"
          :disabled-dates="['2024-12-25', '2024-12-31', '2024-01-01']"
          placeholder="Holidays disabled"
        />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 280px">
        <DatePicker
          v-model="pgDate"
          :placeholder="pgPlaceholder"
          :min="pgMin || undefined"
          :max="pgMax || undefined"
        />
        <div v-if="pgDate" style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
          Selected: {{ pgDate }}
        </div>
      </div>

      <template #controls>
        <HstText v-model="pgPlaceholder" title="Placeholder" />
        <HstText v-model="pgMin" title="Min Date (YYYY-MM-DD)" />
        <HstText v-model="pgMax" title="Max Date (YYYY-MM-DD)" />
      </template>
    </Variant>
  </Story>
</template>
