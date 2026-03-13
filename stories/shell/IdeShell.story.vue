<script setup lang="ts">
import IdeShell from '@shell/IdeShell.vue'
import type { Action, TabItem } from '@core/types'

const activities: Action[] = [
  { id: 'explorer', label: 'Explorer', icon: 'codicon:files' },
  { id: 'search', label: 'Search', icon: 'codicon:search' },
  { id: 'git', label: 'Source Control', icon: 'codicon:source-control' },
]

const panelTabs: TabItem[] = [
  { id: 'output', label: 'Output' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'problems', label: 'Problems' },
]
</script>

<template>
  <Story title="IdeShell" icon="lucide:layout-dashboard">
    <Variant title="Default">
      <div style="height: 600px; display: flex; flex-direction: column">
        <IdeShell :activities="activities" :panel-tabs="panelTabs">
          <template #sidebar>
            <div style="padding: 12px">
              <p style="font-weight: bold; margin-bottom: 8px">Explorer</p>
              <ul>
                <li>src/</li>
                <li>package.json</li>
                <li>README.md</li>
              </ul>
            </div>
          </template>
          <template #tab="{ tab }">
            <div style="padding: 16px">
              <p>Editing: {{ tab.label }}</p>
            </div>
          </template>
          <template #empty>
            <div style="padding: 32px; text-align: center; opacity: 0.5">
              Open a file to get started
            </div>
          </template>
          <template #panel>
            <div style="padding: 8px; font-family: monospace; font-size: 12px">
              $ pnpm dev
            </div>
          </template>
          <template #statusbar>
            <span style="padding: 0 8px; font-size: 12px">main</span>
            <span style="padding: 0 8px; font-size: 12px">UTF-8</span>
          </template>
        </IdeShell>
      </div>
    </Variant>
  </Story>
</template>
