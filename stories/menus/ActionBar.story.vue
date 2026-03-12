<script setup lang="ts">
import ActionBar from '@menus/ActionBar.vue'
import type { Action } from '@core/types'
const actions: Action[] = [
  { id: 'split', label: 'Split Editor', icon: 'mdi:arrow-split-vertical' },
  { id: 'preview', label: 'Preview', icon: 'mdi:eye' },
  { id: 'more', label: 'More Actions', icon: 'mdi:dots-horizontal' },
]

const manyActions: Action[] = [
  { id: 'new', label: 'New', icon: 'mdi:plus' },
  { id: 'refresh', label: 'Refresh', icon: 'mdi:refresh' },
  { id: 'collapse', label: 'Collapse All', icon: 'mdi:collapse-all' },
  { id: 'filter', label: 'Filter', icon: 'mdi:filter' },
  { id: 'sort', label: 'Sort', icon: 'mdi:sort' },
  { id: 'settings', label: 'Settings', icon: 'mdi:cog' },
]
</script>

<template>
  <Story title="ActionBar" icon="lucide:more-horizontal">
        <Variant title="Default">
      <div style="padding: 24px">
        <ActionBar :actions="actions" />
      </div>
    </Variant>

    <Variant title="With Overflow (max 3)">
      <div style="padding: 24px; max-width: 200px">
        <ActionBar :actions="manyActions" :max-visible="3" />
      </div>
    </Variant>
  </Story>
</template>
