<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import EditorTab from '@editor/EditorTab.vue'
import type { TabItem } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const tabs: TabItem[] = [
  { id: '1', label: 'index.ts', closable: true },
  { id: '2', label: 'App.vue', closable: true, dirty: true },
  { id: '3', label: 'README.md', closable: true, pinned: true },
]

const activeId = ref('1')
</script>

<template>
  <Story title="Editor / EditorTab" icon="lucide:file">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Tab Strip">
      <div style="display: flex; gap: 0">
        <EditorTab
          v-for="tab in tabs"
          :key="tab.id"
          :tab="tab"
          :active="activeId === tab.id"
          @activate="activeId = tab.id"
          @close="console.log('close', tab.id)"
        />
      </div>
    </Variant>
  </Story>
</template>
