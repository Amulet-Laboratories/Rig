<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import ActivityBar from '@nav/ActivityBar.vue'
import type { Action } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const activeId = ref('files')

const items: Action[] = [
  { id: 'files', label: 'Explorer', icon: 'mdi:file-outline' },
  { id: 'search', label: 'Search', icon: 'mdi:magnify' },
  { id: 'git', label: 'Source Control', icon: 'mdi:source-branch' },
  { id: 'debug', label: 'Run & Debug', icon: 'mdi:bug-outline' },
  { id: 'extensions', label: 'Extensions', icon: 'mdi:package-variant' },
]
</script>

<template>
  <Story title="Navigation / ActivityBar" icon="lucide:sidebar">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Vertical">
      <div style="padding: 24px; display: flex; height: 300px">
        <ActivityBar v-model:active-id="activeId" :items="items" orientation="vertical" />
        <div style="padding: 16px; flex: 1">
          Active: <strong>{{ activeId }}</strong>
        </div>
      </div>
    </Variant>

    <Variant title="Horizontal">
      <div style="padding: 24px; max-width: 500px">
        <ActivityBar v-model:active-id="activeId" :items="items" orientation="horizontal" />
      </div>
    </Variant>
  </Story>
</template>
