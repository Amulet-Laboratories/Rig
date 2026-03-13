<script setup lang="ts">
/**
 * Performance — Test results, coverage metrics, and historical trends.
 * Shows Rig's own health data in sortable tables so we can track improvement.
 */
import { ref, computed } from 'vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Table from '@lists/Table.vue'
import type { ColumnDef, SortState } from '@core/types'
import { healthData } from './fixtures/health-data'

// ---- Coverage table ----
const covSort = ref<SortState>({ column: 'name', direction: 'asc' })

const covColumns: ColumnDef[] = [
  { id: 'name', label: 'Package', sortable: true, width: 100 },
  { id: 'components', label: 'Components', sortable: true, align: 'right', width: 100 },
  { id: 'testFiles', label: 'Tests', sortable: true, align: 'right', width: 80 },
  { id: 'benchFiles', label: 'Bench', sortable: true, align: 'right', width: 70 },
  { id: 'statements', label: 'Stmts %', sortable: true, align: 'right', width: 80 },
  { id: 'branches', label: 'Branch %', sortable: true, align: 'right', width: 80 },
  { id: 'functions', label: 'Funcs %', sortable: true, align: 'right', width: 80 },
  { id: 'lines', label: 'Lines %', sortable: true, align: 'right', width: 80 },
]

const covRows = computed(() => {
  const rows = healthData.rig.packages.map((p) => ({
    name: p.name,
    components: p.components,
    testFiles: p.testFiles,
    benchFiles: p.benchFiles,
    statements: p.coverage.statements,
    branches: p.coverage.branches,
    functions: p.coverage.functions,
    lines: p.coverage.lines,
  }))

  const { column, direction } = covSort.value
  return [...rows].sort((a, b) => {
    const av = a[column as keyof typeof a]
    const bv = b[column as keyof typeof b]
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
    return direction === 'asc' ? cmp : -cmp
  })
})

// ---- E2E table ----
const e2eColumns: ColumnDef[] = [
  { id: 'name', label: 'Suite', width: 160 },
  { id: 'tests', label: 'Tests', align: 'right', width: 80 },
]

const e2eRows = healthData.rig.e2e.map((e) => ({
  name: e.name,
  tests: e.tests,
}))

// ---- Hex builds table ----
const hexSort = ref<SortState>({ column: 'name', direction: 'asc' })

const hexColumns: ColumnDef[] = [
  { id: 'name', label: 'Theme', sortable: true, width: 140 },
  { id: 'sizeKB', label: 'Size (KB)', sortable: true, align: 'right', width: 100 },
  { id: 'budget', label: 'Budget (KB)', align: 'right', width: 100 },
  { id: 'status', label: 'Status', align: 'center', width: 80 },
]

const hexRows = computed(() => {
  const rows = healthData.hex.themes.map((t) => ({
    name: t.name,
    sizeKB: t.sizeKB,
    budget: healthData.hex.sizeBudgetKB,
    status: t.sizeKB <= healthData.hex.sizeBudgetKB ? 'pass' : 'fail',
  }))

  const { column, direction } = hexSort.value
  return [...rows].sort((a, b) => {
    const av = a[column as keyof typeof a]
    const bv = b[column as keyof typeof b]
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
    return direction === 'asc' ? cmp : -cmp
  })
})

// ---- History trend table ----
const histColumns: ColumnDef[] = [
  { id: 'date', label: 'Date', width: 110 },
  { id: 'totalTests', label: 'Tests', align: 'right', width: 70 },
  { id: 'totalFiles', label: 'Files', align: 'right', width: 60 },
  { id: 'totalComponents', label: 'Comps', align: 'right', width: 60 },
  { id: 'e2eTests', label: 'E2E', align: 'right', width: 60 },
  { id: 'statements', label: 'Stmts %', align: 'right', width: 80 },
  { id: 'branches', label: 'Branch %', align: 'right', width: 80 },
  { id: 'functions', label: 'Funcs %', align: 'right', width: 80 },
  { id: 'lines', label: 'Lines %', align: 'right', width: 80 },
  { id: 'hexTotalKB', label: 'Hex KB', align: 'right', width: 80 },
]

const histRows = [...healthData.history]
  .reverse()
  .map((s) => ({
    date: s.date,
    totalTests: s.totalTests,
    totalFiles: s.totalFiles,
    totalComponents: s.totalComponents,
    e2eTests: s.e2eTests,
    statements: s.coverage.statements,
    branches: s.coverage.branches,
    functions: s.coverage.functions,
    lines: s.coverage.lines,
    hexTotalKB: s.hexTotalKB,
  }))

// ---- Summary deltas ----
const latest = healthData.history[healthData.history.length - 1]
const previous = healthData.history.length > 1 ? healthData.history[healthData.history.length - 2] : null

function delta(cur: number, prev: number | undefined): string {
  if (prev === undefined) return ''
  const d = cur - prev
  return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1)
}

function deltaSign(cur: number, prev: number | undefined): 'up' | 'down' | 'flat' {
  if (prev === undefined) return 'flat'
  const d = cur - prev
  if (d > 0.01) return 'up'
  if (d < -0.01) return 'down'
  return 'flat'
}

// ---- Coverage badge helpers ----
const thresholds = healthData.rig.coverageThresholds

function covBadge(val: number, threshold: number): 'success' | 'warning' | 'destructive' {
  if (val >= threshold) return 'success'
  if (val >= threshold * 0.85) return 'warning'
  return 'destructive'
}
</script>

<template>
  <Story title="Performance" icon="lucide:zap" group="showcase">
    <div class="metrics-root">
      <header class="metrics-header">
        <h2 class="metrics-title">Test Results &amp; Metrics</h2>
        <p class="metrics-desc">
          Coverage, test counts, and build sizes — tracked over time.
          Last generated {{ new Date(healthData.generated).toLocaleDateString() }}.
        </p>
      </header>

      <!-- Summary cards -->
      <div class="metrics-summary">
        <Card class="metrics-card">
          <span class="metrics-card-value">{{ latest.totalTests }}</span>
          <span class="metrics-card-label">Total Tests</span>
          <span
            v-if="previous"
            class="metrics-card-delta"
            :data-sign="deltaSign(latest.totalTests, previous.totalTests)"
          >{{ delta(latest.totalTests, previous.totalTests) }}</span>
        </Card>
        <Card class="metrics-card">
          <span class="metrics-card-value">{{ latest.totalComponents }}</span>
          <span class="metrics-card-label">Components</span>
          <span
            v-if="previous"
            class="metrics-card-delta"
            :data-sign="deltaSign(latest.totalComponents, previous.totalComponents)"
          >{{ delta(latest.totalComponents, previous.totalComponents) }}</span>
        </Card>
        <Card class="metrics-card">
          <span class="metrics-card-value">{{ latest.coverage.statements.toFixed(1) }}%</span>
          <span class="metrics-card-label">Statements</span>
          <span
            v-if="previous"
            class="metrics-card-delta"
            :data-sign="deltaSign(latest.coverage.statements, previous.coverage.statements)"
          >{{ delta(latest.coverage.statements, previous.coverage.statements) }}</span>
        </Card>
        <Card class="metrics-card">
          <span class="metrics-card-value">{{ latest.e2eTests }}</span>
          <span class="metrics-card-label">E2E Tests</span>
          <span
            v-if="previous"
            class="metrics-card-delta"
            :data-sign="deltaSign(latest.e2eTests, previous.e2eTests)"
          >{{ delta(latest.e2eTests, previous.e2eTests) }}</span>
        </Card>
      </div>

      <!-- Coverage by package -->
      <section class="metrics-section">
        <h3 class="metrics-section-title">Coverage by Package</h3>
        <div class="metrics-table-wrap">
          <Table
            :columns="covColumns"
            :rows="(covRows as unknown as Record<string, unknown>[])"
            :sort="covSort"
            rowKey="name"
            @update:sort="covSort = $event"
          >
            <template #cell-statements="{ value }">
              <Badge :variant="covBadge(value as number, thresholds.statements)" size="xs">
                {{ (value as number).toFixed(1) }}%
              </Badge>
            </template>
            <template #cell-branches="{ value }">
              <Badge :variant="covBadge(value as number, thresholds.branches)" size="xs">
                {{ (value as number).toFixed(1) }}%
              </Badge>
            </template>
            <template #cell-functions="{ value }">
              <Badge :variant="covBadge(value as number, thresholds.functions)" size="xs">
                {{ (value as number).toFixed(1) }}%
              </Badge>
            </template>
            <template #cell-lines="{ value }">
              <Badge :variant="covBadge(value as number, thresholds.lines)" size="xs">
                {{ (value as number).toFixed(1) }}%
              </Badge>
            </template>
          </Table>
        </div>
      </section>

      <!-- E2E suites -->
      <section class="metrics-section">
        <h3 class="metrics-section-title">E2E Test Suites</h3>
        <div class="metrics-table-wrap metrics-narrow">
          <Table
            :columns="e2eColumns"
            :rows="(e2eRows as unknown as Record<string, unknown>[])"
            rowKey="name"
          />
        </div>
      </section>

      <!-- Hex builds -->
      <section class="metrics-section">
        <h3 class="metrics-section-title">Hex Theme Builds</h3>
        <div class="metrics-table-wrap">
          <Table
            :columns="hexColumns"
            :rows="(hexRows as unknown as Record<string, unknown>[])"
            :sort="hexSort"
            rowKey="name"
            @update:sort="hexSort = $event"
          >
            <template #cell-sizeKB="{ value }">
              <span class="metrics-mono">{{ (value as number).toFixed(1) }}</span>
            </template>
            <template #cell-status="{ value }">
              <Badge :variant="(value as string) === 'pass' ? 'success' : 'destructive'" size="xs">
                {{ value }}
              </Badge>
            </template>
          </Table>
        </div>
      </section>

      <!-- Historical trend -->
      <section class="metrics-section">
        <h3 class="metrics-section-title">Historical Trend</h3>
        <p class="metrics-section-desc">Snapshot comparisons across releases.</p>
        <div class="metrics-table-wrap">
          <Table
            :columns="histColumns"
            :rows="(histRows as unknown as Record<string, unknown>[])"
            rowKey="date"
          >
            <template #cell-statements="{ value }">
              <Badge :variant="covBadge(value as number, thresholds.statements)" size="xs">
                {{ (value as number).toFixed(1) }}%
              </Badge>
            </template>
            <template #cell-branches="{ value }">
              <Badge :variant="covBadge(value as number, thresholds.branches)" size="xs">
                {{ (value as number).toFixed(1) }}%
              </Badge>
            </template>
            <template #cell-functions="{ value }">
              <Badge :variant="covBadge(value as number, thresholds.functions)" size="xs">
                {{ (value as number).toFixed(1) }}%
              </Badge>
            </template>
            <template #cell-lines="{ value }">
              <Badge :variant="covBadge(value as number, thresholds.lines)" size="xs">
                {{ (value as number).toFixed(1) }}%
              </Badge>
            </template>
            <template #cell-hexTotalKB="{ value }">
              <span class="metrics-mono">{{ value }}</span>
            </template>
          </Table>
        </div>
      </section>
    </div>
  </Story>
</template>

<style scoped>
.metrics-root {
  padding: 16px;
  max-width: 900px;
}

.metrics-header {
  margin-bottom: 20px;
}

.metrics-title {
  font-family: var(--font-mono, monospace);
  font-size: 18px;
  color: var(--color-foreground, #d4d4d4);
  margin: 0 0 6px;
}

.metrics-desc {
  font-size: 13px;
  color: var(--color-muted-foreground, #888);
  margin: 0;
}

/* Summary cards */
.metrics-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.metrics-card {
  text-align: center;
  padding: 12px 8px;
  position: relative;
}

.metrics-card-value {
  display: block;
  font-family: var(--font-mono, monospace);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-primary, #c9956d);
}

.metrics-card-label {
  display: block;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground, #888);
  margin-top: 2px;
}

.metrics-card-delta {
  display: block;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  margin-top: 4px;
}

.metrics-card-delta[data-sign='up'] {
  color: var(--color-success, #4caf50);
}

.metrics-card-delta[data-sign='down'] {
  color: var(--color-destructive, #e74c3c);
}

.metrics-card-delta[data-sign='flat'] {
  color: var(--color-muted-foreground, #888);
}

/* Sections */
.metrics-section {
  margin-bottom: 24px;
}

.metrics-section-title {
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  color: var(--color-foreground, #d4d4d4);
  margin: 0 0 4px;
}

.metrics-section-desc {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  margin: 0 0 8px;
}

/* Table wrappers */
.metrics-table-wrap {
  border: 1px solid var(--color-border, #333);
  border-radius: var(--radius, 4px);
  overflow: auto;
  background: var(--color-background, #1a1a1a);
}

.metrics-narrow {
  max-width: 320px;
}

.metrics-mono {
  font-family: var(--font-mono, monospace);
}
</style>
