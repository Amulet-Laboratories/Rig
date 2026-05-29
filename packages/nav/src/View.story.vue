<script setup lang="ts">
import View from './View.vue'
import { ref } from 'vue'

const collapsed = ref(false)

const actions = [
  { id: 'refresh', label: 'Refresh', icon: 'lucide:refresh-cw' },
  { id: 'add', label: 'New File', icon: 'lucide:plus' },
  { id: 'collapse', label: 'Collapse All', icon: 'lucide:fold-vertical' },
]
</script>

<template>
  <Story title="View" icon="lucide:layout" group="nav">
    <Variant title="Default">
      <div style="width: 280px; border: 1px solid var(--border)">
        <View title="Explorer" :actions="actions">
          <div style="padding: 8px; color: var(--muted-foreground); font-size: 13px">
            <div
              v-for="file in ['index.ts', 'App.vue', 'main.ts', 'router.ts']"
              :key="file"
              style="padding: 4px 0"
            >
              {{ file }}
            </div>
          </div>
        </View>
      </div>
    </Variant>

    <Variant title="Collapsible">
      <div style="width: 280px; border: 1px solid var(--border)">
        <View v-model:collapsed="collapsed" title="Source Control">
          <div style="padding: 8px; color: var(--muted-foreground); font-size: 13px">
            <div>Modified: 3 files</div>
            <div>Staged: 1 file</div>
          </div>
        </View>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 280px; border: 1px solid var(--border)">
        <View v-model:collapsed="collapsed" title="View Title" :actions="actions">
          <div style="padding: 8px; color: var(--muted-foreground)">View content</div>
        </View>
      </div>

      <template #controls>
        <HstCheckbox v-model="collapsed" title="Collapsed" />
      </template>
    </Variant>
  </Story>
</template>
