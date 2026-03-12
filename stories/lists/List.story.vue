<script setup lang="ts">
import { ref } from 'vue'
import List from '@lists/List.vue'
import type { ListItem } from '@core/types'
const selected = ref<string | string[]>('')
const multiSelect = ref(false)

const items: ListItem[] = [
  { id: '1', label: 'App.vue', description: 'Root component', icon: 'mdi:vuejs' },
  { id: '2', label: 'main.ts', description: 'Entry point', icon: 'mdi:language-typescript' },
  { id: '3', label: 'router.ts', description: 'Route definitions', icon: 'mdi:routes' },
  { id: '4', label: 'store.ts', description: 'State management', icon: 'mdi:database' },
  { id: '5', label: 'utils.ts', description: 'Utility functions', icon: 'mdi:wrench' },
  { id: '6', label: 'README.md', description: 'Documentation', icon: 'mdi:file-document' },
  { id: '7', label: 'package.json', description: 'Package manifest', icon: 'mdi:nodejs' },
  { id: '8', label: '.gitignore', description: 'Git ignore rules', icon: 'mdi:git', disabled: true },
]
</script>

<template>
  <Story title="List" icon="lucide:list">
    <template #controls>
      <HstCheckbox v-model="multiSelect" title="Multi Select" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 360px">
        <List
          v-model:selected="selected"
          :items="items"
          :multi-select="multiSelect"
        />
        <p style="margin-top: 8px; font-size: 12px">
          Selected: {{ Array.isArray(selected) ? selected.join(', ') : selected }}
        </p>
      </div>
    </Variant>
  </Story>
</template>
