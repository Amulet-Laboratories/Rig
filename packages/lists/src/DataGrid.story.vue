<script setup lang="ts">
import DataGrid from './DataGrid.vue'
import { ref } from 'vue'

const lastRowClick = ref('')
const lastSort = ref('')

import type { DataGridColumn } from './DataGrid.vue'

const columns: DataGridColumn[] = [
  { key: 'name', label: 'Name', sortable: true, resizable: true, filter: 'text' },
  { key: 'role', label: 'Role', sortable: true, filter: 'select', hideable: true },
  { key: 'status', label: 'Status', filter: 'select', hideable: true },
  { key: 'email', label: 'Email', width: 200, hideable: true },
]

const rows = [
  { id: 1, name: 'Alice Chen', role: 'Engineer', status: 'Active', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', role: 'Designer', status: 'Away', email: 'bob@example.com' },
  { id: 3, name: 'Carol Davis', role: 'PM', status: 'Active', email: 'carol@example.com' },
  { id: 4, name: 'Dan Wilson', role: 'Engineer', status: 'Offline', email: 'dan@example.com' },
  { id: 5, name: 'Eve Taylor', role: 'QA', status: 'Active', email: 'eve@example.com' },
]

// Typed columns — the point of the Sorting variant is that these three sort by
// value rather than by their string spelling.
const typedColumns: DataGridColumn[] = [
  { key: 'invoice', label: 'Invoice', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, type: 'number', width: 120 },
  { key: 'due', label: 'Due', sortable: true, type: 'date', width: 130 },
]

const typedRows = [
  { invoice: 'INV-9', amount: 9, due: '2026-03-01' },
  { invoice: 'INV-100', amount: 100, due: '2025-12-31' },
  { invoice: 'INV-20', amount: 20, due: null },
  { invoice: 'INV-3', amount: 1250.5, due: '2026-01-15' },
]

const ledger = Array.from({ length: 240 }, (_, i) => ({
  id: i + 1,
  entry: `Entry ${i + 1}`,
  amount: Math.round(Math.sin(i) * 5000) / 10,
}))

const bigColumns: DataGridColumn[] = [
  { key: 'id', label: '#', width: 70, sortable: true, type: 'number' },
  { key: 'entry', label: 'Entry', sortable: true, filter: 'text' },
  { key: 'amount', label: 'Amount', sortable: true, type: 'number', width: 120 },
]

const selection = ref<unknown[]>([])
const density = ref<'compact' | 'default' | 'comfortable'>('default')

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

    <Variant title="Sorting by type">
      <DataGrid :columns="typedColumns" :rows="typedRows" />
      <div style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        Amount sorts numerically (9 &lt; 20 &lt; 100), Due sorts chronologically, and the blank due
        date stays at the bottom in both directions.
      </div>
    </Variant>

    <Variant title="Search, filters and column picker">
      <DataGrid :columns="columns" :rows="rows" searchable filterable column-picker sticky-header />
    </Variant>

    <Variant title="Selection">
      <DataGrid
        v-model:selection="selection"
        :columns="columns"
        :rows="rows"
        selectable
        row-key="id"
      />
      <div style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        Selected: {{ selection.length ? selection.join(', ') : 'none' }} — the header checkbox
        covers the filtered set, not every loaded row.
      </div>
    </Variant>

    <Variant title="Paged">
      <DataGrid
        :columns="bigColumns"
        :rows="ledger"
        :page-size="12"
        searchable
        filterable
        sticky-header
      />
    </Variant>

    <Variant title="Virtual (240 rows)">
      <DataGrid
        :columns="bigColumns"
        :rows="ledger"
        virtual
        :row-height="33"
        max-height="320px"
        sticky-header
      />
    </Variant>

    <Variant title="Playground">
      <DataGrid
        :columns="columns"
        :rows="rows"
        :density="density"
        searchable
        filterable
        column-picker
        selectable
        row-key="id"
        sticky-header
      />
      <template #controls>
        <HstSelect
          v-model="density"
          title="Density"
          :options="['compact', 'default', 'comfortable']"
        />
      </template>
    </Variant>
  </Story>
</template>
