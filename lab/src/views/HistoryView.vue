<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HealthHistory, HistorySnapshot } from '../types'

let historyData: HealthHistory
try {
  historyData = (await import('@health/history.json')).default as unknown as HealthHistory
} catch {
  historyData = { snapshots: [] }
}

const snapshots = computed(() => historyData.snapshots)
const hasData = computed(() => snapshots.value.length > 0)

// Which metric to highlight
type MetricKey = 'score' | 'tests' | 'coverage' | 'gaps' | 'loc'
const activeMetric = ref<MetricKey>('score')

const metrics: { key: MetricKey; label: string; color: string; getValue: (s: HistorySnapshot) => number }[] = [
  { key: 'score', label: 'Avg Score', color: '#4ade80', getValue: (s) => s.averageScore },
  { key: 'tests', label: 'Tests Passed', color: '#38bdf8', getValue: (s) => s.totalPassed },
  { key: 'coverage', label: 'Stmt Coverage %', color: '#a78bfa', getValue: (s) => s.overallCoverage?.statements ?? 0 },
  { key: 'gaps', label: 'Total Gaps', color: '#fb923c', getValue: (s) => s.totalGaps },
  { key: 'loc', label: 'Total LOC', color: '#c9956d', getValue: (s) => s.totalLoc },
]

const currentMetric = computed(() => metrics.find((m) => m.key === activeMetric.value)!)

// Chart dimensions
const W = 600
const H = 200
const PAD = { top: 20, right: 20, bottom: 30, left: 50 }
const chartW = W - PAD.left - PAD.right
const chartH = H - PAD.top - PAD.bottom

function buildChart(getValue: (s: HistorySnapshot) => number) {
  const data = snapshots.value
  if (data.length === 0) return { points: '', dots: [], yLabels: [], xLabels: [], latest: 0, delta: 0, min: 0, max: 0 }

  const values = data.map(getValue)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const dots = data.map((s, i) => {
    const x = PAD.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW)
    const y = PAD.top + chartH - ((getValue(s) - min) / range) * chartH
    return { x, y, value: getValue(s), label: formatDate(s.timestamp) }
  })

  const points = dots.map((d) => `${d.x},${d.y}`).join(' ')

  // Y-axis labels (5 ticks)
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const val = min + (range * i) / 4
    const y = PAD.top + chartH - (i / 4) * chartH
    return { y, label: Math.round(val).toString() }
  })

  // X-axis labels (at most 6)
  const step = Math.max(1, Math.floor(data.length / 6))
  const xLabels = data
    .filter((_, i) => i % step === 0 || i === data.length - 1)
    .map((s, _, arr) => {
      const idx = data.indexOf(s)
      const x = PAD.left + (data.length === 1 ? chartW / 2 : (idx / (data.length - 1)) * chartW)
      return { x, label: formatDateShort(s.timestamp) }
    })

  const latest = values[values.length - 1]
  const delta = values.length >= 2 ? latest - values[values.length - 2] : 0

  return { points, dots, yLabels, xLabels, latest, delta, min, max }
}

const chart = computed(() => buildChart(currentMetric.value.getValue))

// Dimension fill trends
const dimensionKeys = ['tests', 'coverage', 'a11y', 'story', 'hex', 'bench'] as const
const dimensionColors: Record<string, string> = {
  tests: '#4ade80', coverage: '#38bdf8', a11y: '#a78bfa', story: '#fb923c', hex: '#c9956d', bench: '#facc15',
}

function buildDimChart(dimKey: string) {
  const data = snapshots.value
  if (data.length === 0) return ''
  const values = data.map((s) => s.dimensionFill[dimKey] ?? 0)
  const dots = data.map((_, i) => {
    const x = PAD.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW)
    const y = PAD.top + chartH - (values[i] / 100) * chartH
    return `${x},${y}`
  })
  return dots.join(' ')
}

// Package score trends (sparklines)
const packageNames = computed(() => {
  if (snapshots.value.length === 0) return []
  return snapshots.value[snapshots.value.length - 1].packages.map((p) => p.name)
})

function pkgSparkline(pkg: string): string {
  const data = snapshots.value
  if (data.length < 2) return ''
  const values = data.map((s) => {
    const p = s.packages.find((pp) => pp.name === pkg)
    return p?.avgScore ?? 0
  })
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 80
  const h = 24
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(' ')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Grade distribution stacked bar
function gradeBar(s: HistorySnapshot): { grade: string; pct: number; color: string }[] {
  const total = s.totalComponents + s.totalComposables
  if (total === 0) return []
  const grades = ['A', 'B', 'C', 'D', 'F'] as const
  const colors = { A: '#4ade80', B: '#a3e635', C: '#facc15', D: '#fb923c', F: '#f87171' }
  return grades
    .map((g) => ({ grade: g, pct: ((s.gradeDistribution[g] ?? 0) / total) * 100, color: colors[g] }))
    .filter((b) => b.pct > 0)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 1400px; margin: 0 auto; width: 100%">
    <div>
      <h1 style="margin: 0 0 0.25rem; font-size: 1.25rem; font-weight: 700">History</h1>
      <p style="margin: 0; font-size: 0.8125rem; opacity: 0.5">
        {{ snapshots.length }} snapshot{{ snapshots.length === 1 ? '' : 's' }} recorded
        <template v-if="snapshots.length > 0">
          -- first: {{ formatDateShort(snapshots[0].timestamp) }}, latest: {{ formatDateShort(snapshots[snapshots.length - 1].timestamp) }}
        </template>
      </p>
    </div>

    <div v-if="!hasData" style="text-align: center; padding: 4rem 2rem; opacity: 0.4">
      <p style="font-size: 1rem; margin: 0 0 0.5rem">No history data yet</p>
      <p style="font-size: 0.8125rem; margin: 0">
        Run <code style="padding: 0.125rem 0.375rem; border-radius: 0.25rem; background: rgba(201,149,109,0.1); color: var(--rig-accent, #c9956d)">pnpm health</code>
        to record the first snapshot
      </p>
    </div>

    <template v-if="hasData">
      <!-- Metric selector + main chart -->
      <section
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem">
          <button
            v-for="m in metrics"
            :key="m.key"
            :style="{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: activeMetric === m.key ? m.color : 'var(--rig-border, #2a2520)',
              background: activeMetric === m.key ? `${m.color}18` : 'transparent',
              color: activeMetric === m.key ? m.color : 'inherit',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              transition: 'all 0.15s',
            }"
            @click="activeMetric = m.key"
          >
            {{ m.label }}
          </button>
          <!-- Current value + delta -->
          <div style="margin-left: auto; text-align: right">
            <span :style="{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: currentMetric.color }">
              {{ chart.latest }}
            </span>
            <span
              v-if="chart.delta !== 0"
              :style="{
                fontSize: '0.75rem',
                fontWeight: 600,
                marginLeft: '0.5rem',
                color: (activeMetric === 'gaps' ? chart.delta < 0 : chart.delta > 0) ? '#4ade80' : '#f87171',
              }"
            >
              {{ chart.delta > 0 ? '+' : '' }}{{ chart.delta }}
            </span>
          </div>
        </div>

        <svg :viewBox="`0 0 ${W} ${H}`" style="width: 100%; height: auto">
          <!-- Grid lines -->
          <line
            v-for="yl in chart.yLabels"
            :key="yl.label"
            :x1="PAD.left"
            :x2="W - PAD.right"
            :y1="yl.y"
            :y2="yl.y"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="1"
          />
          <!-- Y labels -->
          <text
            v-for="yl in chart.yLabels"
            :key="'yt' + yl.label"
            :x="PAD.left - 8"
            :y="yl.y + 3"
            text-anchor="end"
            style="font-size: 9px; fill: rgba(255,255,255,0.35); font-variant-numeric: tabular-nums"
          >
            {{ yl.label }}
          </text>
          <!-- X labels -->
          <text
            v-for="xl in chart.xLabels"
            :key="'xl' + xl.label"
            :x="xl.x"
            :y="H - 5"
            text-anchor="middle"
            style="font-size: 8px; fill: rgba(255,255,255,0.3)"
          >
            {{ xl.label }}
          </text>
          <!-- Area fill -->
          <polygon
            v-if="chart.dots.length > 1"
            :points="`${PAD.left},${PAD.top + chartH} ${chart.points} ${W - PAD.right},${PAD.top + chartH}`"
            :fill="`${currentMetric.color}10`"
          />
          <!-- Line -->
          <polyline
            v-if="chart.dots.length > 1"
            :points="chart.points"
            fill="none"
            :stroke="currentMetric.color"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <!-- Dots -->
          <circle
            v-for="(dot, i) in chart.dots"
            :key="i"
            :cx="dot.x"
            :cy="dot.y"
            r="3"
            :fill="currentMetric.color"
            :stroke="currentMetric.color"
            stroke-width="1"
          >
            <title>{{ dot.label }}: {{ dot.value }}</title>
          </circle>
        </svg>
      </section>

      <!-- Dimension fill trends -->
      <section
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <h2 style="margin: 0 0 1rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Dimension Fill Trends
        </h2>
        <svg :viewBox="`0 0 ${W} ${H}`" style="width: 100%; height: auto">
          <!-- Grid lines -->
          <line
            v-for="pct in [0, 25, 50, 75, 100]"
            :key="pct"
            :x1="PAD.left"
            :x2="W - PAD.right"
            :y1="PAD.top + chartH - (pct / 100) * chartH"
            :y2="PAD.top + chartH - (pct / 100) * chartH"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="1"
          />
          <text
            v-for="pct in [0, 25, 50, 75, 100]"
            :key="'p' + pct"
            :x="PAD.left - 8"
            :y="PAD.top + chartH - (pct / 100) * chartH + 3"
            text-anchor="end"
            style="font-size: 9px; fill: rgba(255,255,255,0.35); font-variant-numeric: tabular-nums"
          >
            {{ pct }}%
          </text>
          <!-- Lines per dimension -->
          <polyline
            v-for="dim in dimensionKeys"
            :key="dim"
            :points="buildDimChart(dim)"
            fill="none"
            :stroke="dimensionColors[dim]"
            stroke-width="1.5"
            stroke-linejoin="round"
            :opacity="0.8"
          />
        </svg>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 0.5rem">
          <span
            v-for="dim in dimensionKeys"
            :key="dim"
            style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.6875rem"
          >
            <span :style="{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: dimensionColors[dim] }" />
            {{ dim }}
          </span>
        </div>
      </section>

      <!-- Grade distribution over time -->
      <section
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <h2 style="margin: 0 0 1rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Grade Distribution Over Time
        </h2>
        <div style="display: flex; gap: 0.25rem; align-items: flex-end">
          <div
            v-for="(snap, i) in snapshots"
            :key="i"
            style="flex: 1; display: flex; flex-direction: column; min-width: 0"
          >
            <div style="display: flex; flex-direction: column; height: 120px">
              <div
                v-for="bar in gradeBar(snap)"
                :key="bar.grade"
                :style="{
                  height: `${bar.pct}%`,
                  background: bar.color,
                  minHeight: bar.pct > 0 ? '2px' : '0',
                }"
                :title="`${bar.grade}: ${Math.round(bar.pct)}%`"
              />
            </div>
            <div style="font-size: 0.5rem; text-align: center; opacity: 0.3; margin-top: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ formatDateShort(snap.timestamp) }}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 0.5rem">
          <span v-for="g in ['A', 'B', 'C', 'D', 'F']" :key="g" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.6875rem">
            <span :style="{ width: '0.5rem', height: '0.5rem', borderRadius: '2px', background: { A: '#4ade80', B: '#a3e635', C: '#facc15', D: '#fb923c', F: '#f87171' }[g] }" />
            {{ g }}
          </span>
        </div>
      </section>

      <!-- Package sparklines -->
      <section
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <h2 style="margin: 0 0 1rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Package Score Trends
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem">
          <div
            v-for="pkg in packageNames"
            :key="pkg"
            style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.5rem 0.75rem;
              border-radius: 0.25rem;
              background: rgba(255, 255, 255, 0.02);
            "
          >
            <span style="font-size: 0.75rem; font-weight: 600; width: 50px">{{ pkg }}</span>
            <svg viewBox="0 0 80 24" style="width: 80px; height: 24px; flex-shrink: 0">
              <polyline
                :points="pkgSparkline(pkg)"
                fill="none"
                stroke="#4ade80"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
            <span style="font-size: 0.75rem; font-variant-numeric: tabular-nums; opacity: 0.6; margin-left: auto">
              {{ snapshots[snapshots.length - 1].packages.find((p) => p.name === pkg)?.avgScore ?? '?' }}
            </span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
