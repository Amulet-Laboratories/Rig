<script setup lang="ts">
import { ref } from 'vue'
import EditorWorkbench from '@editor/EditorWorkbench.vue'
import type { TabItem } from '@core/types'
const activeId = ref('app')

const tabs: TabItem[] = [
  { id: 'app', label: 'App.vue', icon: 'mdi:vuejs', closable: true },
  { id: 'main', label: 'main.ts', icon: 'mdi:language-typescript', closable: true },
  { id: 'styles', label: 'styles.css', icon: 'mdi:palette', dirty: true, closable: true },
  { id: 'config', label: 'vite.config.ts', icon: 'mdi:cog', pinned: true },
]

function handleClose(id: string) {
  const i = tabs.findIndex((t) => t.id === id)
  if (i !== -1) tabs.splice(i, 1)
}
</script>

<template>
  <Story title="EditorWorkbench" icon="lucide:code">
        <Variant title="Interactive">
      <div style="padding: 24px; height: 300px">
        <EditorWorkbench v-model:active-id="activeId" :tabs="tabs" @close="handleClose">
          <template #default="{ activeTab }">
            <div style="padding: 16px; height: 100%">
              <p>Editing: <strong>{{ activeTab?.label }}</strong></p>
              <pre style="margin-top: 12px; font-size: 13px; opacity: 0.6">// Content for {{ activeTab?.label }}</pre>
            </div>
          </template>
          <template #empty>
            <div style="padding: 48px; text-align: center; opacity: 0.5">
              No file open
            </div>
          </template>
        </EditorWorkbench>
      </div>
    </Variant>
  </Story>
</template>
