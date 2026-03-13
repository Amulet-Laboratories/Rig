<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type {
  ComparisonOutput,
  ComparisonResult,
  MountResult,
  StaticAnalysisOutput,
  PackageAnalysis,
} from '../types'
import { GRADE_COLORS } from '../types'

const router = useRouter()

// Load data
let comparison: ComparisonOutput | null = null
let staticAnalysis: StaticAnalysisOutput | null = null

try {
  comparison = (await import('@health/comparison.json')).default as unknown as ComparisonOutput
} catch {
  comparison = null
}
try {
  staticAnalysis = (await import('@health/static-analysis.json')).default as unknown as StaticAnalysisOutput
} catch {
  staticAnalysis = null
}

// ── Derived data ──────────────────────────────────────────────────────

const comparisons = computed(() => comparison?.comparisons ?? [])
const packages = computed(() => staticAnalysis?.packages ?? [])

// All library keys that participated
const allLibs = computed(() => {
  const libs = new Map<string, string>()
  for (const c of comparisons.value) {
    for (const r of c.results) {
      if (!libs.has(r.lib)) libs.set(r.lib, r.libName)
    }
  }
  return libs
})

const libKeys = computed(() => Array.from(allLibs.value.keys()))
const libNames = computed(() => Array.from(allLibs.value.values()))

// Library colors
const LIB_COLORS: Record<string, string> = {
  rig: '#c9956d',
  radix: '#60a5fa',
  hui: '#a78bfa',
  ant: '#f87171',
  fwb: '#4ade80',
  mui: '#38bdf8',
  chakra: '#34d399',
  mantine: '#818cf8',
}

function libColor(lib: string): string {
  return LIB_COLORS[lib] ?? '#94a3b8'
}

// ── Summary stats ─────────────────────────────────────────────────────

function isReliable(r: MountResult): boolean {
  return (r.reliable ?? r.domNodeCount > 0) && r.mountMedianMs >= 0
}

const rigWins = computed(() => {
  let wins = 0
  for (const c of comparisons.value) {
    const rig = c.results.find((r) => r.lib === 'rig')
    if (!rig || !isReliable(rig)) continue
    const competitors = c.results.filter((r) => r.lib !== 'rig' && isReliable(r))
    if (competitors.length === 0) continue
    const fastest = Math.min(...competitors.map((r) => r.mountMedianMs))
    if (rig.mountMedianMs <= fastest) wins++
  }
  return wins
})

const rigA11yWins = computed(() => {
  let wins = 0
  for (const c of comparisons.value) {
    const rig = c.results.find((r) => r.lib === 'rig')
    if (!rig || !isReliable(rig) || rig.a11yScore < 0) continue
    const competitors = c.results.filter((r) => r.lib !== 'rig' && isReliable(r) && r.a11yScore >= 0)
    if (competitors.length === 0) continue
    const best = Math.max(...competitors.map((r) => r.a11yScore))
    if (rig.a11yScore >= best) wins++
  }
  return wins
})

const avgRigMount = computed(() => {
  const times = comparisons.value
    .map((c) => c.results.find((r) => r.lib === 'rig'))
    .filter((r): r is MountResult => !!r && isReliable(r))
    .map((r) => r.mountMedianMs)
  return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
})

const reliableCount = computed(() => {
  let count = 0
  for (const c of comparisons.value) {
    if (c.results.some((r) => isReliable(r))) count++
  }
  return count
})

const errorCount = computed(() => {
  let count = 0
  for (const c of comparisons.value) {
    for (const r of c.results) {
      if (r.error) count++
    }
  }
  return count
})

// ── Sorting & filtering ──────────────────────────────────────────────

type SortField = 'component' | 'mount' | 'unmount' | 'dom' | 'a11y'
const sortField = ref<SortField>('component')
const sortAsc = ref(true)
const filterLib = ref<string>('')

function toggleSort(field: SortField) {
  if (sortField.value === field) sortAsc.value = !sortAsc.value
  else {
    sortField.value = field
    sortAsc.value = true
  }
}

const sortedComparisons = computed(() => {
  const rows = [...comparisons.value]
  rows.sort((a, b) => {
    const getVal = (c: ComparisonResult) => {
      const rig = c.results.find((r) => r.lib === 'rig')
      if (!rig) return Infinity
      switch (sortField.value) {
        case 'component':
          return 0 // sort by name below
        case 'mount':
          return rig.mountMedianMs
        case 'unmount':
          return rig.unmountMedianMs
        case 'dom':
          return rig.domNodeCount
        case 'a11y':
          return -rig.a11yScore // higher is better
      }
    }
    if (sortField.value === 'component') {
      const cmp = a.rigComponent.localeCompare(b.rigComponent)
      return sortAsc.value ? cmp : -cmp
    }
    const va = getVal(a)
    const vb = getVal(b)
    return sortAsc.value ? va - vb : vb - va
  })
  return rows
})

function sortIcon(field: SortField): string {
  if (sortField.value !== field) return '⇕'
  return sortAsc.value ? '↑' : '↓'
}

// ── SVG chart helpers ─────────────────────────────────────────────────

function mountBarChart(comp: ComparisonResult): {
  bars: { lib: string; name: string; width: number; value: number; color: string; error: boolean; unreliable: boolean }[]
  maxMs: number
} {
  const validResults = comp.results.filter((r) => isReliable(r))
  const maxMs = Math.max(...validResults.map((r) => r.mountMedianMs), 0.1)
  const bars = comp.results.map((r) => ({
    lib: r.lib,
    name: r.libName,
    width: isReliable(r) ? (r.mountMedianMs / maxMs) * 100 : 0,
    value: r.mountMedianMs,
    color: libColor(r.lib),
    error: !!r.error,
    unreliable: !isReliable(r) && !r.error,
  }))
  return { bars, maxMs }
}

// ── Static analysis helpers ───────────────────────────────────────────

const rigPkg = computed(() => packages.value.find((p) => p.key === 'rig'))

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

const sizeChartMax = computed(() => {
  return Math.max(...packages.value.map((p) => p.installSizeBytes), 1)
})

// View mode
type ViewMode = 'benchmarks' | 'sizes' | 'a11y'
const viewMode = ref<ViewMode>('benchmarks')
</script>

<template>
  <div style="padding: 24px; max-width: 1400px">
    <h1 style="font-size: 24px; font-weight: 600; color: #f5f1ed; margin: 0 0 4px">
      Comparison Dashboard
    </h1>
    <p style="color: #8a8078; font-size: 13px; margin: 0 0 20px">
      Runtime benchmarks &amp; static analysis across
      {{ allLibs.size }} libraries, {{ comparisons.length }} components
      <span v-if="comparison" style="color: #5a534e">
        &middot; {{ new Date(comparison.timestamp).toLocaleDateString() }}
      </span>
    </p>

    <!-- Summary cards -->
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      "
    >
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px;
        "
      >
        <div style="color: #8a8078; font-size: 11px; text-transform: uppercase; letter-spacing: 1px">
          Speed wins
        </div>
        <div style="font-size: 28px; font-weight: 700; color: #c9956d">
          {{ rigWins }}/{{ reliableCount }}
        </div>
        <div style="color: #5a534e; font-size: 11px">Rig fastest mount (reliable only)</div>
      </div>
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px;
        "
      >
        <div style="color: #8a8078; font-size: 11px; text-transform: uppercase; letter-spacing: 1px">
          A11y wins
        </div>
        <div style="font-size: 28px; font-weight: 700; color: #4ade80">
          {{ rigA11yWins }}/{{ reliableCount }}
        </div>
        <div style="color: #5a534e; font-size: 11px">Rig best or tied</div>
      </div>
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px;
        "
      >
        <div style="color: #8a8078; font-size: 11px; text-transform: uppercase; letter-spacing: 1px">
          Avg mount
        </div>
        <div style="font-size: 28px; font-weight: 700; color: #f5f1ed">
          {{ avgRigMount.toFixed(2) }}ms
        </div>
        <div style="color: #5a534e; font-size: 11px">Rig median mount</div>
      </div>
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px;
        "
      >
        <div style="color: #8a8078; font-size: 11px; text-transform: uppercase; letter-spacing: 1px">
          Install size
        </div>
        <div style="font-size: 28px; font-weight: 700; color: #f5f1ed">
          {{ rigPkg ? formatBytes(rigPkg.installSizeBytes) : '—' }}
        </div>
        <div style="color: #5a534e; font-size: 11px">Smallest of all</div>
      </div>
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px;
        "
      >
        <div style="color: #8a8078; font-size: 11px; text-transform: uppercase; letter-spacing: 1px">
          Mount errors
        </div>
        <div style="font-size: 28px; font-weight: 700" :style="{ color: errorCount > 0 ? '#fb923c' : '#4ade80' }">
          {{ errorCount }}
        </div>
        <div style="color: #5a534e; font-size: 11px">Components failed to mount</div>
      </div>
    </div>

    <!-- Tab switcher -->
    <div style="display: flex; gap: 4px; margin-bottom: 20px">
      <button
        v-for="mode in (['benchmarks', 'sizes', 'a11y'] as const)"
        :key="mode"
        @click="viewMode = mode"
        :style="{
          padding: '6px 16px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: viewMode === mode ? '600' : '400',
          background: viewMode === mode ? '#c9956d' : '#1a1714',
          color: viewMode === mode ? '#0f0d0a' : '#8a8078',
        }"
      >
        {{ mode === 'benchmarks' ? 'Benchmarks' : mode === 'sizes' ? 'Package Sizes' : 'Accessibility' }}
      </button>
    </div>

    <!-- Benchmarks view -->
    <div v-if="viewMode === 'benchmarks'">
      <!-- Legend -->
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px">
        <div
          v-for="[lib, name] in allLibs"
          :key="lib"
          style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8a8078"
        >
          <span
            :style="{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: libColor(lib),
              display: 'inline-block',
            }"
          />
          {{ name }}
        </div>
      </div>

      <!-- Mount time comparison table -->
      <div style="background: #1a1714; border: 1px solid #2a2520; border-radius: 8px; overflow: hidden">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px">
          <thead>
            <tr style="border-bottom: 1px solid #2a2520">
              <th
                style="text-align: left; padding: 10px 12px; color: #8a8078; font-weight: 500; cursor: pointer; user-select: none; width: 140px"
                @click="toggleSort('component')"
              >
                Component {{ sortIcon('component') }}
              </th>
              <th
                style="text-align: left; padding: 10px 12px; color: #8a8078; font-weight: 500; width: auto"
              >
                Mount time comparison
              </th>
              <th
                style="text-align: right; padding: 10px 12px; color: #8a8078; font-weight: 500; cursor: pointer; user-select: none; width: 80px"
                @click="toggleSort('mount')"
              >
                Rig ms {{ sortIcon('mount') }}
              </th>
              <th
                style="text-align: right; padding: 10px 12px; color: #8a8078; font-weight: 500; cursor: pointer; user-select: none; width: 60px"
                @click="toggleSort('dom')"
              >
                DOM {{ sortIcon('dom') }}
              </th>
              <th
                style="text-align: right; padding: 10px 12px; color: #8a8078; font-weight: 500; cursor: pointer; user-select: none; width: 60px"
                @click="toggleSort('a11y')"
              >
                A11y {{ sortIcon('a11y') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="comp in sortedComparisons"
              :key="comp.rigComponent"
              style="border-bottom: 1px solid #1f1c18; cursor: pointer"
              @click="router.push(`/component/${comp.rigComponent}`)"
            >
              <td style="padding: 8px 12px; color: #f5f1ed; font-weight: 500">
                {{ comp.rigComponent }}
              </td>
              <td style="padding: 8px 12px">
                <div style="display: flex; flex-direction: column; gap: 3px">
                  <div
                    v-for="bar in mountBarChart(comp).bars"
                    :key="bar.lib"
                    style="display: flex; align-items: center; gap: 6px; height: 16px"
                  >
                    <span
                      style="font-size: 10px; color: #5a534e; width: 16px; text-align: right; flex-shrink: 0"
                    >
                      {{ bar.name.slice(0, 2) }}
                    </span>
                    <div
                      v-if="!bar.error && !bar.unreliable"
                      :style="{
                        height: '10px',
                        borderRadius: '2px',
                        background: bar.color,
                        width: Math.max(bar.width, 2) + '%',
                        opacity: bar.lib === 'rig' ? 1 : 0.6,
                        transition: 'width 0.3s ease',
                      }"
                    />
                    <span v-if="!bar.error && !bar.unreliable" style="font-size: 10px; color: #5a534e">
                      {{ bar.value.toFixed(2) }}
                    </span>
                    <span v-else-if="bar.unreliable" style="font-size: 10px; color: #5a534e; opacity: 0.4" title="Unreliable result (0 DOM nodes)">···</span>
                    <span v-else style="font-size: 10px; color: #fb923c">err</span>
                  </div>
                </div>
              </td>
              <td style="padding: 8px 12px; text-align: right; font-family: monospace; font-size: 12px">
                <span
                  :style="{
                    color:
                      (comp.results.find((r) => r.lib === 'rig')?.mountMedianMs ?? -1) < 0
                        ? '#fb923c'
                        : '#f5f1ed',
                  }"
                >
                  {{
                    (comp.results.find((r) => r.lib === 'rig')?.mountMedianMs ?? -1) >= 0
                      ? (comp.results.find((r) => r.lib === 'rig')?.mountMedianMs ?? 0).toFixed(3)
                      : 'ERR'
                  }}
                </span>
              </td>
              <td
                style="
                  padding: 8px 12px;
                  text-align: right;
                  font-family: monospace;
                  font-size: 12px;
                  color: #8a8078;
                "
              >
                {{ comp.results.find((r) => r.lib === 'rig')?.domNodeCount ?? '—' }}
              </td>
              <td style="padding: 8px 12px; text-align: right; font-family: monospace; font-size: 12px">
                <span
                  :style="{
                    color:
                      (comp.results.find((r) => r.lib === 'rig')?.a11yScore ?? 0) >= 90
                        ? '#4ade80'
                        : (comp.results.find((r) => r.lib === 'rig')?.a11yScore ?? 0) >= 70
                          ? '#facc15'
                          : '#f87171',
                  }"
                >
                  {{ comp.results.find((r) => r.lib === 'rig')?.a11yScore ?? '—' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Package sizes view -->
    <div v-if="viewMode === 'sizes'">
      <div style="background: #1a1714; border: 1px solid #2a2520; border-radius: 8px; overflow: hidden">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px">
          <thead>
            <tr style="border-bottom: 1px solid #2a2520">
              <th style="text-align: left; padding: 10px 12px; color: #8a8078; font-weight: 500; width: 200px">
                Package
              </th>
              <th style="text-align: left; padding: 10px 12px; color: #8a8078; font-weight: 500">
                Install size
              </th>
              <th
                style="text-align: right; padding: 10px 12px; color: #8a8078; font-weight: 500; width: 80px"
              >
                Size
              </th>
              <th
                style="text-align: right; padding: 10px 12px; color: #8a8078; font-weight: 500; width: 60px"
              >
                Deps
              </th>
              <th
                style="text-align: right; padding: 10px 12px; color: #8a8078; font-weight: 500; width: 80px"
              >
                Components
              </th>
              <th
                style="text-align: center; padding: 10px 12px; color: #8a8078; font-weight: 500; width: 60px"
              >
                TS
              </th>
              <th
                style="text-align: center; padding: 10px 12px; color: #8a8078; font-weight: 500; width: 80px"
              >
                Framework
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pkg in packages"
              :key="pkg.key"
              :style="{
                borderBottom: '1px solid #1f1c18',
                background: pkg.key === 'rig' ? 'rgba(201, 149, 109, 0.06)' : 'transparent',
              }"
            >
              <td style="padding: 8px 12px">
                <div style="display: flex; align-items: center; gap: 8px">
                  <span
                    :style="{
                      width: '8px',
                      height: '8px',
                      borderRadius: '2px',
                      background: libColor(pkg.key),
                      flexShrink: 0,
                    }"
                  />
                  <span :style="{ color: pkg.key === 'rig' ? '#c9956d' : '#f5f1ed', fontWeight: pkg.key === 'rig' ? 600 : 400 }">
                    {{ pkg.name }}
                  </span>
                  <span style="color: #5a534e; font-size: 11px">v{{ pkg.version }}</span>
                </div>
              </td>
              <td style="padding: 8px 12px">
                <div style="display: flex; align-items: center; gap: 8px">
                  <div
                    :style="{
                      height: '12px',
                      borderRadius: '2px',
                      background: libColor(pkg.key),
                      opacity: pkg.key === 'rig' ? 1 : 0.5,
                      width: (pkg.installSizeBytes / sizeChartMax) * 100 + '%',
                      minWidth: '2px',
                      transition: 'width 0.3s ease',
                    }"
                  />
                </div>
              </td>
              <td
                style="
                  padding: 8px 12px;
                  text-align: right;
                  font-family: monospace;
                  font-size: 12px;
                  color: #f5f1ed;
                "
              >
                {{ pkg.installSizeFormatted }}
              </td>
              <td
                style="
                  padding: 8px 12px;
                  text-align: right;
                  font-family: monospace;
                  font-size: 12px;
                  color: #8a8078;
                "
              >
                {{ pkg.directDeps }}
              </td>
              <td
                style="
                  padding: 8px 12px;
                  text-align: right;
                  font-family: monospace;
                  font-size: 12px;
                  color: #8a8078;
                "
              >
                {{ pkg.estimatedComponents }}
              </td>
              <td style="padding: 8px 12px; text-align: center; font-size: 12px">
                <span :style="{ color: pkg.hasTypeScript ? '#4ade80' : '#f87171' }">
                  {{ pkg.hasTypeScript ? 'Yes' : 'No' }}
                </span>
              </td>
              <td style="padding: 8px 12px; text-align: center; font-size: 11px">
                <span
                  :style="{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: pkg.framework === 'vue' ? 'rgba(74, 222, 128, 0.12)' : 'rgba(96, 165, 250, 0.12)',
                    color: pkg.framework === 'vue' ? '#4ade80' : '#60a5fa',
                  }"
                >
                  {{ pkg.framework }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Size ratio callout -->
      <div
        v-if="rigPkg && packages.length > 1"
        style="
          margin-top: 16px;
          padding: 16px;
          background: rgba(201, 149, 109, 0.06);
          border: 1px solid #2a2520;
          border-radius: 8px;
          color: #8a8078;
          font-size: 13px;
        "
      >
        <strong style="color: #c9956d">Rig is {{ formatBytes(rigPkg.installSizeBytes) }}</strong>
        &mdash;
        <span v-for="(pkg, i) in packages.filter((p) => p.key !== 'rig')" :key="pkg.key">
          {{ (pkg.installSizeBytes / rigPkg.installSizeBytes).toFixed(1) }}x smaller than {{ pkg.name
          }}<span v-if="i < packages.filter((p) => p.key !== 'rig').length - 1">, </span>
        </span>
      </div>
    </div>

    <!-- A11y view -->
    <div v-if="viewMode === 'a11y'">
      <div style="background: #1a1714; border: 1px solid #2a2520; border-radius: 8px; overflow: hidden">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px">
          <thead>
            <tr style="border-bottom: 1px solid #2a2520">
              <th style="text-align: left; padding: 10px 12px; color: #8a8078; font-weight: 500; width: 140px">
                Component
              </th>
              <th
                v-for="[lib, name] in allLibs"
                :key="lib"
                style="text-align: center; padding: 10px 12px; font-weight: 500; font-size: 12px"
                :style="{ color: libColor(lib) }"
              >
                {{ name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="comp in sortedComparisons"
              :key="comp.rigComponent"
              style="border-bottom: 1px solid #1f1c18; cursor: pointer"
              @click="router.push(`/component/${comp.rigComponent}`)"
            >
              <td style="padding: 8px 12px; color: #f5f1ed; font-weight: 500">
                {{ comp.rigComponent }}
              </td>
              <td
                v-for="lib in libKeys"
                :key="lib"
                style="padding: 8px 12px; text-align: center; font-family: monospace; font-size: 12px"
              >
                <template v-if="comp.results.find((r) => r.lib === lib)">
                  <span
                    v-if="comp.results.find((r) => r.lib === lib)!.error"
                    style="color: #5a534e"
                  >
                    —
                  </span>
                  <span
                    v-else
                    :style="{
                      color:
                        comp.results.find((r) => r.lib === lib)!.a11yScore >= 90
                          ? '#4ade80'
                          : comp.results.find((r) => r.lib === lib)!.a11yScore >= 70
                            ? '#facc15'
                            : '#f87171',
                    }"
                  >
                    {{ comp.results.find((r) => r.lib === lib)!.a11yScore }}
                  </span>
                </template>
                <span v-else style="color: #2a2520">·</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- A11y summary -->
      <div
        style="
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        "
      >
        <div
          v-for="[lib, name] in allLibs"
          :key="lib"
          style="
            background: #1a1714;
            border: 1px solid #2a2520;
            border-radius: 8px;
            padding: 12px;
          "
        >
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px">
            <span
              :style="{
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                background: libColor(lib),
              }"
            />
            <span style="color: #f5f1ed; font-size: 13px; font-weight: 500">{{ name }}</span>
          </div>
          <div style="font-size: 11px; color: #8a8078">
            Avg:
            <span style="color: #f5f1ed; font-weight: 600">
              {{
                (() => {
                  const scores = comparisons
                    .flatMap((c) => c.results)
                    .filter((r) => r.lib === lib && isReliable(r) && r.a11yScore >= 0)
                    .map((r) => r.a11yScore)
                  return scores.length > 0
                    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                    : '—'
                })()
              }}
            </span>
            &middot; Tested:
            <span style="color: #f5f1ed">
              {{
                comparisons
                  .flatMap((c) => c.results)
                  .filter((r) => r.lib === lib && !r.error).length
              }}
            </span>
            &middot; Errors:
            <span style="color: #fb923c">
              {{
                comparisons
                  .flatMap((c) => c.results)
                  .filter((r) => r.lib === lib && !!r.error).length
              }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- No data state -->
    <div
      v-if="!comparison && !staticAnalysis"
      style="
        text-align: center;
        padding: 60px 20px;
        color: #5a534e;
        font-size: 14px;
      "
    >
      No comparison data found. Run
      <code style="color: #c9956d; background: #1a1714; padding: 2px 6px; border-radius: 4px">
        pnpm compare
      </code>
      to generate benchmarks.
    </div>
  </div>
</template>
