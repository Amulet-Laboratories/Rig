<script setup lang="ts">
import LineChart from './LineChart.vue'
import { ref } from 'vue'

const showDots = ref(false)
</script>

<template>
  <Story title="LineChart" icon="lucide:line-chart" group="data">
    <Variant title="Single Series">
      <LineChart
        :series="[
          { label: 'Users', data: [120, 180, 150, 220, 280, 350, 310, 400], color: '#c9956d' },
        ]"
        :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']"
      />
    </Variant>

    <Variant title="Multiple Series">
      <LineChart
        :series="[
          { label: 'Revenue', data: [20, 35, 30, 45, 50, 65, 60, 80], color: '#c9956d' },
          { label: 'Expenses', data: [15, 20, 25, 22, 30, 35, 28, 40], color: '#6d8fc9' },
          { label: 'Profit', data: [5, 15, 5, 23, 20, 30, 32, 40], color: '#22c55e' },
        ]"
        :labels="['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8']"
        show-dots
      />
    </Variant>

    <Variant title="Playground">
      <LineChart
        :series="[
          { label: 'Metric', data: [10, 40, 20, 60, 45, 70, 50, 80, 65, 90], color: '#c9956d' },
        ]"
        :labels="Array.from({ length: 10 }, (_, i) => `P${i + 1}`)"
        :show-dots="showDots"
      />

      <template #controls>
        <HstCheckbox v-model="showDots" title="Show Dots" />
      </template>
    </Variant>
  </Story>
</template>
