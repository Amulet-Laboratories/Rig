<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type {
  HealthManifest,
  ComparisonOutput,
  StaticAnalysisOutput,
  HealthHistory,
  CompetitorMatrix,
  Grade,
} from '../types'
import { GRADE_COLORS } from '../types'
import manifest from '@health/manifest.json'

const router = useRouter()
const data = manifest as unknown as HealthManifest

// Optional data sources — graceful fallback
let comparison: ComparisonOutput | null = null
let staticData: StaticAnalysisOutput | null = null
let history: HealthHistory | null = null
let competitors: (CompetitorMatrix & { notes: Record<string, string> }) | null = null

try { comparison = (await import('@health/comparison.json')).default as unknown as ComparisonOutput } catch {}
try { staticData = (await import('@health/static-analysis.json')).default as unknown as StaticAnalysisOutput } catch {}
try { history = (await import('@health/history.json')).default as unknown as HealthHistory } catch {}
try { competitors = (await import('../data/competitors.json')).default as unknown as CompetitorMatrix & { notes: Record<string, string> } } catch {}

// ── Utilities ─────────────────────────────────────────────────────────

function scoreColor(s: number): string {
  if (s >= 90) return '#4ade80'
  if (s >= 75) return '#a3e635'
  if (s >= 60) return '#facc15'
  if (s >= 45) return '#fb923c'
  return '#f87171'
}

function scoreGrade(s: number): Grade {
  if (s >= 90) return 'A'
  if (s >= 75) return 'B'
  if (s >= 60) return 'C'
  if (s >= 45) return 'D'
  return 'F'
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

// ── Trends (from history) ─────────────────────────────────────────────

const trend = computed(() => {
  if (!history || history.snapshots.length < 2) return null
  const last = history.snapshots[history.snapshots.length - 1]
  const prev = history.snapshots[history.snapshots.length - 2]
  return {
    score: last.averageScore - prev.averageScore,
    tests: last.totalPassed - prev.totalPassed,
    coverage: Math.round((last.overallCoverage?.statements ?? 0) - (prev.overallCoverage?.statements ?? 0)),
  }
})

function trendArrow(d: number | null | undefined): string {
  if (d == null) return ''
  if (d > 0) return '\u2191'
  if (d < 0) return '\u2193'
  return '\u2192'
}

function trendColor(d: number | null | undefined): string {
  if (d == null) return '#5a534e'
  if (d > 0) return '#4ade80'
  if (d < 0) return '#f87171'
  return '#5a534e'
}

// ── Rankings ──────────────────────────────────────────────────────────

const speedRank = computed(() => {
  if (!comparison) return null
  const libMounts = new Map<string, number[]>()
  for (const comp of comparison.comparisons) {
    for (const r of comp.results) {
      if (r.mountMedianMs >= 0 && (r.reliable ?? r.domNodeCount > 0)) {
        if (!libMounts.has(r.lib)) libMounts.set(r.lib, [])
        libMounts.get(r.lib)!.push(r.mountMedianMs)
      }
    }
  }
  const avgs = [...libMounts.entries()]
    .map(([lib, ms]) => ({ lib, avg: ms.reduce((a, b) => a + b, 0) / ms.length }))
    .sort((a, b) => a.avg - b.avg)
  const idx = avgs.findIndex((a) => a.lib === 'rig')
  return idx >= 0 ? { rank: idx + 1, total: avgs.length } : null
})

const sizeRank = computed(() => {
  if (!staticData) return null
  const sorted = [...staticData.packages].sort((a, b) => a.installSizeBytes - b.installSizeBytes)
  const idx = sorted.findIndex((p) => p.key === 'rig')
  return idx >= 0 ? { rank: idx + 1, total: sorted.length } : null
})

// ── Grades ────────────────────────────────────────────────────────────

const grades = computed(() => {
  const dist = data.summary.gradeDistribution
  return (['A', 'B', 'C', 'D', 'F'] as Grade[]).map((g) => ({
    grade: g,
    count: dist[g] ?? 0,
    color: GRADE_COLORS[g],
  }))
})

const totalItems = computed(() => data.summary.totalComponents + data.summary.totalComposables)

// ── Score histogram ──────────────────────────────────────────────────

const histogram = computed(() => data.summary.scoreDistribution)
const maxBucket = computed(() => Math.max(...histogram.value.map((b) => b.count), 1))

// ── Package health ───────────────────────────────────────────────────

const packageHealth = computed(() => {
  return [...data.summary.packages]
    .map((p) => ({ ...p, grade: scoreGrade(p.avgScore) }))
    .sort((a, b) => b.avgScore - a.avgScore)
})

// ── Dimension fill ───────────────────────────────────────────────────

const DIM_COLORS: Record<string, string> = {
  tests: '#4ade80',
  coverage: '#38bdf8',
  a11y: '#a78bfa',
  story: '#fb923c',
  hex: '#c9956d',
  bench: '#facc15',
}

const DIM_LABELS: Record<string, string> = {
  tests: 'Tests',
  coverage: 'Coverage',
  a11y: 'A11y',
  story: 'Story',
  hex: 'Hex CSS',
  bench: 'Bench',
}

const dimensionFill = computed(() => {
  const dims = data.summary.dimensionFill
  return Object.entries(dims).map(([key, val]) => ({
    key,
    label: DIM_LABELS[key] ?? key,
    filled: val.filled,
    total: val.total,
    pct: val.total > 0 ? Math.round((val.filled / val.total) * 100) : 0,
    color: DIM_COLORS[key] ?? '#8a8078',
  }))
})

// ── Competitive radar ────────────────────────────────────────────────

const RADAR_AXES = ['Speed', 'A11y', 'Breadth', 'Weight', 'Simplicity']
const RADAR_CX = 140
const RADAR_CY = 140
const RADAR_R = 100

function radarPoint(i: number, v: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5
  return {
    x: RADAR_CX + RADAR_R * v * Math.cos(angle),
    y: RADAR_CY + RADAR_R * v * Math.sin(angle),
  }
}

function radarPolygon(values: number[]): string {
  return values
    .map((v, i) => {
      const p = radarPoint(i, v)
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
    })
    .join(' ')
}

function labelPos(i: number) {
  const p = radarPoint(i, 1.22)
  const anchors = ['middle', 'start', 'start', 'end', 'end']
  return { x: p.x, y: p.y + (i === 0 ? -6 : 4), anchor: anchors[i] }
}

const radarData = computed(() => {
  if (!comparison || !staticData) return null

  const libMounts = new Map<string, number[]>()
  const libA11y = new Map<string, number[]>()
  for (const comp of comparison.comparisons) {
    for (const r of comp.results) {
      const isReliable = (r.reliable ?? r.domNodeCount > 0) && r.mountMedianMs >= 0
      if (isReliable) {
        if (!libMounts.has(r.lib)) libMounts.set(r.lib, [])
        libMounts.get(r.lib)!.push(r.mountMedianMs)
      }
      if (r.a11yScore >= 0 && isReliable) {
        if (!libA11y.has(r.lib)) libA11y.set(r.lib, [])
        libA11y.get(r.lib)!.push(r.a11yScore)
      }
    }
  }

  const pkgMap = new Map(staticData.packages.map((p) => [p.key, p]))
  const allKeys = new Set([...libMounts.keys(), ...pkgMap.keys()])

  type LM = { lib: string; speed: number; a11y: number; breadth: number; size: number; deps: number }
  const libs: LM[] = []
  for (const key of allKeys) {
    const mounts = libMounts.get(key)
    const a11y = libA11y.get(key)
    const pkg = pkgMap.get(key)
    libs.push({
      lib: key,
      speed: mounts ? mounts.reduce((a, b) => a + b, 0) / mounts.length : Infinity,
      a11y: a11y ? a11y.reduce((a, b) => a + b, 0) / a11y.length : 0,
      breadth: pkg?.estimatedComponents ?? 0,
      size: pkg?.installSizeBytes ?? Infinity,
      deps: pkg?.directDeps ?? Infinity,
    })
  }

  function norm(values: number[], higherBetter: boolean): number[] {
    const finite = values.filter((v) => isFinite(v))
    if (finite.length === 0) return values.map(() => 0)
    const min = Math.min(...finite)
    const max = Math.max(...finite)
    if (max === min) return values.map((v) => (isFinite(v) ? 1 : 0))
    return values.map((v) => {
      if (!isFinite(v)) return 0
      const n = (v - min) / (max - min)
      return higherBetter ? n : 1 - n
    })
  }

  const sN = norm(libs.map((l) => l.speed), false)
  const aN = norm(libs.map((l) => l.a11y), true)
  const bN = norm(libs.map((l) => l.breadth), true)
  const wN = norm(libs.map((l) => l.size), false)
  const dN = norm(libs.map((l) => l.deps), false)

  const ri = libs.findIndex((l) => l.lib === 'rig')
  if (ri < 0) return null

  const rigValues = [sN[ri], aN[ri], bN[ri], wN[ri], dN[ri]]
  const others = libs.map((_, i) => i).filter((i) => i !== ri)
  const avgValues = [sN, aN, bN, wN, dN].map((arr) => {
    const vals = others.map((i) => arr[i]).filter((v) => v > 0)
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
  })

  return { rigValues, avgValues }
})

// ── Priority actions ─────────────────────────────────────────────────

const priorityActions = computed(() => {
  return [...data.components]
    .filter((c) => c.gaps.length > 0)
    .map((c) => ({
      name: c.name,
      package: c.package,
      score: c.score,
      grade: c.grade,
      totalImpact: c.gaps.reduce((sum, g) => sum + g.impact, 0),
      gapCount: c.gaps.length,
      topGap: c.gaps[0]?.label ?? '',
    }))
    .sort((a, b) => b.totalImpact - a.totalImpact)
    .slice(0, 8)
})

// ── Unique-to-Rig count ──────────────────────────────────────────────

const uniqueCount = computed(() => {
  if (!competitors) return 0
  return competitors.matrix.filter((r) => r.has.every((v) => v === 0)).length
})
</script>

<template>
  <div style="padding: 24px; max-width: 1200px">
    <!-- Header -->
    <div style="margin-bottom: 28px">
      <div style="display: flex; align-items: baseline; gap: 12px">
        <h1
          style="
            font-size: 28px;
            font-weight: 800;
            color: #f5f1ed;
            margin: 0;
            letter-spacing: -0.5px;
          "
        >
          Rig
        </h1>
        <span style="font-size: 13px; color: #5a534e; font-weight: 500">v{{ (data as any).version ?? '—' }}</span>
      </div>
      <p style="color: #5a534e; font-size: 13px; margin: 4px 0 0">
        {{ data.summary.totalComponents }} components &middot;
        {{ data.summary.totalComposables }} composables &middot;
        {{ data.summary.packages.length }} packages
        <span v-if="uniqueCount > 0" style="color: #c9956d">
          &middot; {{ uniqueCount }} unique to Rig
        </span>
      </p>
    </div>

    <!-- Hero KPIs -->
    <div
      style="
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
        margin-bottom: 24px;
      "
    >
      <!-- Health Score -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 6px;
          "
        >
          Health Score
        </div>
        <div style="display: flex; align-items: baseline; gap: 4px">
          <span
            style="font-size: 36px; font-weight: 800; font-variant-numeric: tabular-nums"
            :style="{ color: scoreColor(data.summary.averageScore) }"
          >
            {{ data.summary.averageScore }}
          </span>
          <span style="font-size: 13px; color: #3a3530">/100</span>
          <span
            v-if="trend"
            style="font-size: 12px; margin-left: auto; font-weight: 600"
            :style="{ color: trendColor(trend.score) }"
          >
            {{ trendArrow(trend.score) }}{{ Math.abs(trend.score) }}
          </span>
        </div>
      </div>

      <!-- Tests -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 6px;
          "
        >
          Test Suite
        </div>
        <div style="display: flex; align-items: baseline; gap: 4px">
          <span
            style="font-size: 36px; font-weight: 800; font-variant-numeric: tabular-nums"
            :style="{ color: data.summary.totalFailed === 0 ? '#4ade80' : '#f87171' }"
          >
            {{ data.summary.totalPassed }}
          </span>
          <span style="font-size: 13px; color: #3a3530">/{{ data.summary.totalTests }}</span>
          <span
            v-if="trend"
            style="font-size: 12px; margin-left: auto; font-weight: 600"
            :style="{ color: trendColor(trend.tests) }"
          >
            {{ trendArrow(trend.tests) }}{{ Math.abs(trend.tests) }}
          </span>
        </div>
      </div>

      <!-- Coverage -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 6px;
          "
        >
          Stmt Coverage
        </div>
        <div style="display: flex; align-items: baseline; gap: 2px">
          <span
            style="font-size: 36px; font-weight: 800; font-variant-numeric: tabular-nums"
            :style="{
              color: (data.summary.overallCoverage?.statements ?? 0) >= 70 ? '#4ade80' : '#facc15',
            }"
          >
            {{ Math.round(data.summary.overallCoverage?.statements ?? 0) }}
          </span>
          <span style="font-size: 16px; color: #3a3530">%</span>
          <span
            v-if="trend"
            style="font-size: 12px; margin-left: auto; font-weight: 600"
            :style="{ color: trendColor(trend.coverage) }"
          >
            {{ trendArrow(trend.coverage) }}{{ Math.abs(trend.coverage) }}
          </span>
        </div>
      </div>

      <!-- Speed Rank -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 6px;
          "
        >
          Speed Rank
        </div>
        <div v-if="speedRank" style="display: flex; align-items: baseline; gap: 4px">
          <span
            style="font-size: 36px; font-weight: 800; font-variant-numeric: tabular-nums"
            :style="{ color: speedRank.rank === 1 ? '#4ade80' : speedRank.rank <= 3 ? '#facc15' : '#fb923c' }"
          >
            {{ ordinal(speedRank.rank) }}
          </span>
          <span style="font-size: 13px; color: #3a3530">of {{ speedRank.total }}</span>
        </div>
        <span v-else style="font-size: 14px; color: #3a3530">Run pnpm compare</span>
      </div>

      <!-- Size Rank -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 16px 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 6px;
          "
        >
          Size Rank
        </div>
        <div v-if="sizeRank" style="display: flex; align-items: baseline; gap: 4px">
          <span
            style="font-size: 36px; font-weight: 800; font-variant-numeric: tabular-nums"
            :style="{ color: sizeRank.rank === 1 ? '#4ade80' : sizeRank.rank <= 3 ? '#facc15' : '#fb923c' }"
          >
            {{ ordinal(sizeRank.rank) }}
          </span>
          <span style="font-size: 13px; color: #3a3530">of {{ sizeRank.total }}</span>
        </div>
        <span v-else style="font-size: 14px; color: #3a3530">Run pnpm compare</span>
      </div>
    </div>

    <!-- Grade Distribution + Score Histogram -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px">
      <!-- Grade Distribution -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 16px;
          "
        >
          Grade Distribution
        </div>
        <!-- Stacked bar -->
        <div style="display: flex; gap: 2px; height: 32px; border-radius: 6px; overflow: hidden">
          <div
            v-for="g in grades"
            :key="g.grade"
            v-show="g.count > 0"
            :style="{ flex: g.count, background: g.color, opacity: 0.85 }"
            :title="`${g.grade}: ${g.count} (${Math.round((g.count / totalItems) * 100)}%)`"
          />
        </div>
        <!-- Legend -->
        <div style="display: flex; gap: 16px; margin-top: 12px">
          <div
            v-for="g in grades"
            :key="g.grade"
            style="display: flex; align-items: center; gap: 5px; font-size: 12px"
          >
            <span style="font-weight: 700" :style="{ color: g.color }">{{ g.grade }}</span>
            <span style="color: #5a534e; font-variant-numeric: tabular-nums">{{ g.count }}</span>
          </div>
        </div>
      </div>

      <!-- Score Histogram -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 16px;
          "
        >
          Score Distribution
        </div>
        <div style="display: flex; align-items: flex-end; gap: 3px; height: 80px">
          <div
            v-for="bucket in histogram"
            :key="bucket.min"
            :style="{
              flex: 1,
              height: bucket.count > 0 ? Math.max((bucket.count / maxBucket) * 100, 6) + '%' : '0%',
              background: scoreColor(bucket.min + 5),
              borderRadius: '3px 3px 0 0',
              opacity: 0.75,
            }"
            :title="`${bucket.min}\u2013${bucket.max}: ${bucket.count}`"
          />
        </div>
        <div style="display: flex; gap: 3px; margin-top: 4px">
          <div
            v-for="bucket in histogram"
            :key="bucket.min"
            style="flex: 1; text-align: center; font-size: 9px; color: #3a3530; font-variant-numeric: tabular-nums"
          >
            {{ bucket.min }}
          </div>
        </div>
      </div>
    </div>

    <!-- Package Health -->
    <div
      style="
        background: #1a1714;
        border: 1px solid #2a2520;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
      "
    >
      <div
        style="
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #5a534e;
          margin-bottom: 16px;
        "
      >
        Package Health
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px">
        <div
          v-for="pkg in packageHealth"
          :key="pkg.name"
          style="padding: 14px; border-radius: 6px; cursor: pointer"
          :style="{
            background: `rgba(${pkg.grade === 'A' ? '74,222,128' : pkg.grade === 'B' ? '163,230,53' : pkg.grade === 'C' ? '250,204,21' : '251,146,60'}, 0.04)`,
            border: `1px solid rgba(${pkg.grade === 'A' ? '74,222,128' : pkg.grade === 'B' ? '163,230,53' : pkg.grade === 'C' ? '250,204,21' : '251,146,60'}, 0.12)`,
          }"
          @click="router.push('/')"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 6px;
            "
          >
            <span style="font-size: 12px; font-weight: 600; color: #f5f1ed">{{ pkg.name }}</span>
            <span style="font-size: 10px; color: #3a3530">{{ pkg.count }}</span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 4px">
            <span
              style="font-size: 26px; font-weight: 800; font-variant-numeric: tabular-nums"
              :style="{ color: GRADE_COLORS[pkg.grade] }"
            >
              {{ pkg.avgScore }}
            </span>
            <span
              style="font-size: 12px; font-weight: 700"
              :style="{ color: GRADE_COLORS[pkg.grade], opacity: 0.7 }"
            >
              {{ pkg.grade }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dimension Coverage + Competitive Radar -->
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 16px; margin-bottom: 24px">
      <!-- Dimension Coverage -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 16px;
          "
        >
          Dimension Coverage
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px">
          <div
            v-for="dim in dimensionFill"
            :key="dim.key"
            style="display: grid; grid-template-columns: 64px 1fr 38px; gap: 10px; align-items: center"
          >
            <span style="font-size: 11px; font-weight: 600; color: #8a8078; text-align: right">
              {{ dim.label }}
            </span>
            <div
              style="
                height: 10px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 5px;
                overflow: hidden;
              "
            >
              <div
                :style="{
                  height: '100%',
                  width: dim.pct + '%',
                  background: dim.color,
                  borderRadius: '5px',
                  opacity: 0.8,
                }"
              />
            </div>
            <span
              style="
                font-size: 11px;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
                text-align: right;
              "
              :style="{
                color: dim.pct >= 80 ? '#4ade80' : dim.pct >= 50 ? '#facc15' : '#f87171',
              }"
            >
              {{ dim.pct }}%
            </span>
          </div>
        </div>
        <div style="margin-top: 16px; font-size: 11px; color: #3a3530">
          {{ data.summary.totalGaps }} total gaps &middot;
          {{ data.summary.avgGapsPerComponent.toFixed(1) }} avg per component
        </div>
      </div>

      <!-- Competitive Radar -->
      <div
        style="
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 20px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
            margin-bottom: 12px;
          "
        >
          Competitive Position
        </div>
        <div v-if="radarData" style="display: flex; flex-direction: column; align-items: center">
          <svg viewBox="0 0 280 280" style="width: 100%; max-width: 260px">
            <!-- Grid rings -->
            <polygon
              v-for="level in [0.2, 0.4, 0.6, 0.8, 1.0]"
              :key="level"
              :points="radarPolygon([level, level, level, level, level])"
              fill="none"
              stroke="#2a2520"
              :stroke-width="level === 1 ? 1.5 : 0.5"
            />
            <!-- Axis lines -->
            <line
              v-for="i in 5"
              :key="`ax-${i}`"
              :x1="RADAR_CX"
              :y1="RADAR_CY"
              :x2="radarPoint(i - 1, 1).x"
              :y2="radarPoint(i - 1, 1).y"
              stroke="#2a2520"
              stroke-width="0.5"
            />
            <!-- Avg competitors polygon -->
            <polygon
              :points="radarPolygon(radarData.avgValues)"
              fill="rgba(138, 128, 120, 0.06)"
              stroke="#5a534e"
              stroke-width="1"
              stroke-dasharray="4 3"
            />
            <!-- Rig polygon -->
            <polygon
              :points="radarPolygon(radarData.rigValues)"
              fill="rgba(201, 149, 109, 0.12)"
              stroke="#c9956d"
              stroke-width="2"
            />
            <!-- Rig dots -->
            <circle
              v-for="(v, i) in radarData.rigValues"
              :key="`rd-${i}`"
              :cx="radarPoint(i, v).x"
              :cy="radarPoint(i, v).y"
              r="3.5"
              fill="#c9956d"
            />
            <!-- Axis labels -->
            <text
              v-for="(label, i) in RADAR_AXES"
              :key="`rl-${i}`"
              :x="labelPos(i).x"
              :y="labelPos(i).y"
              :text-anchor="labelPos(i).anchor"
              fill="#8a8078"
              font-size="10.5"
              font-weight="600"
              font-family="system-ui, sans-serif"
            >
              {{ label }}
            </text>
          </svg>
          <!-- Legend -->
          <div
            style="
              display: flex;
              gap: 20px;
              margin-top: 8px;
              font-size: 11px;
            "
          >
            <div style="display: flex; align-items: center; gap: 6px">
              <span
                style="
                  width: 16px;
                  height: 3px;
                  background: #c9956d;
                  border-radius: 2px;
                  display: inline-block;
                "
              />
              <span style="color: #c9956d; font-weight: 600">Rig</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px">
              <span
                style="
                  width: 16px;
                  height: 0;
                  border-top: 2px dashed #5a534e;
                  display: inline-block;
                "
              />
              <span style="color: #5a534e">Avg competitor</span>
            </div>
          </div>
        </div>
        <div
          v-else
          style="
            text-align: center;
            padding: 40px 0;
            color: #3a3530;
            font-size: 13px;
          "
        >
          Run
          <code
            style="
              background: #0f0d0a;
              padding: 2px 8px;
              border-radius: 4px;
              color: #c9956d;
            "
          >
            pnpm collect
          </code>
          for competitive data
        </div>
      </div>
    </div>

    <!-- Priority Actions -->
    <div
      v-if="priorityActions.length > 0"
      style="
        background: #1a1714;
        border: 1px solid #2a2520;
        border-radius: 8px;
        padding: 20px;
      "
    >
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        "
      >
        <div
          style="
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a534e;
          "
        >
          Priority Actions
        </div>
        <span style="font-size: 11px; color: #3a3530">
          Fix these to maximize score gains
        </span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 1px">
        <div
          v-for="item in priorityActions"
          :key="item.name"
          style="
            display: grid;
            grid-template-columns: 24px 1fr 80px 50px 60px;
            gap: 8px;
            align-items: center;
            padding: 9px 12px;
            border-radius: 4px;
            cursor: pointer;
          "
          :style="{
            background: 'rgba(255,255,255,0.015)',
          }"
          @click="router.push(`/component/${item.name}`)"
        >
          <span
            style="
              font-size: 10px;
              font-weight: 800;
              text-align: center;
              width: 20px;
              height: 20px;
              line-height: 20px;
              border-radius: 4px;
            "
            :style="{
              color: GRADE_COLORS[item.grade],
              background: `rgba(${item.grade === 'A' ? '74,222,128' : item.grade === 'B' ? '163,230,53' : item.grade === 'C' ? '250,204,21' : item.grade === 'D' ? '251,146,60' : '248,113,113'}, 0.12)`,
            }"
          >
            {{ item.grade }}
          </span>
          <div>
            <span style="font-size: 13px; color: #f5f1ed; font-weight: 500">{{ item.name }}</span>
            <span style="font-size: 10px; color: #3a3530; margin-left: 6px">{{ item.package }}</span>
          </div>
          <span style="font-size: 11px; color: #5a534e; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ item.topGap }}
          </span>
          <span
            style="
              font-size: 12px;
              font-weight: 700;
              color: #4ade80;
              text-align: right;
              font-variant-numeric: tabular-nums;
            "
          >
            +{{ item.totalImpact }}
          </span>
          <span
            style="
              font-size: 10px;
              color: #5a534e;
              text-align: right;
            "
          >
            {{ item.gapCount }} gaps
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
