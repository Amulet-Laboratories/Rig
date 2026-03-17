<script setup lang="ts">
import ScatterPlot from './ScatterPlot.vue'
import { ref } from 'vue'

const data = Array.from({ length: 30 }, (_, i) => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
  label: `Point ${i + 1}`,
  size: Math.round(Math.random() * 20) + 5,
}))

const pgWidth = ref(400)
const pgHeight = ref(300)
const pgDotRadius = ref(4)
</script>

<template>
  <Story title="ScatterPlot" icon="lucide:scatter-chart" group="data">
    <Variant title="Default">
      <ScatterPlot :data="data" />
    </Variant>

    <Variant title="Colored Points">
      <ScatterPlot
        :data="[
          { x: 20, y: 80, label: 'A', color: '#c9956d' },
          { x: 40, y: 60, label: 'B', color: '#6d8fc9' },
          { x: 60, y: 40, label: 'C', color: '#22c55e' },
          { x: 80, y: 20, label: 'D', color: '#ef4444' },
          { x: 50, y: 50, label: 'E', color: '#eab308', size: 20 },
        ]"
      />
    </Variant>

    <Variant title="Custom Size">
      <ScatterPlot :data="data" :width="500" :height="400" :dot-radius="6" />
    </Variant>

    <Variant title="Playground">
      <ScatterPlot :data="data" :width="pgWidth" :height="pgHeight" :dot-radius="pgDotRadius" />

      <template #controls>
        <HstSlider v-model="pgWidth" title="Width" :min="200" :max="800" />
        <HstSlider v-model="pgHeight" title="Height" :min="150" :max="600" />
        <HstSlider v-model="pgDotRadius" title="Dot Radius" :min="1" :max="12" />
      </template>
    </Variant>
  </Story>
</template>
