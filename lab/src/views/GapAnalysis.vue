<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { HealthManifest, ComponentHealth, Grade } from '../types'
import { GRADE_COLORS, GRADE_BG } from '../types'
import manifest from '@health/manifest.json'

const data = manifest as unknown as HealthManifest
const router = useRouter()

// Filters
const filterDimension = ref<string | null>(null)
const filterPackage = ref<string | null>(null)

const dimensions = ['tests', 'coverage', 'a11y', 'story', 'hex', 'bench'] as const

const dimensionLabels: Record<string, string> = {
  tests: 'Tests',
  coverage: 'Coverage',
  a11y: 'Accessibility',
  story: 'Story',
  hex: 'Hex CSS',
  bench: 'Benchmark',
}

const dimensionColors: Record<string, string> = {
  tests: '#4ade80',
  coverage: '#38bdf8',
  a11y: '#a78bfa',
  story: '#fb923c',
  hex: '#c9956d',
  bench: '#facc15',
}

// Score distribution histogram data
const scoreBuckets = computed(() => data.summary.scoreDistribution)

const maxBucketCount = computed(() => Math.max(...scoreBuckets.value.map((b) => b.count), 1))

// Dimension fill rates
const dimensionFill = computed(() => {
  const fill = data.summary.dimensionFill
  return dimensions.map((d) => ({
    key: d,
    label: dimensionLabels[d],
    color: dimensionColors[d],
    filled: fill[d]?.filled ?? 0,
    total: fill[d]?.total ?? 0,
    pct: fill[d] ? Math.round((fill[d].filled / fill[d].total) * 100) : 0,
  }))
})

// All gaps sorted by impact
const allGaps = computed(() => {
  let items = data.components.flatMap((c) =>
    c.gaps.map((g) => ({ ...g, component: c.name, package: c.package, score: c.score, grade: c.grade as Grade })),
  )

  if (filterDimension.value) {
    items = items.filter((g) => g.dimension === filterDimension.value)
  }
  if (filterPackage.value) {
    items = items.filter((g) => g.package === filterPackage.value)
  }

  return items.sort((a, b) => b.impact - a.impact)
})

// Components closest to next grade
const upgradeTargets = computed(() => {
  return [...data.components]
    .filter((c) => c.nextGrade.pointsNeeded <= c.nextGrade.totalGapImpact && c.grade !== 'A')
    .sort((a, b) => a.nextGrade.pointsNeeded - b.nextGrade.pointsNeeded)
    .slice(0, 15)
})

// Package coverage heatmap data
const packageHeatmap = computed(() => {
  const pkgs = data.summary.packages
  return pkgs.map((pkg) => {
    const comps = data.components.filter((c) => c.package === pkg.name)
    const withCoverage = comps.filter((c) => c.coverage)
    const avgStmts = withCoverage.length > 0
      ? Math.round(withCoverage.reduce((s, c) => s + (c.coverage?.statements ?? 0), 0) / withCoverage.length)
      : 0
    const avgBranch = withCoverage.length > 0
      ? Math.round(withCoverage.reduce((s, c) => s + (c.coverage?.branches ?? 0), 0) / withCoverage.length)
      : 0
    const avgFuncs = withCoverage.length > 0
      ? Math.round(withCoverage.reduce((s, c) => s + (c.coverage?.functions ?? 0), 0) / withCoverage.length)
      : 0
    const avgLines = withCoverage.length > 0
      ? Math.round(withCoverage.reduce((s, c) => s + (c.coverage?.lines ?? 0), 0) / withCoverage.length)
      : 0
    return {
      name: pkg.name,
      count: pkg.count,
      avgScore: pkg.avgScore,
      avgStmts,
      avgBranch,
      avgFuncs,
      avgLines,
      gapCount: comps.reduce((s, c) => s + c.gaps.length, 0),
    }
  })
})

// A11y pattern breakdown
const a11yBreakdown = computed(() => {
  const components = data.components.filter((c) => c.type === 'component')
  const total = components.length
  return [
    { label: 'ARIA attributes', count: components.filter((c) => c.a11y?.hasAriaAttributes).length, total },
    { label: 'Semantic roles', count: components.filter((c) => c.a11y?.patterns.includes('semantic-roles')).length, total },
    { label: 'Keyboard nav', count: components.filter((c) => c.a11y?.hasKeyboardNav).length, total },
    { label: 'Focus management', count: components.filter((c) => c.a11y?.hasFocusManagement).length, total },
    { label: 'Reduced motion', count: components.filter((c) => c.a11y?.hasReducedMotion).length, total },
  ]
})

// Test duration distribution (buckets)
const testDurationBuckets = computed(() => {
  const durations = data.components
    .filter((c) => c.tests)
    .map((c) => ({ name: c.name, duration: c.tests!.duration, count: c.tests!.total }))
    .sort((a, b) => b.duration - a.duration)
  return durations.slice(0, 20)
})

function heatColor(value: number, max: number = 100): string {
  if (value >= 80) return '#4ade80'
  if (value >= 60) return '#facc15'
  if (value >= 40) return '#fb923c'
  return '#f87171'
}

function goTo(name: string) {
  router.push({ name: 'detail', params: { name } })
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 1400px; margin: 0 auto; width: 100%">
    <!-- Header -->
    <div>
      <h1 style="margin: 0 0 0.25rem; font-size: 1.25rem; font-weight: 700">Gap Analysis</h1>
      <p style="margin: 0; font-size: 0.8125rem; opacity: 0.5">
        {{ data.summary.totalGaps }} gaps across {{ data.components.length }} items
        -- {{ data.summary.avgGapsPerComponent }} avg per component
      </p>
    </div>

    <!-- Top row: Score histogram + Dimension fill -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem">
      <!-- Score distribution histogram -->
      <section
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <h2 style="margin: 0 0 1rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Score Distribution
        </h2>
        <div style="display: flex; align-items: flex-end; gap: 0.25rem; height: 120px">
          <div
            v-for="bucket in scoreBuckets"
            :key="bucket.min"
            style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%"
          >
            <div style="flex: 1; display: flex; align-items: flex-end; width: 100%">
              <div
                :style="{
                  width: '100%',
                  height: `${bucket.count > 0 ? Math.max(4, (bucket.count / maxBucketCount) * 100) : 0}%`,
                  background: bucket.min >= 90 ? '#4ade80' : bucket.min >= 70 ? '#a3e635' : bucket.min >= 50 ? '#facc15' : bucket.min >= 30 ? '#fb923c' : '#f87171',
                  borderRadius: '0.125rem 0.125rem 0 0',
                  transition: 'height 0.3s ease',
                  position: 'relative',
                }"
              >
                <span
                  v-if="bucket.count > 0"
                  style="
                    position: absolute;
                    top: -1.25rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.625rem;
                    font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    white-space: nowrap;
                  "
                >
                  {{ bucket.count }}
                </span>
              </div>
            </div>
            <span style="font-size: 0.5625rem; opacity: 0.4; margin-top: 0.25rem; font-variant-numeric: tabular-nums">
              {{ bucket.min }}
            </span>
          </div>
        </div>
      </section>

      <!-- Dimension fill rates -->
      <section
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <h2 style="margin: 0 0 1rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Dimension Coverage
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.625rem">
          <div
            v-for="dim in dimensionFill"
            :key="dim.key"
            style="display: grid; grid-template-columns: 100px 1fr 90px; gap: 0.75rem; align-items: center; font-size: 0.8125rem"
          >
            <span style="font-weight: 600">{{ dim.label }}</span>
            <div style="height: 0.5rem; border-radius: 9999px; background: rgba(255,255,255,0.06); overflow: hidden">
              <div
                :style="{
                  height: '100%',
                  width: `${dim.pct}%`,
                  borderRadius: '9999px',
                  background: dim.color,
                  transition: 'width 0.3s ease',
                }"
              />
            </div>
            <span style="text-align: right; font-variant-numeric: tabular-nums; opacity: 0.7; font-size: 0.75rem">
              {{ dim.filled }}/{{ dim.total }} ({{ dim.pct }}%)
            </span>
          </div>
        </div>
      </section>
    </div>

    <!-- Package coverage heatmap -->
    <section
      style="
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
      "
    >
      <h2 style="margin: 0 0 1rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Coverage Heatmap by Package
      </h2>
      <div style="overflow-x: auto">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem">
          <thead>
            <tr>
              <th style="text-align: left; padding: 0.5rem; opacity: 0.5; font-weight: 600; border-bottom: 1px solid var(--rig-border, #2a2520)">Package</th>
              <th style="text-align: center; padding: 0.5rem; opacity: 0.5; font-weight: 600; border-bottom: 1px solid var(--rig-border, #2a2520)">Items</th>
              <th style="text-align: center; padding: 0.5rem; opacity: 0.5; font-weight: 600; border-bottom: 1px solid var(--rig-border, #2a2520)">Score</th>
              <th style="text-align: center; padding: 0.5rem; opacity: 0.5; font-weight: 600; border-bottom: 1px solid var(--rig-border, #2a2520)">Stmts</th>
              <th style="text-align: center; padding: 0.5rem; opacity: 0.5; font-weight: 600; border-bottom: 1px solid var(--rig-border, #2a2520)">Branches</th>
              <th style="text-align: center; padding: 0.5rem; opacity: 0.5; font-weight: 600; border-bottom: 1px solid var(--rig-border, #2a2520)">Functions</th>
              <th style="text-align: center; padding: 0.5rem; opacity: 0.5; font-weight: 600; border-bottom: 1px solid var(--rig-border, #2a2520)">Lines</th>
              <th style="text-align: center; padding: 0.5rem; opacity: 0.5; font-weight: 600; border-bottom: 1px solid var(--rig-border, #2a2520)">Gaps</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pkg in packageHeatmap" :key="pkg.name">
              <td style="padding: 0.5rem; font-weight: 600">{{ pkg.name }}</td>
              <td style="padding: 0.5rem; text-align: center; font-variant-numeric: tabular-nums; opacity: 0.6">{{ pkg.count }}</td>
              <td style="padding: 0.5rem; text-align: center">
                <span
                  :style="{
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: heatColor(pkg.avgScore),
                  }"
                >
                  {{ pkg.avgScore }}
                </span>
              </td>
              <td
                v-for="dim in ['avgStmts', 'avgBranch', 'avgFuncs', 'avgLines']"
                :key="dim"
                :style="{
                  padding: '0.5rem',
                  textAlign: 'center',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 600,
                  color: heatColor(pkg[dim as keyof typeof pkg] as number),
                  background: `${heatColor(pkg[dim as keyof typeof pkg] as number)}11`,
                }"
              >
                {{ pkg[dim as keyof typeof pkg] }}%
              </td>
              <td style="padding: 0.5rem; text-align: center; font-variant-numeric: tabular-nums; opacity: 0.6">
                {{ pkg.gapCount }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- A11y pattern breakdown -->
    <section
      style="
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
      "
    >
      <h2 style="margin: 0 0 1rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Accessibility Pattern Adoption
      </h2>
      <div style="display: flex; flex-direction: column; gap: 0.5rem">
        <div
          v-for="pattern in a11yBreakdown"
          :key="pattern.label"
          style="display: grid; grid-template-columns: 160px 1fr 80px; gap: 0.75rem; align-items: center; font-size: 0.8125rem"
        >
          <span style="font-weight: 600">{{ pattern.label }}</span>
          <div style="height: 0.5rem; border-radius: 9999px; background: rgba(255,255,255,0.06); overflow: hidden; position: relative">
            <div
              :style="{
                height: '100%',
                width: `${(pattern.count / pattern.total) * 100}%`,
                borderRadius: '9999px',
                background: '#a78bfa',
                transition: 'width 0.3s ease',
              }"
            />
          </div>
          <span style="text-align: right; font-variant-numeric: tabular-nums; opacity: 0.6; font-size: 0.75rem">
            {{ pattern.count }}/{{ pattern.total }} ({{ Math.round((pattern.count / pattern.total) * 100) }}%)
          </span>
        </div>
      </div>
    </section>

    <!-- Test duration chart (top 20 slowest) -->
    <section
      style="
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
      "
    >
      <h2 style="margin: 0 0 1rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Slowest Test Suites (top 20)
      </h2>
      <div style="display: flex; flex-direction: column; gap: 0.25rem">
        <div
          v-for="item in testDurationBuckets"
          :key="item.name"
          style="display: grid; grid-template-columns: 160px 1fr 80px 50px; gap: 0.75rem; align-items: center; font-size: 0.75rem; cursor: pointer"
          @click="goTo(item.name)"
        >
          <span style="font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ item.name }}</span>
          <div style="height: 0.375rem; border-radius: 9999px; background: rgba(255,255,255,0.06); overflow: hidden">
            <div
              :style="{
                height: '100%',
                width: `${Math.min(100, (item.duration / (testDurationBuckets[0]?.duration || 1)) * 100)}%`,
                borderRadius: '9999px',
                background: item.duration > 200 ? '#f87171' : item.duration > 100 ? '#facc15' : '#4ade80',
                transition: 'width 0.3s ease',
              }"
            />
          </div>
          <span style="text-align: right; font-variant-numeric: tabular-nums; opacity: 0.7">
            {{ item.duration }}ms
          </span>
          <span style="text-align: right; font-variant-numeric: tabular-nums; opacity: 0.4">
            {{ item.count }}t
          </span>
        </div>
      </div>
    </section>

    <!-- Upgrade targets: components closest to next grade -->
    <section
      style="
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
      "
    >
      <h2 style="margin: 0 0 0.5rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Closest to Next Grade
      </h2>
      <p style="margin: 0 0 1rem; font-size: 0.75rem; opacity: 0.4">
        Components that can reach the next grade with the fewest changes
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.375rem">
        <div
          v-for="comp in upgradeTargets"
          :key="comp.name"
          style="
            display: grid;
            grid-template-columns: 40px 160px 60px 40px 1fr 80px;
            gap: 0.75rem;
            align-items: center;
            padding: 0.5rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            cursor: pointer;
            transition: background 0.15s;
          "
          @click="goTo(comp.name)"
          @mouseenter="($event.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'"
          @mouseleave="($event.currentTarget as HTMLElement).style.background = 'transparent'"
        >
          <span :style="{ fontWeight: 700, color: GRADE_COLORS[comp.grade], fontVariantNumeric: 'tabular-nums' }">
            {{ comp.score }}
          </span>
          <span style="font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ comp.name }}
          </span>
          <span style="opacity: 0.5">{{ comp.package }}</span>
          <span style="text-align: center">
            <span :style="{ color: GRADE_COLORS[comp.grade] }">{{ comp.grade }}</span>
            <span style="opacity: 0.3"> &rarr; </span>
            <span :style="{ color: GRADE_COLORS[comp.nextGrade.target] }">{{ comp.nextGrade.target }}</span>
          </span>
          <!-- Show top gap for this component -->
          <span style="opacity: 0.5; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ comp.gaps[0]?.label ?? 'No gaps' }}
          </span>
          <span style="text-align: right; font-variant-numeric: tabular-nums">
            <span style="opacity: 0.5">need </span>
            <span :style="{ fontWeight: 700, color: comp.nextGrade.pointsNeeded <= 5 ? '#4ade80' : comp.nextGrade.pointsNeeded <= 15 ? '#facc15' : '#f87171' }">
              +{{ comp.nextGrade.pointsNeeded }}
            </span>
          </span>
        </div>
      </div>
    </section>

    <!-- Full gap table -->
    <section>
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem">
        <h2 style="margin: 0; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          All Gaps ({{ allGaps.length }})
        </h2>
        <!-- Dimension filter pills -->
        <div style="display: flex; gap: 0.375rem; flex-wrap: wrap">
          <button
            v-for="dim in dimensions"
            :key="dim"
            :style="{
              padding: '0.25rem 0.625rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: filterDimension === dim ? dimensionColors[dim] : 'var(--rig-border, #2a2520)',
              background: filterDimension === dim ? `${dimensionColors[dim]}18` : 'transparent',
              color: filterDimension === dim ? dimensionColors[dim] : 'inherit',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontWeight: 600,
              transition: 'all 0.15s',
            }"
            @click="filterDimension = filterDimension === dim ? null : dim"
          >
            {{ dimensionLabels[dim] }}
          </button>
        </div>
        <!-- Package filter -->
        <select
          :value="filterPackage ?? ''"
          style="
            margin-left: auto;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            border: 1px solid var(--rig-border, #2a2520);
            background: var(--rig-surface, #1a1815);
            color: inherit;
            font-size: 0.75rem;
          "
          @change="filterPackage = ($event.target as HTMLSelectElement).value || null"
        >
          <option value="">All packages</option>
          <option v-for="pkg in data.summary.packages" :key="pkg.name" :value="pkg.name">
            {{ pkg.name }}
          </option>
        </select>
      </div>

      <div
        style="
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          overflow: hidden;
        "
      >
        <div
          style="
            display: grid;
            grid-template-columns: 160px 60px 60px 1fr 60px;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.6875rem;
            font-weight: 600;
            opacity: 0.5;
            border-bottom: 1px solid var(--rig-border, #2a2520);
          "
        >
          <span>Component</span>
          <span>Package</span>
          <span>Score</span>
          <span>Gap</span>
          <span style="text-align: right">Impact</span>
        </div>
        <div style="max-height: 400px; overflow-y: auto">
          <div
            v-for="(gap, i) in allGaps.slice(0, 100)"
            :key="`${gap.component}-${gap.dimension}-${i}`"
            style="
              display: grid;
              grid-template-columns: 160px 60px 60px 1fr 60px;
              gap: 0.5rem;
              padding: 0.375rem 0.75rem;
              font-size: 0.75rem;
              cursor: pointer;
              border-bottom: 1px solid rgba(255,255,255,0.03);
              transition: background 0.15s;
            "
            @click="goTo(gap.component)"
            @mouseenter="($event.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'"
            @mouseleave="($event.currentTarget as HTMLElement).style.background = 'transparent'"
          >
            <span style="font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
              {{ gap.component }}
            </span>
            <span style="opacity: 0.5">{{ gap.package }}</span>
            <span :style="{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: GRADE_COLORS[gap.grade] }">
              {{ gap.score }}
            </span>
            <span style="display: flex; align-items: center; gap: 0.5rem">
              <span
                :style="{
                  width: '0.375rem',
                  height: '0.375rem',
                  borderRadius: '50%',
                  background: dimensionColors[gap.dimension],
                  flexShrink: 0,
                }"
              />
              {{ gap.label }}
            </span>
            <span
              :style="{
                textAlign: 'right',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: gap.impact >= 15 ? '#4ade80' : gap.impact >= 8 ? '#facc15' : 'inherit',
                opacity: gap.impact < 8 ? 0.6 : 1,
              }"
            >
              +{{ gap.impact }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
