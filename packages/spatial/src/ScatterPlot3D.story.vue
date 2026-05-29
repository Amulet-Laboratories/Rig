<script setup lang="ts">
import ScatterPlot3D from './ScatterPlot3D.vue'
import { ref } from 'vue'

const rotationY = ref(30)

const data = Array.from({ length: 40 }, () => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
  z: Math.round(Math.random() * 100),
  label: `P${Math.round(Math.random() * 100)}`,
  color: `hsl(${Math.random() * 360}, 60%, 55%)`,
}))
</script>

<template>
  <Story title="ScatterPlot3D" icon="lucide:box" group="spatial">
    <Variant title="Default">
      <ScatterPlot3D :data="data" :width="450" :height="400" />
    </Variant>

    <Variant title="Playground">
      <ScatterPlot3D :data="data" :width="450" :height="400" :rotation-y="rotationY" />

      <template #controls>
        <HstSlider v-model="rotationY" title="Rotation Y" :min="0" :max="360" />
      </template>
    </Variant>
  </Story>
</template>
