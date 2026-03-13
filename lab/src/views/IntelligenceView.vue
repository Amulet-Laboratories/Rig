<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type {
  ComparisonOutput,
  StaticAnalysisOutput,
  CompetitorMatrix,
  CompetitorRow,
} from '../types'

const router = useRouter()

// Data sources
let comparison: ComparisonOutput | null = null
let staticData: StaticAnalysisOutput | null = null
let competitors: (CompetitorMatrix & {
  notes: Record<string, string>
  vueNative: Record<string, boolean>
}) | null = null

try { comparison = (await import('@health/comparison.json')).default as unknown as ComparisonOutput } catch {}
try { staticData = (await import('@health/static-analysis.json')).default as unknown as StaticAnalysisOutput } catch {}
try { competitors = (await import('../data/competitors.json')).default as unknown as CompetitorMatrix & { notes: Record<string, string>; vueNative: Record<string, boolean> } } catch {}

// ── Library colors ───────────────────────────────────────────────────

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
  return LIB_COLORS[lib] ?? '#5a534e'
}

// ── Competitor selection ─────────────────────────────────────────────

const availableCompetitors = computed(() => {
  if (!staticData) return []
  return staticData.packages
    .filter((p) => p.key !== 'rig')
    .map((p) => ({ key: p.key, name: p.name, isVue: p.isVueNative, framework: p.framework }))
})

const selectedLib = ref('radix')

const selectedLibName = computed(() => {
  const pkg = staticData?.packages.find((p) => p.key === selectedLib.value)
  return pkg?.name ?? selectedLib.value
})

// ── Positioning statement ────────────────────────────────────────────

const rigPkg = computed(() => staticData?.packages.find((p) => p.key === 'rig') ?? null)

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
  return idx >= 0 ? { rank: idx + 1, total: avgs.length, avgMs: avgs[idx].avg } : null
})

const sizeRank = computed(() => {
  if (!staticData) return null
  const sorted = [...staticData.packages].sort((a, b) => a.installSizeBytes - b.installSizeBytes)
  const idx = sorted.findIndex((p) => p.key === 'rig')
  return idx >= 0 ? { rank: idx + 1, total: sorted.length } : null
})

const uniqueCount = computed(() => {
  if (!competitors) return 0
  return competitors.matrix.filter((r) => r.has.every((v) => v === 0)).length
})

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// ── Head-to-head comparison ──────────────────────────────────────────

const headToHead = computed(() => {
  if (!staticData) return null

  const rPkg = rigPkg.value
  const cPkg = staticData.packages.find((p) => p.key === selectedLib.value)

  // Benchmark aggregates — only count reliable results (Rec #5)
  let rigMounts: number[] = []
  let compMounts: number[] = []
  let rigA11y: number[] = []
  let compA11y: number[] = []
  let rigWins = 0
  let compWins = 0
  let benchedCount = 0
  let unreliableCount = 0

  if (comparison) {
    for (const c of comparison.comparisons) {
      const rig = c.results.find((r) => r.lib === 'rig')
      const comp = c.results.find((r) => r.lib === selectedLib.value)
      if (!comp) continue
      benchedCount++

      const rigReliable = rig && (rig.reliable ?? rig.domNodeCount > 0) && rig.mountMedianMs >= 0
      const compReliable = (comp.reliable ?? comp.domNodeCount > 0) && comp.mountMedianMs >= 0

      if (rigReliable) rigMounts.push(rig!.mountMedianMs)
      if (compReliable) compMounts.push(comp.mountMedianMs)
      if (rig?.a11yScore != null && rig.a11yScore >= 0) rigA11y.push(rig.a11yScore)
      if (comp.a11yScore >= 0 && compReliable) compA11y.push(comp.a11yScore)

      // Win/loss only counts when BOTH sides are reliable
      if (rigReliable && compReliable) {
        if (rig!.mountMedianMs <= comp.mountMedianMs) rigWins++
        else compWins++
      } else {
        unreliableCount++
      }
    }
  }

  const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null)

  const metrics = [
    {
      label: 'Avg Mount',
      unit: 'ms',
      rigVal: avg(rigMounts),
      compVal: avg(compMounts),
      rigDisplay: avg(rigMounts) != null ? `${avg(rigMounts)!.toFixed(2)}ms` : 'N/A',
      compDisplay: avg(compMounts) != null ? `${avg(compMounts)!.toFixed(2)}ms` : 'N/A',
      lowerBetter: true,
    },
    {
      label: 'Install Size',
      unit: '',
      rigVal: rPkg?.installSizeBytes ?? null,
      compVal: cPkg?.installSizeBytes ?? null,
      rigDisplay: rPkg ? formatBytes(rPkg.installSizeBytes) : 'N/A',
      compDisplay: cPkg ? formatBytes(cPkg.installSizeBytes) : 'N/A',
      lowerBetter: true,
    },
    {
      label: 'Avg A11y Score',
      unit: '',
      rigVal: avg(rigA11y),
      compVal: avg(compA11y),
      rigDisplay: avg(rigA11y) != null ? `${Math.round(avg(rigA11y)!)}` : 'N/A',
      compDisplay: avg(compA11y) != null ? `${Math.round(avg(compA11y)!)}` : 'N/A',
      lowerBetter: false,
    },
    {
      label: 'Components',
      unit: '',
      rigVal: rPkg?.estimatedComponents ?? null,
      compVal: cPkg?.estimatedComponents ?? null,
      rigDisplay: `${rPkg?.estimatedComponents ?? '?'}`,
      compDisplay: `${cPkg?.estimatedComponents ?? '?'}`,
      lowerBetter: false,
    },
    {
      label: 'Dependencies',
      unit: '',
      rigVal: rPkg?.directDeps ?? null,
      compVal: cPkg?.directDeps ?? null,
      rigDisplay: `${rPkg?.directDeps ?? '?'}`,
      compDisplay: `${cPkg?.directDeps ?? '?'}`,
      lowerBetter: true,
    },
    {
      label: 'Bench Wins',
      unit: '',
      rigVal: rigWins,
      compVal: compWins,
      rigDisplay: `${rigWins}`,
      compDisplay: `${compWins}`,
      lowerBetter: false,
    },
  ]

  // Determine winner per metric
  return metrics.map((m) => {
    let rigWin = false
    let compWin = false
    if (m.rigVal != null && m.compVal != null) {
      if (m.lowerBetter) {
        rigWin = m.rigVal < m.compVal
        compWin = m.compVal < m.rigVal
      } else {
        rigWin = m.rigVal > m.compVal
        compWin = m.compVal > m.rigVal
      }
    }
    return { ...m, rigWin, compWin }
  })
})

// ── Radar chart ──────────────────────────────────────────────────────

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
      return higherBetter ? (v - min) / (max - min) : 1 - (v - min) / (max - min)
    })
  }

  const sN = norm(libs.map((l) => l.speed), false)
  const aN = norm(libs.map((l) => l.a11y), true)
  const bN = norm(libs.map((l) => l.breadth), true)
  const wN = norm(libs.map((l) => l.size), false)
  const dN = norm(libs.map((l) => l.deps), false)

  const ri = libs.findIndex((l) => l.lib === 'rig')
  const ci = libs.findIndex((l) => l.lib === selectedLib.value)
  if (ri < 0) return null

  const rigValues = [sN[ri], aN[ri], bN[ri], wN[ri], dN[ri]]
  const compValues = ci >= 0 ? [sN[ci], aN[ci], bN[ci], wN[ci], dN[ci]] : null

  return { rigValues, compValues }
})

// ── Performance leaderboard ──────────────────────────────────────────

type SortKey = 'component' | 'rig' | 'comp' | 'winner' | 'delta'
const sortKey = ref<SortKey>('winner')
const sortAsc = ref(true)

const perComponentResults = computed(() => {
  if (!comparison) return []

  const rows = comparison.comparisons
    .map((c) => {
      const rig = c.results.find((r) => r.lib === 'rig')
      const comp = c.results.find((r) => r.lib === selectedLib.value)

      const rigMs = rig?.mountMedianMs ?? -1
      const compMs = comp?.mountMedianMs ?? -1
      const rigReliable = rig != null && (rig.reliable ?? rig.domNodeCount > 0) && rigMs >= 0
      const compReliable = comp != null && (comp.reliable ?? comp.domNodeCount > 0) && compMs >= 0

      let winner: 'rig' | 'comp' | 'tie' | 'none' | 'unreliable' = 'none'
      let deltaNum = 0

      if (rigReliable && compReliable) {
        if (Math.abs(rigMs - compMs) < 0.001) {
          winner = 'tie'
        } else if (rigMs < compMs) {
          winner = 'rig'
          deltaNum = compMs / rigMs
        } else {
          winner = 'comp'
          deltaNum = rigMs / compMs
        }
      } else if (rigMs >= 0 || compMs >= 0) {
        winner = 'unreliable'
      }

      return {
        name: c.rigComponent,
        rigMs,
        compMs,
        rigReliable,
        compReliable,
        winner,
        deltaNum,
        delta:
          deltaNum > 1
            ? `${deltaNum.toFixed(1)}x`
            : winner === 'tie'
              ? '='
              : winner === 'unreliable'
                ? '~'
                : winner === 'none'
                  ? ''
                  : 'only',
        rigA11y: rig?.a11yScore ?? -1,
        compA11y: comp?.a11yScore ?? -1,
      }
    })
    .filter((r) => r.winner !== 'none' || r.rigMs >= 0)

  // Sort
  rows.sort((a, b) => {
    const dir = sortAsc.value ? 1 : -1
    switch (sortKey.value) {
      case 'component':
        return dir * a.name.localeCompare(b.name)
      case 'rig':
        return dir * (a.rigMs - b.rigMs)
      case 'comp':
        return dir * (a.compMs - b.compMs)
      case 'winner': {
        const order = { rig: 0, tie: 1, comp: 2, unreliable: 3, none: 4 }
        return dir * ((order[a.winner] ?? 4) - (order[b.winner] ?? 4))
      }
      case 'delta':
        return dir * (a.deltaNum - b.deltaNum)
      default:
        return 0
    }
  })

  return rows
})

function toggleSort(key: SortKey) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function sortIcon(key: SortKey): string {
  if (sortKey.value !== key) return '\u21D5'
  return sortAsc.value ? '\u2191' : '\u2193'
}

// Win/loss summary
const winSummary = computed(() => {
  const rows = perComponentResults.value
  return {
    rigWins: rows.filter((r) => r.winner === 'rig').length,
    compWins: rows.filter((r) => r.winner === 'comp').length,
    ties: rows.filter((r) => r.winner === 'tie').length,
    unreliable: rows.filter((r) => r.winner === 'unreliable').length,
    total: rows.length,
    reliableTotal: rows.filter((r) => r.winner !== 'unreliable' && r.winner !== 'none').length,
  }
})

// ── Size landscape ───────────────────────────────────────────────────

const sizeLandscape = computed(() => {
  if (!staticData) return []
  return [...staticData.packages].sort((a, b) => a.installSizeBytes - b.installSizeBytes)
})

const maxSize = computed(() => {
  return Math.max(...(sizeLandscape.value.map((p) => p.installSizeBytes) ?? [1]))
})

// ── Feature overlap (for selected competitor) ────────────────────────

const featureOverlap = computed(() => {
  if (!competitors) return null
  const compIdx = competitors.competitors.indexOf(
    competitors.competitors.find((c) =>
      c.toLowerCase().includes(selectedLib.value.replace(/[-_]/g, '')) ||
      selectedLib.value.includes(c.toLowerCase().replace(/[\s-]/g, '')),
    ) ?? '',
  )

  if (compIdx < 0) return null

  const shared = competitors.matrix.filter((r) => r.has[compIdx] === 1).length
  const rigOnly = competitors.matrix.filter((r) => r.has[compIdx] === 0).length
  const total = competitors.matrix.length

  return {
    competitorName: competitors.competitors[compIdx],
    shared,
    rigOnly,
    total,
    sharedPct: Math.round((shared / total) * 100),
    rigOnlyPct: Math.round((rigOnly / total) * 100),
  }
})
</script>

<template>
  <div style="padding: 24px; max-width: 1400px">
    <!-- Header -->
    <div style="margin-bottom: 24px">
      <h1
        style="
          font-size: 24px;
          font-weight: 800;
          color: #f5f1ed;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        "
      >
        Competitive Intelligence
      </h1>
      <p v-if="staticData" style="color: #5a534e; font-size: 13px; margin: 0">
        <span v-if="speedRank" style="color: #8a8078">
          {{ ordinal(speedRank.rank) }} fastest
          ({{ speedRank.avgMs.toFixed(2) }}ms avg)
        </span>
        <span v-if="speedRank && sizeRank"> &middot; </span>
        <span v-if="sizeRank" style="color: #8a8078">
          {{ ordinal(sizeRank.rank) }} smallest
          ({{ rigPkg?.installSizeFormatted ?? '?' }})
        </span>
        <span v-if="uniqueCount > 0">
          &middot; <span style="color: #c9956d">{{ uniqueCount }} unique components</span>
        </span>
      </p>
    </div>

    <!-- Competitor selector -->
    <div style="margin-bottom: 24px">
      <div
        style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a1714;
          border: 1px solid #2a2520;
          border-radius: 8px;
          padding: 6px 8px;
        "
      >
        <span style="font-size: 13px; color: #c9956d; font-weight: 600; padding-left: 8px">
          Rig
        </span>
        <span style="font-size: 12px; color: #3a3530">vs</span>
        <select
          v-model="selectedLib"
          style="
            background: #0f0d0a;
            border: 1px solid #2a2520;
            border-radius: 6px;
            color: #f5f1ed;
            padding: 6px 12px;
            font-size: 13px;
            font-family: inherit;
            cursor: pointer;
            outline: none;
          "
        >
          <option
            v-for="comp in availableCompetitors"
            :key="comp.key"
            :value="comp.key"
          >
            {{ comp.name }}
            {{ comp.isVue ? '' : '(React)' }}
          </option>
        </select>
      </div>
    </div>

    <!-- Head-to-Head + Radar -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px">
      <!-- Head-to-Head Metrics -->
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
          Head to Head
        </div>
        <!-- Column headers -->
        <div
          v-if="headToHead"
          style="
            display: grid;
            grid-template-columns: 1fr 90px 1fr;
            align-items: center;
            padding-bottom: 8px;
            border-bottom: 1px solid #2a2520;
            margin-bottom: 4px;
          "
        >
          <div style="text-align: right; padding-right: 16px">
            <span style="font-size: 11px; font-weight: 700; color: #c9956d; text-transform: uppercase">
              Rig
            </span>
          </div>
          <div style="text-align: center">
            <span style="font-size: 9px; color: #3a3530; text-transform: uppercase; letter-spacing: 1px">
              Metric
            </span>
          </div>
          <div style="padding-left: 16px">
            <span
              style="font-size: 11px; font-weight: 700; text-transform: uppercase"
              :style="{ color: libColor(selectedLib) }"
            >
              {{ selectedLibName.replace(/@.*\//, '').split('-')[0] }}
            </span>
          </div>
        </div>
        <!-- Metric rows -->
        <div
          v-for="m in headToHead"
          :key="m.label"
          style="
            display: grid;
            grid-template-columns: 1fr 90px 1fr;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          "
        >
          <div style="text-align: right; padding-right: 16px">
            <span
              style="font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums"
              :style="{ color: m.rigWin ? '#c9956d' : m.rigVal != null ? '#5a534e' : '#3a3530' }"
            >
              {{ m.rigDisplay }}
            </span>
            <span
              v-if="m.rigWin"
              style="
                display: inline-block;
                width: 6px;
                height: 6px;
                background: #c9956d;
                border-radius: 50%;
                margin-left: 6px;
                vertical-align: middle;
              "
            />
          </div>
          <div style="text-align: center">
            <span style="font-size: 10px; font-weight: 600; color: #5a534e; text-transform: uppercase; letter-spacing: 0.5px">
              {{ m.label }}
            </span>
          </div>
          <div style="padding-left: 16px">
            <span
              v-if="m.compWin"
              style="
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                margin-right: 6px;
                vertical-align: middle;
              "
              :style="{ background: libColor(selectedLib) }"
            />
            <span
              style="font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums"
              :style="{ color: m.compWin ? libColor(selectedLib) : m.compVal != null ? '#5a534e' : '#3a3530' }"
            >
              {{ m.compDisplay }}
            </span>
          </div>
        </div>

        <!-- Feature overlap -->
        <div
          v-if="featureOverlap"
          style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #2a2520"
        >
          <div style="font-size: 11px; color: #5a534e; margin-bottom: 8px">
            API Coverage vs {{ featureOverlap.competitorName }}
          </div>
          <div
            style="display: flex; gap: 2px; height: 12px; border-radius: 6px; overflow: hidden"
          >
            <div
              :style="{
                flex: featureOverlap.rigOnly,
                background: '#c9956d',
                opacity: 0.7,
              }"
              :title="`Rig only: ${featureOverlap.rigOnly}`"
            />
            <div
              :style="{
                flex: featureOverlap.shared,
                background: libColor(selectedLib),
                opacity: 0.5,
              }"
              :title="`Shared: ${featureOverlap.shared}`"
            />
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 10px">
            <span style="color: #c9956d">{{ featureOverlap.rigOnlyPct }}% unique to Rig</span>
            <span :style="{ color: libColor(selectedLib) }">{{ featureOverlap.sharedPct }}% shared</span>
          </div>
        </div>
      </div>

      <!-- Radar Chart -->
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
          Profile Comparison
        </div>
        <div v-if="radarData" style="display: flex; flex-direction: column; align-items: center">
          <svg viewBox="0 0 280 280" style="width: 100%; max-width: 260px">
            <!-- Grid -->
            <polygon
              v-for="level in [0.2, 0.4, 0.6, 0.8, 1.0]"
              :key="level"
              :points="radarPolygon([level, level, level, level, level])"
              fill="none"
              stroke="#2a2520"
              :stroke-width="level === 1 ? 1.5 : 0.5"
            />
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
            <!-- Competitor polygon -->
            <polygon
              v-if="radarData.compValues"
              :points="radarPolygon(radarData.compValues)"
              :fill="`${libColor(selectedLib)}11`"
              :stroke="libColor(selectedLib)"
              stroke-width="1.5"
              opacity="0.7"
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
            <!-- Comp dots -->
            <template v-if="radarData.compValues">
              <circle
                v-for="(v, i) in radarData.compValues"
                :key="`cd-${i}`"
                :cx="radarPoint(i, v).x"
                :cy="radarPoint(i, v).y"
                r="3"
                :fill="libColor(selectedLib)"
                opacity="0.8"
              />
            </template>
            <!-- Labels -->
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
          <div style="display: flex; gap: 20px; margin-top: 8px; font-size: 11px">
            <div style="display: flex; align-items: center; gap: 6px">
              <span style="width: 16px; height: 3px; background: #c9956d; border-radius: 2px; display: inline-block" />
              <span style="color: #c9956d; font-weight: 600">Rig</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px">
              <span
                style="width: 16px; height: 3px; border-radius: 2px; display: inline-block"
                :style="{ background: libColor(selectedLib) }"
              />
              <span :style="{ color: libColor(selectedLib) }">{{ selectedLibName }}</span>
            </div>
          </div>
        </div>
        <div v-else style="text-align: center; padding: 60px 0; color: #3a3530; font-size: 13px">
          Run
          <code style="background: #0f0d0a; padding: 2px 8px; border-radius: 4px; color: #c9956d">pnpm collect</code>
        </div>
      </div>
    </div>

    <!-- Size Landscape -->
    <div
      v-if="sizeLandscape.length > 0"
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
        Install Size Landscape
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px">
        <div
          v-for="pkg in sizeLandscape"
          :key="pkg.key"
          style="display: flex; align-items: center; gap: 12px"
        >
          <div style="width: 140px; text-align: right; flex-shrink: 0">
            <span
              style="font-size: 12px"
              :style="{
                fontWeight: pkg.key === 'rig' || pkg.key === selectedLib ? 700 : 400,
                color:
                  pkg.key === 'rig'
                    ? '#c9956d'
                    : pkg.key === selectedLib
                      ? libColor(selectedLib)
                      : '#8a8078',
              }"
            >
              {{ pkg.name }}
            </span>
          </div>
          <div
            style="
              flex: 1;
              height: 20px;
              background: rgba(255, 255, 255, 0.02);
              border-radius: 4px;
              overflow: hidden;
            "
          >
            <div
              :style="{
                height: '100%',
                width: (pkg.installSizeBytes / maxSize) * 100 + '%',
                background:
                  pkg.key === 'rig'
                    ? '#c9956d'
                    : pkg.key === selectedLib
                      ? libColor(selectedLib)
                      : '#3a3530',
                opacity: pkg.key === 'rig' || pkg.key === selectedLib ? 1 : 0.5,
                borderRadius: '4px',
                minWidth: '2px',
              }"
            />
          </div>
          <span
            style="
              font-size: 12px;
              font-variant-numeric: tabular-nums;
              width: 60px;
              text-align: right;
              flex-shrink: 0;
            "
            :style="{
              color:
                pkg.key === 'rig'
                  ? '#c9956d'
                  : pkg.key === selectedLib
                    ? libColor(selectedLib)
                    : '#5a534e',
              fontWeight: pkg.key === 'rig' || pkg.key === selectedLib ? 600 : 400,
            }"
          >
            {{ pkg.installSizeFormatted }}
          </span>
        </div>
      </div>
    </div>

    <!-- Performance Leaderboard -->
    <div
      v-if="perComponentResults.length > 0"
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
          margin-bottom: 16px;
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
          Performance Leaderboard
        </div>
        <div style="display: flex; gap: 12px; font-size: 11px; align-items: center">
          <span style="color: #c9956d; font-weight: 700">
            Rig {{ winSummary.rigWins }}
          </span>
          <span style="color: #5a534e">
            {{ winSummary.ties }} ties
          </span>
          <span :style="{ color: libColor(selectedLib), fontWeight: 700 }">
            {{ selectedLibName.replace(/@.*\//, '').split('-')[0] }} {{ winSummary.compWins }}
          </span>
          <span
            v-if="winSummary.unreliable > 0"
            style="color: #3a3530; font-size: 10px"
            :title="`${winSummary.unreliable} comparisons excluded — one or both sides rendered no meaningful DOM`"
          >
            ({{ winSummary.unreliable }} excluded)
          </span>
        </div>
      </div>
      <!-- Win rate bar (reliable only) -->
      <div
        v-if="winSummary.reliableTotal > 0"
        style="display: flex; gap: 2px; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 16px"
      >
        <div
          :style="{ flex: winSummary.rigWins, background: '#c9956d' }"
          :title="`Rig wins: ${winSummary.rigWins}`"
        />
        <div
          :style="{ flex: winSummary.ties, background: '#3a3530' }"
          :title="`Ties: ${winSummary.ties}`"
        />
        <div
          :style="{ flex: winSummary.compWins, background: libColor(selectedLib) }"
          :title="`${selectedLibName} wins: ${winSummary.compWins}`"
        />
      </div>
      <!-- Table -->
      <div style="overflow-x: auto">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px">
          <thead>
            <tr style="border-bottom: 1px solid #2a2520">
              <th
                style="text-align: left; padding: 8px 12px; color: #5a534e; font-weight: 600; font-size: 11px; cursor: pointer; user-select: none"
                @click="toggleSort('component')"
              >
                Component {{ sortIcon('component') }}
              </th>
              <th
                style="text-align: right; padding: 8px 12px; color: #c9956d; font-weight: 600; font-size: 11px; cursor: pointer; user-select: none; width: 90px"
                @click="toggleSort('rig')"
              >
                Rig ms {{ sortIcon('rig') }}
              </th>
              <th
                style="text-align: right; padding: 8px 12px; font-weight: 600; font-size: 11px; cursor: pointer; user-select: none; width: 90px"
                :style="{ color: libColor(selectedLib) }"
                @click="toggleSort('comp')"
              >
                {{ selectedLibName.replace(/@.*\//, '').split('-')[0] }} {{ sortIcon('comp') }}
              </th>
              <th
                style="text-align: center; padding: 8px 12px; color: #5a534e; font-weight: 600; font-size: 11px; cursor: pointer; user-select: none; width: 70px"
                @click="toggleSort('winner')"
              >
                Winner {{ sortIcon('winner') }}
              </th>
              <th
                style="text-align: right; padding: 8px 12px; color: #5a534e; font-weight: 600; font-size: 11px; cursor: pointer; user-select: none; width: 70px"
                @click="toggleSort('delta')"
              >
                Delta {{ sortIcon('delta') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in perComponentResults"
              :key="row.name"
              style="cursor: pointer"
              :style="{
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                background:
                  row.winner === 'rig'
                    ? 'rgba(201, 149, 109, 0.03)'
                    : row.winner === 'comp'
                      ? `${libColor(selectedLib)}06`
                      : 'transparent',
              }"
              @click="router.push(`/component/${row.name}`)"
            >
              <td style="padding: 7px 12px; color: #f5f1ed; font-weight: 500">
                {{ row.name }}
              </td>
              <td
                style="
                  padding: 7px 12px;
                  text-align: right;
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 12px;
                "
              >
                <span v-if="row.rigMs >= 0" style="color: #f5f1ed">
                  {{ row.rigMs.toFixed(3) }}
                </span>
                <span v-else style="color: #fb923c; font-size: 10px">err</span>
              </td>
              <td
                style="
                  padding: 7px 12px;
                  text-align: right;
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 12px;
                "
              >
                <span v-if="row.compMs >= 0" style="color: #f5f1ed">
                  {{ row.compMs.toFixed(3) }}
                </span>
                <span v-else style="color: #fb923c; font-size: 10px">err</span>
              </td>
              <td style="padding: 7px 12px; text-align: center">
                <span
                  v-if="row.winner === 'rig'"
                  style="
                    font-size: 10px;
                    font-weight: 800;
                    color: #0f0d0a;
                    background: #c9956d;
                    padding: 1px 6px;
                    border-radius: 3px;
                  "
                >
                  RIG
                </span>
                <span
                  v-else-if="row.winner === 'comp'"
                  style="font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 3px"
                  :style="{
                    color: '#0f0d0a',
                    background: libColor(selectedLib),
                  }"
                >
                  {{ selectedLibName.replace(/@.*\//, '').split('-')[0].toUpperCase().slice(0, 5) }}
                </span>
                <span
                  v-else-if="row.winner === 'tie'"
                  style="font-size: 10px; color: #5a534e"
                >
                  TIE
                </span>
                <span
                  v-else-if="row.winner === 'unreliable'"
                  style="font-size: 10px; color: #5a534e; opacity: 0.5"
                  title="One or both sides did not render meaningful DOM — result excluded from rankings"
                >
                  ···
                </span>
                <span v-else style="font-size: 10px; color: #3a3530">—</span>
              </td>
              <td
                style="
                  padding: 7px 12px;
                  text-align: right;
                  font-size: 11px;
                "
                :style="{
                  color:
                    row.winner === 'rig'
                      ? '#4ade80'
                      : row.winner === 'comp'
                        ? '#fb923c'
                        : '#3a3530',
                }"
              >
                {{ row.delta || '\u2014' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No data -->
    <div
      v-if="!comparison && !staticData"
      style="text-align: center; padding: 80px 20px; color: #3a3530; font-size: 14px"
    >
      No competitive data found. Run
      <code
        style="
          background: #1a1714;
          padding: 2px 8px;
          border-radius: 4px;
          color: #c9956d;
        "
      >
        pnpm collect
      </code>
      to generate benchmarks and static analysis.
    </div>
  </div>
</template>
