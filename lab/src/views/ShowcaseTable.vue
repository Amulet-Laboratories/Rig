<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { HealthManifest, ShowcaseHealth } from '../types'
import manifest from '@health/manifest.json'

const router = useRouter()

const data = manifest as unknown as HealthManifest

const searchQuery = ref('')
type SortField =
  | 'name'
  | 'componentCount'
  | 'packageCount'
  | 'loc'
  | 'e2e'
  | 'avgComponentScore'
  | 'coverageReach'
  | 'testedRatio'
  | 'avgCoverage'
  | 'packageBreadth'

const sortBy = ref<SortField>('avgComponentScore')
const sortDir = ref<'asc' | 'desc'>('desc')

function numericVal(s: ShowcaseHealth, field: SortField): number {
  switch (field) {
    case 'componentCount': return s.componentCount
    case 'packageCount': return s.packageCount
    case 'loc': return s.loc
    case 'e2e': return s.hasE2e ? 1 : 0
    case 'avgComponentScore': return s.avgComponentScore
    case 'coverageReach': return s.coverageReach
    case 'testedRatio': return s.testedRatio
    case 'avgCoverage': return s.avgCoverage
    case 'packageBreadth': return s.packageBreadth
    default: return 0
  }
}

const filtered = computed(() => {
  let items = [...data.showcases]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.componentsUsed.some((c) => c.toLowerCase().includes(q)) ||
        s.packagesUsed.some((p) => p.toLowerCase().includes(q)),
    )
  }

  items.sort((a, b) => {
    let cmp = 0
    if (sortBy.value === 'name') {
      cmp = a.name.localeCompare(b.name)
    } else {
      cmp = numericVal(a, sortBy.value) - numericVal(b, sortBy.value)
    }
    return sortDir.value === 'asc' ? cmp : -cmp
  })

  return items
})

function toggleSort(field: SortField) {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDir.value = field === 'name' ? 'asc' : 'desc'
  }
}

function sortIndicator(field: SortField): string {
  if (sortBy.value !== field) return ''
  return sortDir.value === 'asc' ? ' \u2191' : ' \u2193'
}

const totalComponents = computed(() => {
  const set = new Set<string>()
  for (const s of data.showcases) {
    for (const c of s.componentsUsed) {
      set.add(c)
    }
  }
  return set.size
})

const avgReach = computed(() => {
  if (data.showcases.length === 0) return 0
  return Math.round(
    data.showcases.reduce((s, c) => s + c.coverageReach, 0) / data.showcases.length * 10,
  ) / 10
})

const avgScore = computed(() => {
  if (data.showcases.length === 0) return 0
  return Math.round(
    data.showcases.reduce((s, c) => s + c.avgComponentScore, 0) / data.showcases.length,
  )
})

const columns: { field: SortField; label: string; width: string; align: 'left' | 'right' }[] = [
  { field: 'name', label: 'Showcase', width: '1fr', align: 'left' },
  { field: 'avgComponentScore', label: 'Health', width: '70px', align: 'right' },
  { field: 'componentCount', label: 'Comps', width: '70px', align: 'right' },
  { field: 'coverageReach', label: 'Reach', width: '70px', align: 'right' },
  { field: 'testedRatio', label: 'Tested', width: '74px', align: 'right' },
  { field: 'avgCoverage', label: 'Coverage', width: '82px', align: 'right' },
  { field: 'packageBreadth', label: 'Breadth', width: '74px', align: 'right' },
  { field: 'loc', label: 'LOC', width: '64px', align: 'right' },
  { field: 'e2e', label: 'E2E', width: '48px', align: 'right' },
]

const gridCols = columns.map((c) => c.width).join(' ')

function scoreColor(score: number): string {
  if (score >= 85) return '#4ade80'
  if (score >= 70) return '#a3e635'
  if (score >= 55) return '#facc15'
  if (score >= 40) return '#fb923c'
  return '#f87171'
}

function pctColor(pct: number): string {
  if (pct >= 80) return '#4ade80'
  if (pct >= 60) return '#a3e635'
  if (pct >= 40) return '#facc15'
  if (pct >= 20) return '#fb923c'
  return '#f87171'
}

function pkgColor(pkg: string): string {
  const map: Record<string, string> = {
    core: '#94a3b8',
    layout: '#a78bfa',
    nav: '#60a5fa',
    editor: '#34d399',
    lists: '#fbbf24',
    menus: '#fb923c',
    extras: '#f472b6',
    shell: '#c9956d',
  }
  return map[pkg] ?? '#94a3b8'
}
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
          { label: 'Showcases', value: String(data.showcases.length) },
          { label: 'Unique Components', value: String(totalComponents) },
          { label: 'Avg Health', value: String(avgScore) },
          { label: 'Avg Reach', value: avgReach + '%' },
          { label: 'E2E Covered', value: String(data.showcases.filter(s => s.hasE2e).length) },
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

    <!-- Search -->
    <div style="display: flex; gap: 0.75rem; align-items: center">
      <input
        v-model="searchQuery"
        placeholder="Search showcases or components..."
        style="
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          color: inherit;
          font-size: 0.8125rem;
          width: 260px;
          outline: none;
        "
      />
      <span style="margin-left: auto; font-size: 0.75rem; opacity: 0.4">
        {{ filtered.length }} showcases
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
            textAlign: col.align,
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
        v-for="(showcase, i) in filtered"
        :key="showcase.id"
        :style="{
          borderBottom: i < filtered.length - 1 ? '1px solid var(--rig-border, #2a2520)' : 'none',
          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
          cursor: 'pointer',
        }"
        @click="router.push({ name: 'showcase-detail', params: { id: showcase.id } })"
      >
        <!-- Main row -->
        <div
          :style="{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: '0',
            alignItems: 'center',
          }"
        >
          <!-- Name -->
          <div style="padding: 0.625rem; display: flex; flex-direction: column; gap: 0.125rem">
            <span style="font-size: 0.8125rem; font-weight: 600">
              {{ showcase.name }}
            </span>
          </div>

          <!-- Health score -->
          <div style="padding: 0.625rem; text-align: right">
            <span
              :style="{
                fontSize: '0.8125rem',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: scoreColor(showcase.avgComponentScore),
              }"
            >
              {{ showcase.avgComponentScore }}
            </span>
          </div>

          <!-- Component count -->
          <div style="padding: 0.625rem; text-align: right">
            <span style="font-size: 0.8125rem; font-weight: 600; font-variant-numeric: tabular-nums; color: #60a5fa">
              {{ showcase.componentCount }}
            </span>
          </div>

          <!-- Coverage reach -->
          <div style="padding: 0.625rem; text-align: right">
            <span
              :style="{
                fontSize: '0.75rem',
                fontVariantNumeric: 'tabular-nums',
                color: pctColor(showcase.coverageReach * 3),
              }"
            >
              {{ showcase.coverageReach }}%
            </span>
          </div>

          <!-- Tested ratio -->
          <div style="padding: 0.625rem; text-align: right">
            <span
              :style="{
                fontSize: '0.75rem',
                fontVariantNumeric: 'tabular-nums',
                color: pctColor(showcase.testedRatio),
              }"
            >
              {{ showcase.testedRatio }}%
            </span>
          </div>

          <!-- Avg coverage -->
          <div style="padding: 0.625rem; text-align: right">
            <span
              :style="{
                fontSize: '0.75rem',
                fontVariantNumeric: 'tabular-nums',
                color: pctColor(showcase.avgCoverage),
              }"
            >
              {{ showcase.avgCoverage }}%
            </span>
          </div>

          <!-- Package breadth -->
          <div style="padding: 0.625rem; text-align: right">
            <span
              :style="{
                fontSize: '0.75rem',
                fontVariantNumeric: 'tabular-nums',
                color: pctColor(showcase.packageBreadth),
              }"
            >
              {{ showcase.packageBreadth }}%
            </span>
          </div>

          <!-- LOC -->
          <div style="padding: 0.625rem; text-align: right">
            <span style="font-size: 0.75rem; font-variant-numeric: tabular-nums; opacity: 0.6">
              {{ showcase.loc }}
            </span>
          </div>

          <!-- E2E -->
          <div style="padding: 0.625rem; text-align: right">
            <span
              v-if="showcase.hasE2e"
              style="font-size: 0.75rem; color: #4ade80; font-weight: 600"
            >
              &#10003;
            </span>
            <span v-else style="font-size: 0.6875rem; opacity: 0.2">&mdash;</span>
          </div>
        </div>

        <!-- Expanded detail: packages + components used -->
        <div style="padding: 0 0.625rem 0.5rem; display: flex; flex-wrap: wrap; gap: 0.25rem">
          <!-- Package pills -->
          <span
            v-for="pkg in showcase.packagesUsed"
            :key="pkg"
            :style="{
              fontSize: '0.5625rem',
              padding: '0.0625rem 0.375rem',
              borderRadius: '9999px',
              background: `${pkgColor(pkg)}15`,
              color: pkgColor(pkg),
              border: `1px solid ${pkgColor(pkg)}30`,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 600,
            }"
          >
            {{ pkg }}
          </span>

          <span style="width: 1px; background: var(--rig-border, #2a2520); margin: 0 0.25rem" />

          <!-- Component pills -->
          <span
            v-for="comp in showcase.componentsUsed"
            :key="comp"
            style="
              font-size: 0.625rem;
              padding: 0.0625rem 0.375rem;
              border-radius: 0.1875rem;
              background: rgba(255, 255, 255, 0.04);
              opacity: 0.6;
            "
          >
            {{ comp }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="filtered.length === 0"
      style="text-align: center; padding: 3rem; opacity: 0.4; font-size: 0.875rem"
    >
      No showcases match the current search
    </div>

    <!-- Diagnostics section -->
    <div v-if="data.diagnostics && data.diagnostics.length > 0" style="margin-top: 1rem">
      <div
        style="
          font-size: 0.6875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.4;
          margin-bottom: 0.5rem;
        "
      >
        Diagnostics (not showcases)
      </div>
      <div
        style="
          border: 1px solid var(--rig-border, #2a2520);
          border-radius: 0.5rem;
          overflow: hidden;
        "
      >
        <div
          v-for="(diag, i) in data.diagnostics"
          :key="diag.id"
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.625rem',
            borderBottom: i < data.diagnostics.length - 1 ? '1px solid var(--rig-border, #2a2520)' : 'none',
            opacity: 0.5,
          }"
        >
          <span style="font-size: 0.8125rem; font-weight: 500">{{ diag.name }}</span>
          <span style="font-size: 0.625rem; opacity: 0.5; font-variant-numeric: tabular-nums">
            {{ diag.componentCount }} comps
          </span>
          <span style="font-size: 0.625rem; opacity: 0.5; font-variant-numeric: tabular-nums">
            {{ diag.loc }} LOC
          </span>
          <span style="margin-left: auto; font-size: 0.5625rem; opacity: 0.4; font-style: italic">
            measurement view
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
