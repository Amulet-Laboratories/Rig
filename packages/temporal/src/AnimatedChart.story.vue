<script setup lang="ts">
import AnimatedChart from './AnimatedChart.vue'
import { ref } from 'vue'

const type = ref<'bar' | 'line'>('bar')
const autoPlay = ref(false)

const frames = [
  { label: '2020', data: [30, 45, 20, 55, 40] },
  { label: '2021', data: [35, 50, 25, 60, 45] },
  { label: '2022', data: [40, 55, 35, 65, 55] },
  { label: '2023', data: [50, 60, 40, 70, 60] },
  { label: '2024', data: [60, 75, 50, 80, 70] },
]
</script>

<template>
  <Story title="AnimatedChart" icon="lucide:play-circle" group="temporal">
    <Variant title="Bar">
      <AnimatedChart :frames="frames" type="bar" :speed="600" />
    </Variant>

    <Variant title="Line">
      <AnimatedChart :frames="frames" type="line" :speed="600" />
    </Variant>

    <Variant title="Autoplay">
      <AnimatedChart :frames="frames" type="bar" auto-play :speed="800" />
    </Variant>

    <Variant title="Playground">
      <AnimatedChart :frames="frames" :type="type" :auto-play="autoPlay" :speed="600" />

      <template #controls>
        <HstSelect v-model="type" title="Type" :options="['bar', 'line']" />
        <HstCheckbox v-model="autoPlay" title="Auto Play" />
      </template>
    </Variant>
  </Story>
</template>
