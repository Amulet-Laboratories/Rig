<script setup lang="ts">
import IdeShell from './IdeShell.vue'

const activities = [
  { id: 'explorer', label: 'Explorer', icon: 'lucide:files' },
  { id: 'search', label: 'Search', icon: 'lucide:search' },
  { id: 'git', label: 'Source Control', icon: 'lucide:git-branch' },
  { id: 'extensions', label: 'Extensions', icon: 'lucide:puzzle' },
]

const panelTabs = [
  { id: 'terminal', label: 'Terminal', icon: 'lucide:terminal' },
  { id: 'problems', label: 'Problems', icon: 'lucide:circle-alert' },
  { id: 'output', label: 'Output', icon: 'lucide:scroll-text' },
]
</script>

<template>
  <Story title="IdeShell" icon="lucide:monitor" group="shell">
    <Variant title="Default">
      <div style="height: 500px; border: 1px solid var(--border)">
        <IdeShell :activities="activities" :panel-tabs="panelTabs">
          <template #titlebar>
            <div
              style="
                padding: 4px 12px;
                font-size: 12px;
                color: var(--foreground);
                text-align: center;
              "
            >
              Rig IDE Shell
            </div>
          </template>
          <template #sidebar="{ activity }">
            <div style="padding: 12px; color: var(--muted-foreground); font-size: 13px">
              {{ activity || 'explorer' }} sidebar
            </div>
          </template>
          <template #editor>
            <div
              style="
                padding: 16px;
                color: var(--foreground);
                font-family: monospace;
                font-size: 13px;
              "
            >
              // editor content
            </div>
          </template>
          <template #panel>
            <div
              style="
                padding: 8px 12px;
                color: var(--muted-foreground);
                font-family: monospace;
                font-size: 12px;
              "
            >
              $ pnpm dev
            </div>
          </template>
          <template #statusbar>
            <div
              style="
                padding: 0 12px;
                font-size: 11px;
                color: var(--primary-foreground);
                display: flex;
                justify-content: space-between;
              "
            >
              <span>main</span>
              <span>TypeScript</span>
            </div>
          </template>
        </IdeShell>
      </div>
    </Variant>
  </Story>
</template>
