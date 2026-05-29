<script setup lang="ts">
import ActionBar from './ActionBar.vue'
</script>

<template>
  <Story title="ActionBar" icon="lucide:more-horizontal" group="menus">
    <Variant title="Default">
      <ActionBar
        :actions="[
          { id: 'new', label: 'New File', icon: 'lucide:file-plus' },
          { id: 'save', label: 'Save', icon: 'lucide:save' },
          { id: 'undo', label: 'Undo', icon: 'lucide:undo' },
          { id: 'redo', label: 'Redo', icon: 'lucide:redo' },
        ]"
        @select="() => {}"
      />
    </Variant>

    <Variant title="Max Visible">
      <ActionBar
        :actions="[
          { id: 'cut', label: 'Cut', icon: 'lucide:scissors' },
          { id: 'copy', label: 'Copy', icon: 'lucide:copy' },
          { id: 'paste', label: 'Paste', icon: 'lucide:clipboard' },
          { id: 'delete', label: 'Delete', icon: 'lucide:trash-2' },
          { id: 'rename', label: 'Rename', icon: 'lucide:pencil' },
          { id: 'move', label: 'Move', icon: 'lucide:move' },
        ]"
        :max-visible="3"
        @select="() => {}"
      />
    </Variant>
  </Story>
</template>
