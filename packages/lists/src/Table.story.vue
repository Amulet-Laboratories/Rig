<script setup lang="ts">
import Table from './Table.vue'
import { ref } from 'vue'

const columns = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'type', label: 'Type', sortable: true },
  { id: 'size', label: 'Size' },
  { id: 'modified', label: 'Modified', sortable: true },
]

const rows = [
  { name: 'package.json', type: 'JSON', size: '1.2 KB', modified: '2024-01-15' },
  { name: 'tsconfig.json', type: 'JSON', size: '0.8 KB', modified: '2024-01-10' },
  { name: 'vite.config.ts', type: 'TypeScript', size: '0.5 KB', modified: '2024-02-01' },
  { name: 'README.md', type: 'Markdown', size: '3.2 KB', modified: '2024-01-20' },
  { name: 'index.html', type: 'HTML', size: '0.4 KB', modified: '2024-01-05' },
]

const sort = ref<{ column: string; direction: 'asc' | 'desc' }>({
  column: 'name',
  direction: 'asc',
})
const lastRowClick = ref('')
const lastCellClick = ref('')

function onRowClick(row: Record<string, unknown>) {
  lastRowClick.value = `Row: ${row.name}`
}

function onCellClick({ row, column }: { row: Record<string, unknown>; column: { id: string } }) {
  lastCellClick.value = `Cell: ${row[column.id as keyof typeof row]} (${column.id})`
}
</script>

<template>
  <Story title="Table" icon="lucide:table" group="lists">
    <Variant title="Default">
      <Table :columns="columns" :rows="rows" row-key="name" />
    </Variant>

    <Variant title="Sortable">
      <Table
        :columns="columns"
        :rows="rows"
        row-key="name"
        :sort="sort"
        @update:sort="(s) => (sort = s)"
      />
      <div style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        Sorting by: {{ sort.column }} ({{ sort.direction }})
      </div>
    </Variant>

    <Variant title="Row & Cell Clicks">
      <Table
        :columns="columns"
        :rows="rows"
        row-key="name"
        @row-click="onRowClick"
        @cell-click="onCellClick"
      />
      <div style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        <span v-if="lastRowClick">{{ lastRowClick }}</span>
        <span v-if="lastCellClick"> | {{ lastCellClick }}</span>
        <span v-if="!lastRowClick && !lastCellClick">Click a row or cell</span>
      </div>
    </Variant>

    <Variant title="Custom Cell & Header Slots">
      <Table :columns="columns" :rows="rows" row-key="name">
        <template #header-name="{ column }">
          <span style="font-weight: 700; color: var(--primary)">{{ column.label }} &#9733;</span>
        </template>
        <template #cell-type="{ value }">
          <span
            style="padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 500"
            :style="{
              background:
                value === 'TypeScript' ? '#3178c622' : value === 'JSON' ? '#eab30822' : '#6b728022',
              color: value === 'TypeScript' ? '#3178c6' : value === 'JSON' ? '#eab308' : '#6b7280',
            }"
          >
            {{ value }}
          </span>
        </template>
      </Table>
    </Variant>

    <Variant title="Resizable Columns">
      <Table :columns="columns" :rows="rows" row-key="name" resizable-columns />
    </Variant>

    <Variant title="Empty">
      <Table :columns="columns" :rows="[]" row-key="name">
        <template #empty>
          <div style="padding: 24px; text-align: center; color: var(--muted-foreground)">
            No files found
          </div>
        </template>
      </Table>
    </Variant>
  </Story>
</template>
