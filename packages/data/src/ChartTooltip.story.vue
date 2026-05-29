<script setup lang="ts">
import ChartTooltip from './ChartTooltip.vue'
import ChartEmpty from './ChartEmpty.vue'
import { ref } from 'vue'

const showTooltip = ref(true)
const tooltipX = ref(120)
const tooltipY = ref(60)
</script>

<template>
  <Story title="ChartTooltip / ChartEmpty" icon="lucide:message-square" group="data">
    <Variant title="Tooltip Visible">
      <div style="position: relative; height: 200px; border: 1px dashed var(--color-border, #333)">
        <ChartTooltip :show="showTooltip" :x="tooltipX" :y="tooltipY">
          <div>Revenue: <strong>$4,200</strong></div>
        </ChartTooltip>
      </div>
      <template #controls>
        <HstCheckbox v-model="showTooltip" title="Show" />
        <HstSlider v-model="tooltipX" title="X" :min="0" :max="300" />
        <HstSlider v-model="tooltipY" title="Y" :min="0" :max="200" />
      </template>
    </Variant>

    <Variant title="Empty State – Default">
      <ChartEmpty />
    </Variant>

    <Variant title="Empty State – Custom">
      <ChartEmpty label="No transactions this month" hint="Import data to get started" />
    </Variant>
  </Story>
</template>
