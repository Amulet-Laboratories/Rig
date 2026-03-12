<script setup lang="ts">
import Menubar from '@menus/Menubar.vue'
import type { Action } from '@core/types'

interface MenubarEntry {
  id: string
  label: string
  items: Action[]
}
const items: MenubarEntry[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New File' },
      { id: 'open', label: 'Open File' },
      { id: 'save', label: 'Save' },
      { id: 'exit', label: 'Exit' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo' },
      { id: 'redo', label: 'Redo' },
      { id: 'cut', label: 'Cut' },
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste', disabled: true },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'sidebar', label: 'Toggle Sidebar' },
      { id: 'panel', label: 'Toggle Panel' },
    ],
  },
]
</script>

<template>
  <Story title="Menubar" icon="lucide:menu">
        <Variant title="Default">
      <Menubar :items="items" @select="(a) => console.log('selected', a.label)" />
    </Variant>
  </Story>
</template>
