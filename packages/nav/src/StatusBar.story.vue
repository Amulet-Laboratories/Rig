<script setup lang="ts">
import StatusBar from './StatusBar.vue'
</script>

<template>
  <Story title="StatusBar" icon="lucide:panel-bottom" group="nav">
    <Variant title="Default">
      <StatusBar
        :items="[
          { id: 'branch', content: 'main', priority: 1, align: 'left' },
          { id: 'sync', content: '0↓ 0↑', priority: 2, align: 'left' },
          { id: 'errors', content: '0 Errors', priority: 3, align: 'left' },
          { id: 'warnings', content: '0 Warnings', priority: 4, align: 'left' },
          { id: 'line', content: 'Ln 42, Col 18', priority: 1, align: 'right' },
          { id: 'encoding', content: 'UTF-8', priority: 2, align: 'right' },
          { id: 'lang', content: 'TypeScript', priority: 3, align: 'right' },
        ]"
        @item-click="() => {}"
      />
    </Variant>

    <Variant title="With Slots">
      <StatusBar :items="[]">
        <template #left>
          <span style="padding: 0 8px; font-size: 11px; color: var(--primary-foreground)"
            >Custom Left</span
          >
        </template>
        <template #right>
          <span style="padding: 0 8px; font-size: 11px; color: var(--primary-foreground)"
            >Custom Right</span
          >
        </template>
      </StatusBar>
    </Variant>
  </Story>
</template>
