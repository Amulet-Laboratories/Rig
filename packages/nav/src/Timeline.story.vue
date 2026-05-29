<script setup lang="ts">
import Timeline from './Timeline.vue'
import { ref } from 'vue'

const orientation = ref<'horizontal' | 'vertical'>('vertical')

const items = [
  {
    label: 'Project created',
    description: 'Initial commit',
    timestamp: '2024-01-15',
    status: 'completed' as const,
  },
  {
    label: 'Alpha release',
    description: 'v0.1.0 published',
    timestamp: '2024-03-01',
    status: 'completed' as const,
  },
  {
    label: 'Beta release',
    description: 'v0.5.0 in progress',
    timestamp: '2024-06-15',
    status: 'active' as const,
  },
  {
    label: 'Stable release',
    description: 'v1.0.0 planned',
    timestamp: '2024-09-01',
    status: 'pending' as const,
  },
]
</script>

<template>
  <Story title="Timeline" icon="lucide:git-commit" group="nav">
    <Variant title="Vertical">
      <div style="width: 400px">
        <Timeline :items="items" orientation="vertical" />
      </div>
    </Variant>

    <Variant title="Horizontal">
      <Timeline :items="items" orientation="horizontal" />
    </Variant>

    <Variant title="Playground">
      <Timeline :items="items" :orientation="orientation" />

      <template #controls>
        <HstSelect
          v-model="orientation"
          title="Orientation"
          :options="['vertical', 'horizontal']"
        />
      </template>
    </Variant>
  </Story>
</template>
