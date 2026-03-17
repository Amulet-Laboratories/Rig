<script setup lang="ts">
import Treemap from './Treemap.vue'

const data = [
  { label: 'Engineering', value: 45, color: '#c9956d' },
  { label: 'Design', value: 20, color: '#6d8fc9' },
  { label: 'Marketing', value: 15, color: '#6dc99e' },
  { label: 'Sales', value: 12, color: '#c96d8f' },
  { label: 'Operations', value: 8, color: '#8f6dc9' },
]
</script>

<template>
  <Story title="Treemap" icon="lucide:layout-grid" group="data">
    <Variant title="Default">
      <Treemap :data="data" />
    </Variant>

    <Variant title="Custom Size">
      <Treemap :data="data" :width="600" :height="400" />
    </Variant>

    <Variant title="Nested">
      <Treemap
        :data="[
          {
            label: 'Frontend',
            value: 60,
            color: '#c9956d',
            children: [
              { label: 'Vue', value: 30, color: '#42b883' },
              { label: 'React', value: 20, color: '#61dafb' },
              { label: 'Svelte', value: 10, color: '#ff3e00' },
            ],
          },
          { label: 'Backend', value: 30, color: '#6d8fc9' },
          { label: 'DevOps', value: 10, color: '#6dc99e' },
        ]"
      />
    </Variant>
  </Story>
</template>
