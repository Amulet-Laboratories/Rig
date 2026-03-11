<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import PanelBar from '@nav/PanelBar.vue'
import type { TabItem } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const tabs: TabItem[] = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'output', label: 'Output', closable: true },
  { id: 'problems', label: 'Problems', closable: true },
]

const activeId = ref('terminal')
</script>

<template>
  <Story title="Nav / PanelBar" icon="lucide:panel-bottom">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Default">
      <PanelBar
        v-model:active-id="activeId"
        :tabs="tabs"
        @close="(id) => console.log('close', id)"
      />
      <div style="padding: 12px">Active: {{ activeId }}</div>
    </Variant>
  </Story>
</template>
