<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { HealthManifest, ComponentHealth, Grade } from '../types'
import { GRADE_COLORS, GRADE_BG } from '../types'
import HealthBadge from '../components/HealthBadge.vue'
import manifest from '@health/manifest.json'

const data = manifest as unknown as HealthManifest
const router = useRouter()

// Filters
const searchQuery = ref('')
const filterPackage = ref<string | null>(null)
const filterGrade = ref<Grade | null>(null)
const filterType = ref<'all' | 'component' | 'composable'>('all')

type SortField =
  | 'name'
  | 'package'
  | 'score'
  | 'tests'
  | 'coverage'
  | 'stmts'
  | 'branches'
  | 'functions'
  | 'lines'
  | 'a11y'
  | 'story'
  | 'hex'
  | 'bench'
  | 'loc'
  | 'gaps'
const sortBy = ref<SortField>('score')
const sortDir = ref<'asc' | 'desc'>('desc')

const packages = computed(() => data.summary.packages.map((p) => p.name))

function coverageAvg(c: ComponentHealth): number {
  if (!c.coverage) return 0
  return (c.coverage.statements + c.coverage.branches + c.coverage.functions + c.coverage.lines) / 4
}

function sortValue(c: ComponentHealth, field: SortField): number | string {
  switch (field) {
    case 'name': return c.name
    case 'package': return c.package
    case 'score': return c.score
    case 'tests': return c.tests?.total ?? -1
    case 'coverage': return coverageAvg(c)
    case 'stmts': return c.coverage?.statements ?? -1
    case 'branches': return c.coverage?.branches ?? -1
    case 'functions': return c.coverage?.functions ?? -1
    case 'lines': return c.coverage?.lines ?? -1
    case 'a11y': return c.a11y?.patterns.length ?? -1
    case 'story': return c.story.variants
    case 'hex': return c.hexCoverage.selectors.length
    case 'bench': return c.benchmark.results.length
    case 'loc': return c.sourceMetrics.loc
    case 'gaps': return c.gaps.length
  }
}

const filtered = computed(() => {
  let items = [...data.components]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(
      (c) => c.name.toLowerCase().includes(q) || c.package.toLowerCase().includes(q),
    )
  }

  if (filterPackage.value) {
    items = items.filter((c) => c.package === filterPackage.value)
  }

  if (filterGrade.value) {
    items = items.filter((c) => c.grade === filterGrade.value)
  }

  if (filterType.value !== 'all') {
    items = items.filter((c) => c.type === filterType.value)
  }

  items.sort((a, b) => {
    const va = sortValue(a, sortBy.value)
    const vb = sortValue(b, sortBy.value)
    let cmp = typeof va === 'string' ? (va as string).localeCompare(vb as string) : (va as number) - (vb as number)
    return sortDir.value === 'asc' ? cmp : -cmp
  })

  return items
})

function goToComponent(c: ComponentHealth) {
  router.push({ name: 'detail', params: { name: c.name } })
}

function coverageColor(v: number): string {
  if (v >= 70) return '#4ade80'
  if (v >= 50) return '#facc15'
  return '#f87171'
}

function testColor(c: ComponentHealth): string {
  if (!c.tests) return 'rgba(255,255,255,0.2)'
  if (c.tests.failed > 0) return '#f87171'
  return '#4ade80'
}

function toggleSort(field: SortField) {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDir.value = field === 'name' || field === 'package' ? 'asc' : 'desc'
  }
}

function sortIndicator(field: SortField): string {
  if (sortBy.value !== field) return ''
  return sortDir.value === 'asc' ? ' \u2191' : ' \u2193'
}

const columns: { field: SortField; label: string; width: string }[] = [
  { field: 'score', label: 'Score', width: '70px' },
  { field: 'name', label: 'Component', width: '1fr' },
  { field: 'package', label: 'Pkg', width: '80px' },
  { field: 'tests', label: 'Tests', width: '90px' },
  { field: 'stmts', label: 'Stmts', width: '64px' },
  { field: 'branches', label: 'Branch', width: '64px' },
  { field: 'functions', label: 'Funcs', width: '64px' },
  { field: 'lines', label: 'Lines', width: '64px' },
  { field: 'a11y', label: 'A11y', width: '56px' },
  { field: 'story', label: 'Story', width: '56px' },
  { field: 'hex', label: 'Hex', width: '48px' },
  { field: 'bench', label: 'Bench', width: '56px' },
  { field: 'loc', label: 'LOC', width: '52px' },
  { field: 'gaps', label: 'Gaps', width: '48px' },
]

const gridCols = columns.map((c) => c.width).join(' ')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 1400px; margin: 0 auto; width: 100%">
    <!-- Summary row -->
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
      "
    >
      <div
        v-for="stat in [
          { label: 'Components', value: data.summary.totalComponents },
          { label: 'Composables', value: data.summary.totalComposables },
          { label: 'Tests', value: `${data.summary.totalPassed}/${data.summary.totalTests}` },
          { label: 'Avg Score', value: data.summary.averageScore },
          { label: 'Coverage', value: data.summary.overallCoverage ? `${data.summary.overallCoverage.statements}%` : 'N/A' },
          { label: 'Total Gaps', value: data.summary.totalGaps },
          { label: 'Total LOC', value: data.summary.totalLoc.toLocaleString() },
        ]"
        :key="stat.label"
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          background: var(--rig-surface, #1a1815);
          border: 1px solid var(--rig-border, #2a2520);
        "
      >
        <div style="font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.5">
          {{ stat.label }}
        </div>
        <div style="font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; font-variant-numeric: tabular-nums">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <!-- Grade distribution -->
    <div style="display: flex; gap: 0.5rem; align-items: center">
      <button
        v-for="grade in (['A', 'B', 'C', 'D', 'F'] as Grade[])"
        :key="grade"
        :style="{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          border: filterGrade === grade ? `1px solid ${GRADE_COLORS[grade]}` : '1px solid transparent',
          background: filterGrade === grade ? GRADE_BG[grade] : 'rgba(255,255,255,0.04)',
          color: GRADE_COLORS[grade],
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: 600,
        }"
        @click="filterGrade = filterGrade === grade ? null : grade"
      >
        {{ grade }}: {{ data.summary.gradeDistribution[grade] }}
      </button>
    </div>

    <!-- Filters -->
    <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap">
      <input
        v-model="searchQuery"
        placeholder="Search components..."
        style="
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          color: inherit;
          font-size: 0.8125rem;
          width: 200px;
          outline: none;
        "
      />

      <select
        :value="filterPackage ?? ''"
        style="
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          color: inherit;
          font-size: 0.8125rem;
          cursor: pointer;
        "
        @change="filterPackage = ($event.target as HTMLSelectElement).value || null"
      >
        <option value="">All packages</option>
        <option v-for="pkg in packages" :key="pkg" :value="pkg">{{ pkg }}</option>
      </select>

      <select
        v-model="filterType"
        style="
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          color: inherit;
          font-size: 0.8125rem;
          cursor: pointer;
        "
      >
        <option value="all">All types</option>
        <option value="component">Components</option>
        <option value="composable">Composables</option>
      </select>

      <span style="margin-left: auto; font-size: 0.75rem; opacity: 0.4">
        {{ filtered.length }} items
      </span>
    </div>

    <!-- Data table -->
    <div
      style="
        border: 1px solid var(--rig-border, #2a2520);
        border-radius: 0.5rem;
        overflow: hidden;
      "
    >
      <!-- Header -->
      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: '0',
          background: 'var(--rig-surface, #1a1815)',
          borderBottom: '1px solid var(--rig-border, #2a2520)',
        }"
      >
        <button
          v-for="col in columns"
          :key="col.field"
          :style="{
            padding: '0.5rem 0.625rem',
            border: 'none',
            background: sortBy === col.field ? 'rgba(201, 149, 109, 0.08)' : 'transparent',
            color: sortBy === col.field ? 'var(--rig-accent, #c9956d)' : 'inherit',
            cursor: 'pointer',
            fontSize: '0.6875rem',
            fontWeight: 600,
            textAlign: col.field === 'name' ? 'left' : 'right',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            opacity: sortBy === col.field ? 1 : 0.5,
          }"
          @click="toggleSort(col.field)"
        >
          {{ col.label }}{{ sortIndicator(col.field) }}
        </button>
      </div>

      <!-- Rows -->
      <div
        v-for="(comp, i) in filtered"
        :key="comp.name"
        :style="{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: '0',
          borderBottom: i < filtered.length - 1 ? '1px solid var(--rig-border, #2a2520)' : 'none',
          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
          cursor: 'pointer',
          transition: 'background 0.1s ease',
        }"
        @click="goToComponent(comp)"
        @mouseenter="($event.currentTarget as HTMLElement).style.background = 'rgba(201, 149, 109, 0.06)'"
        @mouseleave="($event.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'"
      >
        <!-- Score + Grade -->
        <div style="display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem 0.625rem">
          <HealthBadge :grade="comp.grade" :score="comp.score" size="sm" />
          <span style="font-size: 0.75rem; font-weight: 600; font-variant-numeric: tabular-nums; opacity: 0.7">
            {{ comp.score }}
          </span>
        </div>

        <!-- Name -->
        <div style="display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem 0.625rem; overflow: hidden">
          <span style="font-size: 0.8125rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ comp.name }}
          </span>
          <span
            v-if="comp.type === 'composable'"
            style="
              font-size: 0.5625rem;
              padding: 0.0625rem 0.3125rem;
              border-radius: 9999px;
              background: rgba(201, 149, 109, 0.12);
              color: var(--rig-accent, #c9956d);
              flex-shrink: 0;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              font-weight: 600;
            "
          >
            fn
          </span>
        </div>

        <!-- Package -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span style="font-size: 0.6875rem; opacity: 0.5">{{ comp.package }}</span>
        </div>

        <!-- Tests -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.tests"
            :style="{
              fontSize: '0.75rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
              color: testColor(comp),
            }"
          >
            {{ comp.tests.passed }}/{{ comp.tests.total }}
            <span style="opacity: 0.4; font-weight: 400; font-size: 0.625rem; margin-left: 0.125rem">
              {{ comp.tests.duration }}ms
            </span>
          </span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- Statements -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.coverage"
            :style="{
              fontSize: '0.75rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
              color: coverageColor(comp.coverage.statements),
            }"
          >
            {{ comp.coverage.statements.toFixed(0) }}
          </span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- Branches -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.coverage"
            :style="{
              fontSize: '0.75rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
              color: coverageColor(comp.coverage.branches),
            }"
          >
            {{ comp.coverage.branches.toFixed(0) }}
          </span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- Functions -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.coverage"
            :style="{
              fontSize: '0.75rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
              color: coverageColor(comp.coverage.functions),
            }"
          >
            {{ comp.coverage.functions.toFixed(0) }}
          </span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- Lines -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.coverage"
            :style="{
              fontSize: '0.75rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
              color: coverageColor(comp.coverage.lines),
            }"
          >
            {{ comp.coverage.lines.toFixed(0) }}
          </span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- A11y -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.a11y && comp.a11y.patterns.length > 0"
            :style="{
              fontSize: '0.75rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500,
              color: comp.a11y.patterns.length >= 4 ? '#4ade80' : comp.a11y.patterns.length >= 2 ? '#facc15' : '#fb923c',
            }"
            :title="comp.a11y.patterns.join(', ')"
          >
            {{ comp.a11y.patterns.length }}/5
          </span>
          <span v-else-if="comp.a11y" style="font-size: 0.6875rem; opacity: 0.2">0</span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- Story -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.story.exists"
            style="font-size: 0.75rem; font-variant-numeric: tabular-nums; color: #4ade80; font-weight: 500"
            :title="comp.story.path ?? undefined"
          >
            {{ comp.story.variants }}v
          </span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- Hex -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.hexCoverage.hasStyles"
            style="font-size: 0.75rem; color: #4ade80; font-weight: 600"
            :title="comp.hexCoverage.selectors.join(', ')"
          >
            &#10003;
          </span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- Bench -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.benchmark.results.length > 0"
            style="font-size: 0.75rem; font-variant-numeric: tabular-nums; color: #4ade80; font-weight: 500"
          >
            {{ comp.benchmark.results.length }}
          </span>
          <span
            v-else-if="comp.benchmark.available"
            style="font-size: 0.6875rem; opacity: 0.3"
            title="Bench file exists but no results yet"
          >
            &#9675;
          </span>
          <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
        </div>

        <!-- LOC -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span style="font-size: 0.75rem; font-variant-numeric: tabular-nums; opacity: 0.6">
            {{ comp.sourceMetrics.loc }}
          </span>
        </div>

        <!-- Gaps -->
        <div style="display: flex; align-items: center; justify-content: flex-end; padding: 0.5rem 0.625rem">
          <span
            v-if="comp.gaps.length > 0"
            :style="{
              fontSize: '0.75rem',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
              color: comp.gaps.length >= 4 ? '#f87171' : comp.gaps.length >= 2 ? '#facc15' : '#4ade80',
            }"
          >
            {{ comp.gaps.length }}
          </span>
          <span v-else style="font-size: 0.6875rem; color: #4ade80">&#10003;</span>
        </div>
      </div>
    </div>

    <div
      v-if="filtered.length === 0"
      style="text-align: center; padding: 3rem; opacity: 0.4; font-size: 0.875rem"
    >
      No components match the current filters
    </div>
  </div>
</template>
