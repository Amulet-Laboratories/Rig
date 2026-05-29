<script setup lang="ts">
import DataGrid from './DataGrid.vue'
import { ref } from 'vue'

const lastRowClick = ref('')
const lastSort = ref('')

const columns = [
  { key: 'name', label: 'Name', sortable: true, resizable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'email', label: 'Email', width: 200 },
]

const rows = [
  { name: 'Alice Chen', role: 'Engineer', status: 'Active', email: 'alice@example.com' },
  { name: 'Bob Smith', role: 'Designer', status: 'Away', email: 'bob@example.com' },
  { name: 'Carol Davis', role: 'PM', status: 'Active', email: 'carol@example.com' },
  { name: 'Dan Wilson', role: 'Engineer', status: 'Offline', email: 'dan@example.com' },
  { name: 'Eve Taylor', role: 'QA', status: 'Active', email: 'eve@example.com' },
]

function onRowClick(row: Record<string, unknown>) {
  lastRowClick.value = `Clicked: ${row.name}`
}

function onSort(column: string, direction: string) {
  lastSort.value = `Sort: ${column} ${direction}`
}
</script>

<template>
  <Story title="DataGrid" icon="lucide:table-2" group="lists">
    <Variant title="Default">
      <DataGrid :columns="columns" :rows="rows" @sort="onSort" @row-click="onRowClick" />
      <div style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        <span v-if="lastRowClick">{{ lastRowClick }}</span>
        <span v-if="lastSort"> | {{ lastSort }}</span>
        <span v-if="!lastRowClick && !lastSort">Click a row or sort a column</span>
      </div>
    </Variant>

    <Variant title="Custom Column Slot">
      <DataGrid :columns="columns" :rows="rows">
        <template #status="{ value }">
          <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px">
            <span
              style="width: 6px; height: 6px; border-radius: 50%"
              :style="{
                background:
                  value === 'Active' ? '#22c55e' : value === 'Away' ? '#eab308' : '#6b7280',
              }"
            />
            {{ value }}
          </span>
        </template>
      </DataGrid>
    </Variant>

    <Variant title="Empty State">
      <DataGrid
        :columns="[
          { key: 'id', label: '#', width: 60 },
          { key: 'title', label: 'Title' },
        ]"
        :rows="[]"
      >
        <template #empty>
          <div style="padding: 24px; text-align: center; color: var(--muted-foreground)">
            No data available. Add some rows to get started.
          </div>
        </template>
      </DataGrid>
    </Variant>

    <Variant title="Minimal">
      <DataGrid
        :columns="[
          { key: 'id', label: '#', width: 60 },
          { key: 'title', label: 'Title' },
        ]"
        :rows="[
          { id: 1, title: 'First item' },
          { id: 2, title: 'Second item' },
          { id: 3, title: 'Third item' },
        ]"
      />
    </Variant>
  </Story>
</template>
