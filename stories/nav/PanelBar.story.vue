<script setup lang="ts">
import { ref } from 'vue'
import PanelBar from '@nav/PanelBar.vue'
import type { TabItem } from '@core/types'
const tabs: TabItem[] = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'output', label: 'Output', closable: true },
  { id: 'problems', label: 'Problems', closable: true },
]

const activeId = ref('terminal')
</script>

<template>
  <Story title="PanelBar" icon="lucide:panel-bottom">
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
