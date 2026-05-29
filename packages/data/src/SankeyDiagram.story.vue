<script setup lang="ts">
import SankeyDiagram from './SankeyDiagram.vue'

const nodes = [
  { id: 'budget', label: 'Budget', color: '#c9956d' },
  { id: 'eng', label: 'Engineering', color: '#6d8fc9' },
  { id: 'design', label: 'Design', color: '#6dc99e' },
  { id: 'marketing', label: 'Marketing', color: '#c96d8f' },
  { id: 'frontend', label: 'Frontend', color: '#8f6dc9' },
  { id: 'backend', label: 'Backend', color: '#c9c16d' },
  { id: 'brand', label: 'Brand', color: '#6dc9c1' },
]

const links = [
  { source: 'budget', target: 'eng', value: 60 },
  { source: 'budget', target: 'design', value: 25 },
  { source: 'budget', target: 'marketing', value: 15 },
  { source: 'eng', target: 'frontend', value: 35 },
  { source: 'eng', target: 'backend', value: 25 },
  { source: 'design', target: 'frontend', value: 15 },
  { source: 'design', target: 'brand', value: 10 },
  { source: 'marketing', target: 'brand', value: 15 },
]
</script>

<template>
  <Story title="SankeyDiagram" icon="lucide:git-merge" group="data">
    <Variant title="Default">
      <SankeyDiagram :nodes="nodes" :links="links" :width="600" :height="300" />
    </Variant>

    <Variant title="Simple">
      <SankeyDiagram
        :nodes="[
          { id: 'a', label: 'Source A' },
          { id: 'b', label: 'Source B' },
          { id: 'c', label: 'Target' },
        ]"
        :links="[
          { source: 'a', target: 'c', value: 70 },
          { source: 'b', target: 'c', value: 30 },
        ]"
        :width="400"
        :height="200"
      />
    </Variant>
  </Story>
</template>
