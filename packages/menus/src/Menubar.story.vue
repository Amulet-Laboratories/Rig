<script setup lang="ts">
import Menubar from './Menubar.vue'

const items = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New File', icon: 'lucide:file-plus' },
      { id: 'open', label: 'Open', icon: 'lucide:folder-open' },
      { id: 'save', label: 'Save', icon: 'lucide:save' },
      { id: 'exit', label: 'Exit', icon: 'lucide:log-out' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', icon: 'lucide:undo' },
      { id: 'redo', label: 'Redo', icon: 'lucide:redo' },
      { id: 'cut', label: 'Cut', icon: 'lucide:scissors' },
      { id: 'copy', label: 'Copy', icon: 'lucide:copy' },
      { id: 'paste', label: 'Paste', icon: 'lucide:clipboard' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'explorer', label: 'Explorer', icon: 'lucide:files' },
      { id: 'search', label: 'Search', icon: 'lucide:search' },
      { id: 'terminal', label: 'Terminal', icon: 'lucide:terminal' },
    ],
  },
]
</script>

<template>
  <Story title="Menubar" icon="lucide:menu" group="menus">
    <Variant title="Default">
      <div style="border: 1px solid var(--border)">
        <Menubar :items="items" @select="() => {}" />
      </div>
    </Variant>
  </Story>
</template>
