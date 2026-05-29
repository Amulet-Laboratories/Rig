<script setup lang="ts">
import ActivityBar from './ActivityBar.vue'
import { ref } from 'vue'

const activeId = ref<string>('explorer')

const items = [
  { id: 'explorer', label: 'Explorer', icon: 'lucide:files' },
  { id: 'search', label: 'Search', icon: 'lucide:search' },
  { id: 'git', label: 'Source Control', icon: 'lucide:git-branch' },
  { id: 'debug', label: 'Debug', icon: 'lucide:bug' },
  { id: 'extensions', label: 'Extensions', icon: 'lucide:puzzle' },
]
</script>

<template>
  <Story title="ActivityBar" icon="lucide:sidebar" group="nav">
    <Variant title="Vertical">
      <div style="height: 300px; width: 48px; border: 1px solid var(--border)">
        <ActivityBar v-model:active-id="activeId" :items="items" orientation="vertical" />
      </div>
    </Variant>

    <Variant title="Horizontal">
      <div style="width: 400px; border: 1px solid var(--border)">
        <ActivityBar v-model:active-id="activeId" :items="items" orientation="horizontal" />
      </div>
    </Variant>
  </Story>
</template>
