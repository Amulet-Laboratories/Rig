<script setup lang="ts">
import EditorWorkbench from './EditorWorkbench.vue'
import { ref } from 'vue'

const activeId = ref<string>('main')

const tabs = [
  { id: 'main', label: 'main.ts', icon: 'lucide:file-code' },
  { id: 'app', label: 'App.vue', icon: 'lucide:file-code' },
  { id: 'config', label: 'vite.config.ts', icon: 'lucide:settings' },
  { id: 'readme', label: 'README.md', icon: 'lucide:file-text' },
]
</script>

<template>
  <Story title="EditorWorkbench" icon="lucide:app-window" group="editor">
    <Variant title="Default">
      <div style="height: 300px; border: 1px solid var(--border)">
        <EditorWorkbench v-model:active-id="activeId" :tabs="tabs">
          <template #default="{ activeTab }">
            <div
              style="
                padding: 16px;
                color: var(--foreground);
                font-family: monospace;
                font-size: 13px;
              "
            >
              Editing: {{ activeTab?.label ?? 'none' }}
            </div>
          </template>
          <template #empty>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: var(--muted-foreground);
              "
            >
              No file open
            </div>
          </template>
        </EditorWorkbench>
      </div>
    </Variant>

    <Variant title="No Tabs">
      <div style="height: 200px; border: 1px solid var(--border)">
        <EditorWorkbench :tabs="[]">
          <template #empty>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: var(--muted-foreground);
              "
            >
              Open a file to get started
            </div>
          </template>
        </EditorWorkbench>
      </div>
    </Variant>
  </Story>
</template>
