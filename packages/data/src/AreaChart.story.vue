<script setup lang="ts">
import AreaChart from './AreaChart.vue'
import { ref } from 'vue'

const pgWidth = ref(400)
const pgHeight = ref(300)
const pgFillOpacity = ref(0.2)
</script>

<template>
  <Story title="AreaChart" icon="lucide:area-chart" group="data">
    <Variant title="Default">
      <AreaChart
        :series="[
          {
            label: 'Revenue',
            data: [10, 25, 15, 35, 30, 45, 40, 55, 50, 65, 60, 75],
            color: '#c9956d',
          },
        ]"
        :labels="[
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]"
      />
    </Variant>

    <Variant title="Multiple Series">
      <AreaChart
        :series="[
          { label: 'Revenue', data: [10, 25, 15, 35, 30, 45, 40, 55], color: '#c9956d' },
          { label: 'Costs', data: [8, 12, 10, 18, 15, 20, 18, 22], color: '#6d8fc9' },
        ]"
        :labels="['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8']"
        :fill-opacity="0.15"
      />
    </Variant>

    <Variant title="Playground">
      <AreaChart
        :series="[
          {
            label: 'Revenue',
            data: [10, 25, 15, 35, 30, 45, 40, 55, 50, 65, 60, 75],
            color: '#c9956d',
          },
          {
            label: 'Costs',
            data: [8, 12, 10, 18, 15, 20, 18, 22, 20, 25, 22, 30],
            color: '#6d8fc9',
          },
        ]"
        :labels="[
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]"
        :width="pgWidth"
        :height="pgHeight"
        :fill-opacity="pgFillOpacity"
      />

      <template #controls>
        <HstSlider v-model="pgWidth" title="Width" :min="200" :max="800" />
        <HstSlider v-model="pgHeight" title="Height" :min="150" :max="600" />
        <HstSlider v-model="pgFillOpacity" title="Fill Opacity" :min="0" :max="1" :step="0.05" />
      </template>
    </Variant>
  </Story>
</template>
