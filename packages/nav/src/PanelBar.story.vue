<script setup lang="ts">
import PanelBar from './PanelBar.vue'
import { ref } from 'vue'

const activeId = ref<string>('terminal')

const tabs = [
  { id: 'problems', label: 'Problems', icon: 'lucide:circle-alert' },
  { id: 'output', label: 'Output', icon: 'lucide:terminal' },
  { id: 'terminal', label: 'Terminal', icon: 'lucide:terminal-square' },
  { id: 'debug', label: 'Debug Console', icon: 'lucide:bug' },
]
</script>

<template>
  <Story title="PanelBar" icon="lucide:panel-bottom-open" group="nav">
    <Variant title="Default">
      <div style="border: 1px solid var(--border)">
        <PanelBar v-model:active-id="activeId" :tabs="tabs">
          <template #default="{ activeId: currentId }">
            <div
              style="
                padding: 12px;
                color: var(--muted-foreground);
                font-family: monospace;
                font-size: 13px;
                min-height: 100px;
              "
            >
              {{ currentId }} content
            </div>
          </template>
        </PanelBar>
      </div>
    </Variant>

    <Variant title="With Actions">
      <div style="border: 1px solid var(--border)">
        <PanelBar v-model:active-id="activeId" :tabs="tabs">
          <template #actions>
            <button
              style="
                padding: 2px 6px;
                background: none;
                border: none;
                color: var(--muted-foreground);
                cursor: pointer;
              "
            >
              +
            </button>
          </template>
          <template #default="{ activeId: currentId }">
            <div style="padding: 12px; color: var(--muted-foreground); min-height: 80px">
              {{ currentId }} panel
            </div>
          </template>
        </PanelBar>
      </div>
    </Variant>
  </Story>
</template>
