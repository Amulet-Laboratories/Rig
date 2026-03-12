<script setup lang="ts">
import { ref } from 'vue'
import CommandPalette from '@menus/CommandPalette.vue'
import Button from '@core/primitives/Button.vue'
import type { ListItem } from '@core/types'
const open = ref(false)

const items: ListItem[] = [
  { id: 'open-file', label: 'Open File', description: 'Browse and open a file', icon: 'mdi:file-outline' },
  { id: 'new-file', label: 'New File', description: 'Create a new file', icon: 'mdi:file-plus' },
  { id: 'save-all', label: 'Save All', description: 'Save all open files', icon: 'mdi:content-save-all' },
  { id: 'git-commit', label: 'Git: Commit', description: 'Commit staged changes', icon: 'mdi:source-commit' },
  { id: 'git-push', label: 'Git: Push', description: 'Push commits to remote', icon: 'mdi:source-branch' },
  { id: 'toggle-terminal', label: 'Toggle Terminal', description: 'Show/hide the terminal panel', icon: 'mdi:console' },
  { id: 'format-doc', label: 'Format Document', description: 'Apply formatter to document', icon: 'mdi:format-align-left' },
  { id: 'preferences', label: 'Preferences', description: 'Open settings', icon: 'mdi:cog' },
]
</script>

<template>
  <Story title="CommandPalette" icon="lucide:terminal">
        <Variant title="Interactive">
      <div style="padding: 24px">
        <Button @click="open = true">Open Command Palette</Button>
        <CommandPalette v-model:open="open" :items="items" placeholder="Type a command..." />
      </div>
    </Variant>
  </Story>
</template>
