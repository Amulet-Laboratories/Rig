<script setup lang="ts">
import GraphNetwork from './GraphNetwork.vue'
import { ref } from 'vue'

const showLabels = ref(true)

const nodes = [
  { id: 'vue', label: 'Vue', x: 250, y: 150, color: '#42b883', size: 20 },
  { id: 'vite', label: 'Vite', x: 100, y: 80, color: '#646cff', size: 16 },
  { id: 'pinia', label: 'Pinia', x: 400, y: 80, color: '#f7d336', size: 14 },
  { id: 'router', label: 'Router', x: 400, y: 250, color: '#42b883', size: 14 },
  { id: 'vitest', label: 'Vitest', x: 100, y: 250, color: '#729b1b', size: 14 },
  { id: 'ts', label: 'TypeScript', x: 250, y: 300, color: '#3178c6', size: 16 },
]

const edges = [
  { source: 'vue', target: 'vite' },
  { source: 'vue', target: 'pinia' },
  { source: 'vue', target: 'router' },
  { source: 'vue', target: 'vitest' },
  { source: 'vue', target: 'ts' },
  { source: 'vite', target: 'vitest' },
  { source: 'ts', target: 'vite' },
]
</script>

<template>
  <Story title="GraphNetwork" icon="lucide:network" group="spatial">
    <Variant title="Default">
      <GraphNetwork :nodes="nodes" :edges="edges" :width="500" :height="350" />
    </Variant>

    <Variant title="Playground">
      <GraphNetwork
        :nodes="nodes"
        :edges="edges"
        :width="500"
        :height="350"
        :show-labels="showLabels"
      />

      <template #controls>
        <HstCheckbox v-model="showLabels" title="Show Labels" />
      </template>
    </Variant>
  </Story>
</template>
