<script setup lang="ts">
import { ref } from 'vue'
import Table from '@lists/Table.vue'
import type { ColumnDef, SortState } from '@core/types'
const sort = ref<SortState | undefined>(undefined)
const resizableColumns = ref(false)

const columns: ColumnDef[] = [
  { id: 'name', label: 'Name', sortable: true, width: 180 },
  { id: 'type', label: 'Type', sortable: true, width: 100 },
  { id: 'size', label: 'Size', sortable: true, width: 80, align: 'right' },
  { id: 'modified', label: 'Modified', sortable: true, width: 140 },
]

const rows = [
  { id: '1', name: 'App.vue', type: 'Vue', size: '2.4 KB', modified: '2 hours ago' },
  { id: '2', name: 'main.ts', type: 'TypeScript', size: '0.8 KB', modified: '3 days ago' },
  { id: '3', name: 'styles.css', type: 'CSS', size: '12.1 KB', modified: '1 week ago' },
  { id: '4', name: 'router.ts', type: 'TypeScript', size: '1.5 KB', modified: '5 days ago' },
  { id: '5', name: 'package.json', type: 'JSON', size: '3.2 KB', modified: '2 days ago' },
  { id: '6', name: 'README.md', type: 'Markdown', size: '4.7 KB', modified: '1 month ago' },
]
</script>

<template>
  <Story title="Table" icon="lucide:table">
    <template #controls>
      <HstCheckbox v-model="resizableColumns" title="Resizable Columns" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px">
        <Table
          v-model:sort="sort"
          :columns="columns"
          :rows="rows"
          row-key="id"
          :resizable-columns="resizableColumns"
        />
      </div>
    </Variant>

    <Variant title="Empty">
      <div style="padding: 24px">
        <Table :columns="columns" :rows="[]" row-key="id">
          <template #empty>
            <div style="padding: 32px; text-align: center">No data available</div>
          </template>
        </Table>
      </div>
    </Variant>
  </Story>
</template>
