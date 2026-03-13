<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CompetitorMatrix, CompetitorRow } from '../types'

const raw = (await import('../data/competitors.json')).default as unknown as CompetitorMatrix & {
  notes: Record<string, string>
  vueNative: Record<string, boolean>
}

const competitors = raw.competitors
const matrix = raw.matrix as CompetitorRow[]
const notes = raw.notes ?? {}
const vueNative = raw.vueNative ?? {}

// Filters
type FilterType = 'all' | 'component' | 'composable'
const filterType = ref<FilterType>('all')
const filterPkg = ref<string>('')
const showUnique = ref(false)

const packages = computed(() => {
  const pkgs = new Set(matrix.map((r) => r.package))
  return Array.from(pkgs).sort()
})

const filteredMatrix = computed(() => {
  let rows = matrix
  if (filterType.value !== 'all') rows = rows.filter((r) => r.type === filterType.value)
  if (filterPkg.value) rows = rows.filter((r) => r.package === filterPkg.value)
  if (showUnique.value) rows = rows.filter((r) => r.has.every((v) => v === 0))
  return rows
})

// Stats
const totalRig = matrix.length
const uniqueToRig = computed(() => matrix.filter((r) => r.has.every((v) => v === 0)).length)
const marketStandard = computed(() => matrix.filter((r) => r.has.reduce((a, b) => a + b, 0) >= 5).length)

// Per-competitor overlap
const competitorStats = computed(() => {
  return competitors.map((name, ci) => {
    const shared = matrix.filter((r) => r.has[ci] === 1).length
    return {
      name,
      shared,
      pct: Math.round((shared / totalRig) * 100),
      isVue: vueNative[name] ?? false,
      note: notes[name] ?? '',
    }
  }).sort((a, b) => b.shared - a.shared)
})

// Uniqueness by package
const pkgUniqueness = computed(() => {
  const pkgs = new Map<string, { total: number; unique: number }>()
  for (const row of matrix) {
    if (!pkgs.has(row.package)) pkgs.set(row.package, { total: 0, unique: 0 })
    const p = pkgs.get(row.package)!
    p.total++
    if (row.has.every((v) => v === 0)) p.unique++
  }
  return Array.from(pkgs.entries())
    .map(([name, { total, unique }]) => ({ name, total, unique, pct: Math.round((unique / total) * 100) }))
    .sort((a, b) => b.pct - a.pct)
})

// Category breakdown for the bar chart
const categories = computed(() => {
  const unique = matrix.filter((r) => r.has.every((v) => v === 0)).length
  const rare = matrix.filter((r) => { const s = r.has.reduce((a, b) => a + b, 0); return s >= 1 && s <= 2 }).length
  const common = matrix.filter((r) => { const s = r.has.reduce((a, b) => a + b, 0); return s >= 3 && s <= 5 }).length
  const standard = matrix.filter((r) => r.has.reduce((a, b) => a + b, 0) > 5).length
  return [
    { label: 'Unique to Rig', count: unique, color: '#c9956d', desc: 'No competitor offers' },
    { label: 'Rare (1-2)', count: rare, color: '#a78bfa', desc: 'Few competitors offer' },
    { label: 'Common (3-5)', count: common, color: '#38bdf8', desc: 'Several competitors offer' },
    { label: 'Standard (6+)', count: standard, color: '#4ade80', desc: 'Most competitors offer' },
  ]
})

// Sort state for matrix table
type SortKey = 'name' | 'package' | 'overlap' | number
const sortKey = ref<SortKey>('name')
const sortAsc = ref(true)

const sortedMatrix = computed(() => {
  const rows = [...filteredMatrix.value]
  rows.sort((a, b) => {
    let cmp = 0
    if (sortKey.value === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortKey.value === 'package') cmp = a.package.localeCompare(b.package)
    else if (sortKey.value === 'overlap') cmp = a.has.reduce((s, v) => s + v, 0) - b.has.reduce((s, v) => s + v, 0)
    else cmp = a.has[sortKey.value as number] - b.has[sortKey.value as number]
    return sortAsc.value ? cmp : -cmp
  })
  return rows
})

function setSort(key: SortKey) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

function sortArrow(key: SortKey): string {
  if (sortKey.value !== key) return ''
  return sortAsc.value ? ' \u25B2' : ' \u25BC'
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 1600px; margin: 0 auto; width: 100%">
    <div>
      <h1 style="margin: 0 0 0.25rem; font-size: 1.25rem; font-weight: 700">Competitive Landscape</h1>
      <p style="margin: 0; font-size: 0.8125rem; opacity: 0.5">
        {{ totalRig }} Rig elements compared against {{ competitors.length }} libraries
      </p>
    </div>

    <!-- Summary cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem">
      <div
        v-for="cat in categories"
        :key="cat.label"
        :style="{
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--rig-border, #2a2520)',
          background: 'var(--rig-surface, #1a1815)',
        }"
      >
        <div :style="{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: cat.color }">
          {{ cat.count }}
        </div>
        <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.125rem">{{ cat.label }}</div>
        <div style="font-size: 0.625rem; opacity: 0.4; margin-top: 0.125rem">{{ cat.desc }}</div>
      </div>
    </div>

    <!-- Category bar -->
    <section
      style="
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
      "
    >
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Component Uniqueness Distribution
      </h2>
      <div style="display: flex; height: 24px; border-radius: 0.25rem; overflow: hidden">
        <div
          v-for="cat in categories"
          :key="cat.label"
          :style="{
            width: `${(cat.count / totalRig) * 100}%`,
            background: cat.color,
            minWidth: cat.count > 0 ? '2px' : '0',
          }"
          :title="`${cat.label}: ${cat.count} (${Math.round((cat.count / totalRig) * 100)}%)`"
        />
      </div>
      <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 0.5rem">
        <span v-for="cat in categories" :key="cat.label" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.6875rem">
          <span :style="{ width: '0.5rem', height: '0.5rem', borderRadius: '2px', background: cat.color }" />
          {{ cat.label }} ({{ Math.round((cat.count / totalRig) * 100) }}%)
        </span>
      </div>
    </section>

    <!-- Competitor overlap chart -->
    <section
      style="
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
      "
    >
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Competitor Overlap with Rig
      </h2>
      <div style="display: flex; flex-direction: column; gap: 0.375rem">
        <div v-for="cs in competitorStats" :key="cs.name" style="display: flex; align-items: center; gap: 0.75rem">
          <div style="width: 100px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.375rem; flex-shrink: 0">
            {{ cs.name }}
            <span
              v-if="cs.isVue"
              style="
                font-size: 0.5rem;
                padding: 0.0625rem 0.25rem;
                border-radius: 9999px;
                background: rgba(74, 222, 128, 0.15);
                color: #4ade80;
                font-weight: 700;
              "
            >VUE</span>
            <span
              v-else
              style="
                font-size: 0.5rem;
                padding: 0.0625rem 0.25rem;
                border-radius: 9999px;
                background: rgba(248, 113, 113, 0.15);
                color: #f87171;
                font-weight: 700;
              "
            >N/A</span>
          </div>
          <div style="flex: 1; height: 16px; background: rgba(255,255,255,0.03); border-radius: 0.125rem; overflow: hidden">
            <div
              :style="{
                width: `${cs.pct}%`,
                height: '100%',
                background: cs.isVue ? '#4ade80' : '#38bdf8',
                opacity: 0.6,
                borderRadius: '0.125rem',
                transition: 'width 0.3s ease',
              }"
            />
          </div>
          <span style="font-size: 0.6875rem; font-variant-numeric: tabular-nums; opacity: 0.5; width: 55px; text-align: right; flex-shrink: 0">
            {{ cs.shared }}/{{ totalRig }} ({{ cs.pct }}%)
          </span>
        </div>
      </div>
    </section>

    <!-- Package uniqueness -->
    <section
      style="
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
      "
    >
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Uniqueness by Package
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem">
        <div
          v-for="pkg in pkgUniqueness"
          :key="pkg.name"
          style="
            padding: 0.5rem 0.75rem;
            border-radius: 0.25rem;
            background: rgba(255, 255, 255, 0.02);
          "
        >
          <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem">{{ pkg.name }}</div>
          <div style="font-size: 1.125rem; font-weight: 700; color: #c9956d; font-variant-numeric: tabular-nums">
            {{ pkg.pct }}%
            <span style="font-size: 0.625rem; opacity: 0.4; font-weight: 400">unique</span>
          </div>
          <div style="font-size: 0.625rem; opacity: 0.4; font-variant-numeric: tabular-nums">
            {{ pkg.unique }}/{{ pkg.total }} components
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Matrix Table -->
    <section
      style="
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
        overflow: hidden;
      "
    >
      <div style="padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; border-bottom: 1px solid var(--rig-border, #2a2520)">
        <h2 style="margin: 0; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Feature Matrix
        </h2>
        <div style="display: flex; gap: 0.375rem; margin-left: auto">
          <button
            v-for="ft in (['all', 'component', 'composable'] as FilterType[])"
            :key="ft"
            :style="{
              padding: '0.1875rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: filterType === ft ? '#c9956d' : 'var(--rig-border, #2a2520)',
              background: filterType === ft ? 'rgba(201,149,109,0.12)' : 'transparent',
              color: filterType === ft ? '#c9956d' : 'inherit',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontWeight: 600,
            }"
            @click="filterType = ft"
          >
            {{ ft === 'all' ? 'All' : ft === 'component' ? 'Components' : 'Composables' }}
          </button>
          <select
            v-model="filterPkg"
            style="
              padding: 0.1875rem 0.375rem;
              border-radius: 0.25rem;
              border: 1px solid var(--rig-border, #2a2520);
              background: transparent;
              color: inherit;
              font-size: 0.6875rem;
              cursor: pointer;
            "
          >
            <option value="">All packages</option>
            <option v-for="pkg in packages" :key="pkg" :value="pkg">{{ pkg }}</option>
          </select>
          <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.6875rem; cursor: pointer; opacity: 0.7">
            <input v-model="showUnique" type="checkbox" style="cursor: pointer" />
            Unique only
          </label>
        </div>
      </div>

      <div style="overflow-x: auto">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; white-space: nowrap">
          <thead>
            <tr style="border-bottom: 1px solid var(--rig-border, #2a2520)">
              <th
                style="padding: 0.5rem 0.75rem; text-align: left; cursor: pointer; user-select: none; font-weight: 600; opacity: 0.6; position: sticky; left: 0; background: var(--rig-surface, #1a1815); z-index: 1"
                @click="setSort('name')"
              >
                Component{{ sortArrow('name') }}
              </th>
              <th
                style="padding: 0.5rem 0.375rem; text-align: left; cursor: pointer; user-select: none; font-weight: 600; opacity: 0.6"
                @click="setSort('package')"
              >
                Pkg{{ sortArrow('package') }}
              </th>
              <th
                v-for="(comp, ci) in competitors"
                :key="comp"
                :style="{
                  padding: '0.5rem 0.375rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontWeight: 600,
                  opacity: 0.6,
                  fontSize: '0.625rem',
                  writingMode: 'vertical-rl',
                  height: '80px',
                }"
                @click="setSort(ci)"
                :title="notes[comp] ?? comp"
              >
                {{ comp }}{{ sortArrow(ci) }}
              </th>
              <th
                style="padding: 0.5rem 0.375rem; text-align: center; cursor: pointer; user-select: none; font-weight: 600; opacity: 0.6"
                @click="setSort('overlap')"
              >
                #{{ sortArrow('overlap') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in sortedMatrix"
              :key="row.name"
              style="border-bottom: 1px solid var(--rig-border, #2a2520)"
            >
              <td
                style="
                  padding: 0.375rem 0.75rem;
                  font-weight: 600;
                  position: sticky;
                  left: 0;
                  background: var(--rig-surface, #1a1815);
                  z-index: 1;
                "
              >
                <span style="display: flex; align-items: center; gap: 0.375rem">
                  {{ row.name }}
                  <span
                    v-if="row.type === 'composable'"
                    style="font-size: 0.5rem; opacity: 0.4"
                  >fn</span>
                  <span
                    v-if="row.has.every(v => v === 0)"
                    style="
                      font-size: 0.5rem;
                      padding: 0.0625rem 0.25rem;
                      border-radius: 9999px;
                      background: rgba(201, 149, 109, 0.15);
                      color: #c9956d;
                      font-weight: 700;
                    "
                  >UNIQUE</span>
                </span>
              </td>
              <td style="padding: 0.375rem 0.375rem; opacity: 0.4; font-size: 0.6875rem">{{ row.package }}</td>
              <td
                v-for="(val, ci) in row.has"
                :key="ci"
                style="padding: 0.375rem; text-align: center"
              >
                <span
                  v-if="val === 1"
                  :style="{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    background: 'rgba(74, 222, 128, 0.2)',
                    color: '#4ade80',
                    fontSize: '0.625rem',
                    lineHeight: '14px',
                    textAlign: 'center',
                    fontWeight: 700,
                  }"
                >&#10003;</span>
                <span
                  v-else
                  style="
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    border-radius: 3px;
                    background: rgba(255, 255, 255, 0.03);
                    color: rgba(255, 255, 255, 0.12);
                    font-size: 0.625rem;
                    line-height: 14px;
                    text-align: center;
                  "
                >&mdash;</span>
              </td>
              <td
                :style="{
                  padding: '0.375rem',
                  textAlign: 'center',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 600,
                  fontSize: '0.6875rem',
                  color: row.has.every(v => v === 0) ? '#c9956d' : row.has.reduce((a: number, b: number) => a + b, 0) >= 5 ? '#4ade80' : 'inherit',
                }"
              >
                {{ row.has.reduce((a: number, b: number) => a + b, 0) }}/{{ competitors.length }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="padding: 0.5rem 0.75rem; font-size: 0.625rem; opacity: 0.3; border-top: 1px solid var(--rig-border, #2a2520)">
        Showing {{ filteredMatrix.length }} of {{ totalRig }} --
        {{ uniqueToRig }} unique to Rig,
        {{ marketStandard }} market standard (5+ competitors)
      </div>
    </section>

    <!-- Competitor notes -->
    <section
      style="
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
      "
    >
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Library Notes
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem">
        <div
          v-for="cs in competitorStats"
          :key="cs.name"
          style="
            padding: 0.5rem 0.75rem;
            border-radius: 0.25rem;
            background: rgba(255, 255, 255, 0.02);
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          "
        >
          <div style="display: flex; align-items: center; gap: 0.375rem">
            <span style="font-size: 0.75rem; font-weight: 600">{{ cs.name }}</span>
            <span
              :style="{
                fontSize: '0.5rem',
                padding: '0.0625rem 0.25rem',
                borderRadius: '9999px',
                background: cs.isVue ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                color: cs.isVue ? '#4ade80' : '#f87171',
                fontWeight: 700,
              }"
            >
              {{ cs.isVue ? 'Vue' : 'React / Other' }}
            </span>
          </div>
          <p style="margin: 0; font-size: 0.6875rem; opacity: 0.5">{{ cs.note }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
