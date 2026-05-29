<script setup lang="ts">
import BarChart from './BarChart.vue'
import { ref } from 'vue'

const orientation = ref<'vertical' | 'horizontal'>('vertical')
const showValues = ref(false)
const showLabels = ref(true)
const width = ref(400)
const height = ref(300)
const lastBarClick = ref('')

const data = [
  { label: 'Mon', value: 42, color: '#c9956d' },
  { label: 'Tue', value: 65 },
  { label: 'Wed', value: 38 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 55 },
  { label: 'Sat', value: 30 },
  { label: 'Sun', value: 20 },
]

function onBarClick(item: { label: string; value: number }, index: number) {
  lastBarClick.value = `Clicked: ${item.label} = ${item.value} (index ${index})`
}
</script>

<template>
  <Story title="BarChart" icon="lucide:bar-chart-3" group="data">
    <Variant title="Vertical">
      <BarChart :data="data" orientation="vertical" @bar-click="onBarClick" />
      <div
        v-if="lastBarClick"
        style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
      >
        {{ lastBarClick }}
      </div>
    </Variant>

    <Variant title="Horizontal">
      <BarChart :data="data" orientation="horizontal" @bar-click="onBarClick" />
    </Variant>

    <Variant title="With Values">
      <BarChart :data="data" show-values />
    </Variant>

    <Variant title="Playground">
      <BarChart
        :data="data"
        :orientation="orientation"
        :show-values="showValues"
        :show-labels="showLabels"
        :width="width"
        :height="height"
        @bar-click="onBarClick"
      />
      <div
        v-if="lastBarClick"
        style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
      >
        {{ lastBarClick }}
      </div>

      <template #controls>
        <HstSelect
          v-model="orientation"
          title="Orientation"
          :options="['vertical', 'horizontal']"
        />
        <HstCheckbox v-model="showValues" title="Show Values" />
        <HstCheckbox v-model="showLabels" title="Show Labels" />
        <HstSlider v-model="width" title="Width" :min="200" :max="800" />
        <HstSlider v-model="height" title="Height" :min="150" :max="600" />
      </template>
    </Variant>
  </Story>
</template>
