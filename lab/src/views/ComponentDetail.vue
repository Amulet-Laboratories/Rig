<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { HealthManifest, ComponentHealth, CompetitorMatrix, CompetitorRow, ComparisonOutput, ComparisonResult } from '../types'
import { GRADE_COLORS, GRADE_BG } from '../types'
import HealthBadge from '../components/HealthBadge.vue'
import CoverageBar from '../components/CoverageBar.vue'
import TestResults from '../components/TestResults.vue'
import BenchmarkCard from '../components/BenchmarkCard.vue'
import ComponentPreview from '../components/ComponentPreview.vue'
import manifest from '@health/manifest.json'
import competitorData from '../data/competitors.json'

let comparisonData: ComparisonOutput | null = null
try {
  comparisonData = (await import('@health/comparison.json')).default as unknown as ComparisonOutput
} catch {
  comparisonData = null
}

const data = manifest as unknown as HealthManifest
const compData = competitorData as unknown as CompetitorMatrix & {
  notes: Record<string, string>
  vueNative: Record<string, boolean>
}
const route = useRoute()
const router = useRouter()
const showAllTests = ref(false)

// Competitor comparison for this component
const competitorRow = computed<CompetitorRow | null>(() => {
  const name = route.params.name as string
  return compData.matrix.find((r) => r.name === name) ?? null
})

const competitorMatches = computed(() => {
  const row = competitorRow.value
  if (!row) return []
  return compData.competitors.map((name, i) => ({
    name,
    has: row.has[i] === 1,
    isVue: compData.vueNative[name] ?? false,
    note: compData.notes[name] ?? '',
  }))
})

const competitorCount = computed(() => {
  return competitorRow.value?.has.reduce((a, b) => a + b, 0) ?? 0
})

const isUnique = computed(() => competitorCount.value === 0)

// Benchmark comparison for this component
const benchComparison = computed<ComparisonResult | null>(() => {
  if (!comparisonData) return null
  const name = route.params.name as string
  return comparisonData.comparisons.find((c) => c.rigComponent === name) ?? null
})

const benchMaxMount = computed(() => {
  const bc = benchComparison.value
  if (!bc) return 1
  const valid = bc.results.filter((r) => (r.reliable ?? r.domNodeCount > 0) && r.mountMedianMs >= 0)
  return Math.max(...valid.map((r) => r.mountMedianMs), 0.1)
})

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

const component = computed<ComponentHealth | null>(() => {
  const name = route.params.name as string
  return data.components.find((c) => c.name === name) ?? null
})

const scoreBreakdown = computed(() => {
  const c = component.value
  if (!c) return []

  const items = []
  const isComposable = c.type === 'composable'

  if (isComposable) {
    // Composable profile: Tests(40, depth-weighted) + Coverage(40) + Bench(20) = 100
    const depth = c.testDepth ?? 1
    if (c.tests) {
      const basePts = Math.round(20 * Math.max(0.5, depth))
      const passPts = c.tests.passed === c.tests.total ? Math.round(20 * Math.max(0.5, depth)) : 0
      const pts = Math.min(40, basePts + passPts)
      items.push({ label: 'Tests', max: 40, earned: pts, detail: `${c.tests.passed}/${c.tests.total} pass (depth ${depth.toFixed(2)})` })
    } else {
      items.push({ label: 'Tests', max: 40, earned: 0, detail: 'No tests' })
    }

    if (c.coverage) {
      const avg = (c.coverage.statements + c.coverage.branches + c.coverage.functions + c.coverage.lines) / 4
      const pts = Math.round(Math.min(40, (avg / 100) * 40))
      items.push({ label: 'Coverage', max: 40, earned: pts, detail: `${avg.toFixed(1)}% avg` })
    } else {
      items.push({ label: 'Coverage', max: 40, earned: 0, detail: 'No data' })
    }

    items.push({
      label: 'Benchmark',
      max: 20,
      earned: c.benchmark.available ? 20 : 0,
      detail: c.benchmark.available ? `${c.benchmark.results.length} runs` : 'Missing',
    })
  } else {
    // Component profile: Tests(25, depth-weighted) + Coverage(20) + A11y(20, blended) + Interaction(5) + Story(10) + Hex(10) + Bench(10) = 100
    const depth = c.testDepth ?? 1
    if (c.tests) {
      const basePts = Math.round(12 * Math.max(0.5, depth))
      const passPts = c.tests.passed === c.tests.total ? Math.round(13 * Math.max(0.5, depth)) : 0
      const pts = Math.min(25, basePts + passPts)
      items.push({ label: 'Tests', max: 25, earned: pts, detail: `${c.tests.passed}/${c.tests.total} pass (depth ${depth.toFixed(2)})` })
    } else {
      items.push({ label: 'Tests', max: 25, earned: 0, detail: 'No tests' })
    }

    if (c.coverage) {
      const avg = (c.coverage.statements + c.coverage.branches + c.coverage.functions + c.coverage.lines) / 4
      const pts = Math.round(Math.min(20, (avg / 100) * 20))
      items.push({ label: 'Coverage', max: 20, earned: pts, detail: `${avg.toFixed(1)}% avg` })
    } else {
      items.push({ label: 'Coverage', max: 20, earned: 0, detail: 'No data' })
    }

    // A11y: source scan (10pts) + axe runtime (10pts)
    if (c.a11y) {
      let srcPts = 0
      if (c.a11y.hasAriaAttributes) srcPts += 4
      if (c.a11y.hasKeyboardNav) srcPts += 3
      if (c.a11y.hasFocusManagement) srcPts += 3
      let axePts = 0
      if (c.axeRuntime) {
        axePts = Math.round(Math.min(10, (c.axeRuntime.score / 100) * 10))
      }
      const totalA11y = Math.min(20, srcPts + axePts)
      const detail = c.axeRuntime
        ? `source: ${srcPts}/10, axe: ${axePts}/10`
        : `source: ${srcPts}/10, no axe data`
      items.push({ label: 'Accessibility', max: 20, earned: totalA11y, detail })
    } else {
      items.push({ label: 'Accessibility', max: 20, earned: 0, detail: 'Not scanned' })
    }

    // Interaction tests (5pts)
    if (c.interactionTests) {
      let pts = 0
      if (c.interactionTests.hasKeyboardTests) pts += 2
      if (c.interactionTests.hasFocusTests) pts += 1
      if (c.interactionTests.hasEmitTests) pts += 1
      if (c.interactionTests.hasReactivityTests) pts += 1
      items.push({ label: 'Interaction', max: 5, earned: pts, detail: `${c.interactionTests.interactionPatterns} patterns` })
    } else {
      items.push({ label: 'Interaction', max: 5, earned: 0, detail: 'No interaction tests' })
    }

    items.push({
      label: 'Story',
      max: 10,
      earned: c.story.exists ? 10 : 0,
      detail: c.story.exists ? `${c.story.variants} variants` : 'Missing',
    })

    items.push({
      label: 'Hex CSS',
      max: 10,
      earned: c.hexCoverage.hasStyles ? 10 : 0,
      detail: c.hexCoverage.hasStyles ? `${c.hexCoverage.selectors.length} selectors` : 'No styles',
    })

    items.push({
      label: 'Benchmark',
      max: 10,
      earned: c.benchmark.available ? 10 : 0,
      detail: c.benchmark.available ? `${c.benchmark.results.length} runs` : 'Missing',
    })
  }

  return items
})
</script>

<template>
  <div v-if="!component" style="text-align: center; padding: 3rem; opacity: 0.5">
    Component not found.
    <button
      style="
        display: block;
        margin: 1rem auto 0;
        padding: 0.5rem 1rem;
        border: 1px solid var(--rig-border, #2a2520);
        border-radius: 0.375rem;
        background: transparent;
        color: var(--rig-accent, #c9956d);
        cursor: pointer;
      "
      @click="router.push('/')"
    >
      Back to grid
    </button>
  </div>

  <div v-else style="display: flex; flex-direction: column; gap: 2rem; max-width: 56rem">
    <!-- Header -->
    <div style="display: flex; align-items: center; gap: 1rem">
      <button
        style="
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          border-radius: 0.25rem;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-size: 0.8125rem;
          opacity: 0.6;
        "
        @click="router.push('/')"
      >
        &larr;
      </button>
      <HealthBadge :grade="component.grade" :score="component.score" size="lg" />
      <div>
        <h1 style="margin: 0; font-size: 1.5rem; font-weight: 700">{{ component.name }}</h1>
        <div style="display: flex; gap: 0.5rem; font-size: 0.8125rem; opacity: 0.5; margin-top: 0.125rem">
          <span>{{ component.package }}</span>
          <span>{{ component.type }}</span>
          <span>{{ component.source }}</span>
        </div>
      </div>
      <div
        style="
          margin-left: auto;
          text-align: right;
          font-variant-numeric: tabular-nums;
        "
      >
        <div :style="{ fontSize: '2rem', fontWeight: 700, color: GRADE_COLORS[component.grade] }">
          {{ component.score }}
        </div>
        <div style="font-size: 0.6875rem; opacity: 0.4">/ 100</div>
      </div>
    </div>

    <!-- Live Preview -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Live Preview
      </h2>
      <ComponentPreview :name="component.name" :package="component.package" :type="component.type" />
    </section>

    <!-- Competitor Comparison -->
    <section v-if="competitorRow">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem">
        <h2 style="margin: 0; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Competitive Landscape
        </h2>
        <span
          v-if="isUnique"
          style="
            font-size: 0.6875rem;
            font-weight: 700;
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            background: rgba(201, 149, 109, 0.15);
            color: #c9956d;
          "
        >
          Unique to Rig
        </span>
        <span v-else style="font-size: 0.75rem; opacity: 0.5">
          {{ competitorCount }}/{{ compData.competitors.length }} competitors offer this
        </span>
      </div>
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.5rem;
        "
      >
        <div
          v-for="comp in competitorMatches"
          :key="comp.name"
          :style="{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid',
            borderColor: comp.has ? 'rgba(74, 222, 128, 0.2)' : 'var(--rig-border, #2a2520)',
            background: comp.has ? 'rgba(74, 222, 128, 0.04)' : 'var(--rig-surface, #1a1815)',
          }"
          :title="comp.note"
        >
          <div style="display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.25rem">
            <span style="font-size: 0.75rem; font-weight: 600">{{ comp.name }}</span>
            <span
              :style="{
                fontSize: '0.5rem',
                padding: '0.0625rem 0.25rem',
                borderRadius: '9999px',
                background: comp.isVue ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                color: comp.isVue ? '#4ade80' : '#f87171',
                fontWeight: 700,
              }"
            >
              {{ comp.isVue ? 'VUE' : 'N/A' }}
            </span>
          </div>
          <div
            :style="{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: comp.has ? '#4ade80' : 'rgba(255,255,255,0.25)',
            }"
          >
            {{ comp.has ? '\u2713 Has equivalent' : '\u2717 No equivalent' }}
          </div>
        </div>
      </div>
    </section>

    <!-- Benchmark Comparison -->
    <section v-if="benchComparison">
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Benchmark Comparison
      </h2>
      <div
        style="
          background: var(--rig-surface, #1a1815);
          border: 1px solid var(--rig-border, #2a2520);
          border-radius: 0.5rem;
          overflow: hidden;
        "
      >
        <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem">
          <thead>
            <tr style="border-bottom: 1px solid var(--rig-border, #2a2520)">
              <th style="text-align: left; padding: 0.5rem 0.75rem; opacity: 0.5; font-weight: 500; width: 130px">Library</th>
              <th style="text-align: left; padding: 0.5rem 0.75rem; opacity: 0.5; font-weight: 500">Mount (ms)</th>
              <th style="text-align: right; padding: 0.5rem 0.75rem; opacity: 0.5; font-weight: 500; width: 70px">Median</th>
              <th style="text-align: right; padding: 0.5rem 0.75rem; opacity: 0.5; font-weight: 500; width: 60px">P95</th>
              <th style="text-align: right; padding: 0.5rem 0.75rem; opacity: 0.5; font-weight: 500; width: 60px">DOM</th>
              <th style="text-align: right; padding: 0.5rem 0.75rem; opacity: 0.5; font-weight: 500; width: 50px">A11y</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in benchComparison.results"
              :key="r.lib"
              :style="{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: r.lib === 'rig' ? 'rgba(201, 149, 109, 0.06)' : 'transparent',
              }"
            >
              <td style="padding: 0.5rem 0.75rem">
                <div style="display: flex; align-items: center; gap: 0.375rem">
                  <span :style="{ width: '6px', height: '6px', borderRadius: '2px', background: LIB_COLORS[r.lib] ?? '#94a3b8', flexShrink: 0 }" />
                  <span :style="{ fontWeight: r.lib === 'rig' ? 600 : 400, color: r.lib === 'rig' ? '#c9956d' : 'inherit' }">
                    {{ r.libName }}
                  </span>
                  <span
                    v-if="!r.error && !(r.reliable ?? r.domNodeCount > 0)"
                    style="font-size: 0.5625rem; padding: 0.0625rem 0.25rem; border-radius: 9999px; background: rgba(250, 204, 21, 0.12); color: #facc15; font-weight: 700"
                    title="Unreliable result (0 DOM nodes)"
                  >?</span>
                </div>
              </td>
              <td style="padding: 0.5rem 0.75rem">
                <div v-if="!r.error" style="display: flex; align-items: center; gap: 0.5rem">
                  <div style="flex: 1; height: 0.5rem; background: rgba(255,255,255,0.04); border-radius: 9999px; overflow: hidden">
                    <div
                      :style="{
                        height: '100%',
                        width: (r.mountMedianMs / benchMaxMount) * 100 + '%',
                        background: LIB_COLORS[r.lib] ?? '#94a3b8',
                        opacity: r.lib === 'rig' ? 1 : 0.6,
                        borderRadius: '9999px',
                        minWidth: '2px',
                      }"
                    />
                  </div>
                </div>
                <span v-else style="font-size: 0.6875rem; color: #fb923c" :title="r.error">mount error</span>
              </td>
              <td style="padding: 0.5rem 0.75rem; text-align: right; font-family: monospace; font-size: 0.75rem">
                <span v-if="!r.error">{{ r.mountMedianMs.toFixed(3) }}</span>
                <span v-else style="color: #fb923c">—</span>
              </td>
              <td style="padding: 0.5rem 0.75rem; text-align: right; font-family: monospace; font-size: 0.75rem; opacity: 0.5">
                <span v-if="!r.error">{{ r.mountP95Ms.toFixed(3) }}</span>
                <span v-else>—</span>
              </td>
              <td style="padding: 0.5rem 0.75rem; text-align: right; font-family: monospace; font-size: 0.75rem; opacity: 0.5">
                {{ r.domNodeCount }}
              </td>
              <td style="padding: 0.5rem 0.75rem; text-align: right; font-family: monospace; font-size: 0.75rem">
                <span
                  v-if="r.a11yScore >= 0"
                  :style="{ color: r.a11yScore >= 90 ? '#4ade80' : r.a11yScore >= 70 ? '#facc15' : '#f87171' }"
                >
                  {{ r.a11yScore }}
                </span>
                <span v-else style="opacity: 0.3">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Score breakdown -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Score Breakdown
      </h2>
      <div style="display: flex; flex-direction: column; gap: 0.5rem">
        <div
          v-for="item in scoreBreakdown"
          :key="item.label"
          style="
            display: grid;
            grid-template-columns: 120px 1fr 60px 120px;
            gap: 0.75rem;
            align-items: center;
            font-size: 0.8125rem;
          "
        >
          <span style="font-weight: 600">{{ item.label }}</span>
          <div
            style="
              height: 0.375rem;
              border-radius: 9999px;
              background: rgba(255, 255, 255, 0.06);
              overflow: hidden;
            "
          >
            <div
              :style="{
                height: '100%',
                width: `${(item.earned / item.max) * 100}%`,
                borderRadius: '9999px',
                background: item.earned === item.max ? '#4ade80' : item.earned > 0 ? '#facc15' : '#f87171',
                transition: 'width 0.3s ease',
              }"
            />
          </div>
          <span style="text-align: right; font-variant-numeric: tabular-nums; font-weight: 600">
            {{ item.earned }}/{{ item.max }}
          </span>
          <span style="opacity: 0.5">{{ item.detail }}</span>
        </div>
      </div>
    </section>

    <!-- Source Metrics -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Source Metrics
      </h2>
      <div
        style="
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.75rem;
        "
      >
        <div
          v-for="metric in [
            { label: 'Lines', value: component.sourceMetrics.loc },
            { label: 'Size', value: component.sourceMetrics.fileSize >= 1024 ? `${(component.sourceMetrics.fileSize / 1024).toFixed(1)}K` : `${component.sourceMetrics.fileSize}B` },
            { label: 'Props', value: component.sourceMetrics.propCount },
            { label: component.type === 'composable' ? 'Exports' : 'Emits', value: component.sourceMetrics.emitCount },
            { label: 'Deps', value: component.sourceMetrics.depCount },
          ]"
          :key="metric.label"
          style="
            padding: 0.75rem;
            border-radius: 0.375rem;
            border: 1px solid var(--rig-border, #2a2520);
            background: var(--rig-surface, #1a1815);
            text-align: center;
          "
        >
          <div style="font-size: 1.25rem; font-weight: 700; font-variant-numeric: tabular-nums">
            {{ metric.value }}
          </div>
          <div style="font-size: 0.6875rem; opacity: 0.4; margin-top: 0.125rem">{{ metric.label }}</div>
        </div>
      </div>
    </section>

    <!-- Gap Analysis -->
    <section v-if="component.gaps.length > 0">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem">
        <h2 style="margin: 0; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Gaps to Close
        </h2>
        <span
          v-if="component.grade !== 'A'"
          :style="{
            fontSize: '0.6875rem',
            fontWeight: 600,
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            background: GRADE_BG[component.nextGrade.target],
            color: GRADE_COLORS[component.nextGrade.target],
          }"
        >
          {{ component.nextGrade.pointsNeeded }} pts to {{ component.nextGrade.target }}
        </span>
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <div
          v-for="gap in component.gaps"
          :key="gap.label"
          style="
            display: grid;
            grid-template-columns: 100px 1fr 50px;
            gap: 0.75rem;
            align-items: center;
            padding: 0.375rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.8125rem;
            background: rgba(255, 255, 255, 0.02);
          "
        >
          <span
            :style="{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: ({
                tests: '#4ade80',
                coverage: '#38bdf8',
                a11y: '#a78bfa',
                'a11y-runtime': '#a78bfa',
                interaction: '#e879f9',
                story: '#fb923c',
                hex: '#c9956d',
                bench: '#facc15',
              } as Record<string, string>)[gap.dimension] ?? 'inherit',
            }"
          >
            {{ gap.dimension }}
          </span>
          <span style="opacity: 0.8">{{ gap.label }}</span>
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
    </section>

    <!-- Coverage -->
    <section v-if="component.coverage">
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Coverage
      </h2>
      <div
        style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <CoverageBar label="Statements" :value="component.coverage.statements" />
        <CoverageBar label="Branches" :value="component.coverage.branches" />
        <CoverageBar label="Functions" :value="component.coverage.functions" />
        <CoverageBar label="Lines" :value="component.coverage.lines" />
      </div>
    </section>

    <!-- Tests -->
    <section v-if="component.tests">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem">
        <h2 style="margin: 0; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
          Tests
        </h2>
        <button
          style="
            padding: 0.125rem 0.5rem;
            border: 1px solid var(--rig-border, #2a2520);
            border-radius: 0.25rem;
            background: transparent;
            color: inherit;
            cursor: pointer;
            font-size: 0.6875rem;
            opacity: 0.5;
          "
          @click="showAllTests = !showAllTests"
        >
          {{ showAllTests ? 'Collapse' : 'Expand all' }}
        </button>
      </div>
      <div
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <TestResults :tests="component.tests" :expanded="showAllTests" />
      </div>
    </section>

    <!-- Accessibility -->
    <section v-if="component.a11y">
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Accessibility
      </h2>
      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <div
          v-for="check in [
            { label: 'ARIA attributes', ok: component.a11y.hasAriaAttributes },
            { label: 'Keyboard navigation', ok: component.a11y.hasKeyboardNav },
            { label: 'Focus management', ok: component.a11y.hasFocusManagement },
            { label: 'Reduced motion', ok: component.a11y.hasReducedMotion },
          ]"
          :key="check.label"
          :style="{
            padding: '0.375rem 0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: check.ok ? 'rgba(74, 222, 128, 0.08)' : 'rgba(248, 113, 113, 0.08)',
            color: check.ok ? '#4ade80' : '#f87171',
            border: `1px solid ${check.ok ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`,
          }"
        >
          {{ check.ok ? '\u2713' : '\u2717' }} {{ check.label }}
        </div>
      </div>
      <!-- Axe runtime score -->
      <div
        v-if="component.axeRuntime"
        style="
          margin-top: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.8125rem;
        "
      >
        <span style="opacity: 0.6">Axe Runtime Score</span>
        <span
          :style="{
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: component.axeRuntime.score >= 90 ? '#4ade80' : component.axeRuntime.score >= 70 ? '#facc15' : '#f87171',
          }"
        >
          {{ component.axeRuntime.score }}
        </span>
        <span style="opacity: 0.4; font-size: 0.6875rem">
          {{ component.axeRuntime.passes }} passes &middot; {{ component.axeRuntime.violations }} violations
        </span>
      </div>
    </section>

    <!-- Interaction Test Quality -->
    <section v-if="component.interactionTests && component.type !== 'composable'">
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Interaction Tests
      </h2>
      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <div
          v-for="check in [
            { label: 'Keyboard tests', ok: component.interactionTests.hasKeyboardTests },
            { label: 'Focus tests', ok: component.interactionTests.hasFocusTests },
            { label: 'Emit tests', ok: component.interactionTests.hasEmitTests },
            { label: 'Slot tests', ok: component.interactionTests.hasSlotTests },
            { label: 'Reactivity tests', ok: component.interactionTests.hasReactivityTests },
          ]"
          :key="check.label"
          :style="{
            padding: '0.375rem 0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: check.ok ? 'rgba(232, 121, 249, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            color: check.ok ? '#e879f9' : 'rgba(255,255,255,0.25)',
            border: `1px solid ${check.ok ? 'rgba(232, 121, 249, 0.2)' : 'rgba(255,255,255,0.06)'}`,
          }"
        >
          {{ check.ok ? '\u2713' : '\u2717' }} {{ check.label }}
        </div>
      </div>
      <div
        v-if="component.testDepth !== undefined"
        style="
          margin-top: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.8125rem;
        "
      >
        <span style="opacity: 0.6">Test Depth</span>
        <div style="flex: 1; height: 0.375rem; border-radius: 9999px; background: rgba(255,255,255,0.06); overflow: hidden; max-width: 200px">
          <div
            :style="{
              height: '100%',
              width: Math.min(100, component.testDepth * 100) + '%',
              borderRadius: '9999px',
              background: component.testDepth >= 0.8 ? '#4ade80' : component.testDepth >= 0.5 ? '#facc15' : '#f87171',
            }"
          />
        </div>
        <span
          :style="{
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: component.testDepth >= 0.8 ? '#4ade80' : component.testDepth >= 0.5 ? '#facc15' : '#f87171',
          }"
        >
          {{ (component.testDepth * 100).toFixed(0) }}%
        </span>
      </div>
    </section>

    <!-- Benchmarks -->
    <section v-if="component.benchmark.available">
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Benchmarks
      </h2>
      <div
        style="
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
        "
      >
        <BenchmarkCard :results="component.benchmark.results" />
      </div>
    </section>

    <!-- Story link -->
    <section v-if="component.story.exists">
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Story
      </h2>
      <div
        style="
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          font-size: 0.8125rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        "
      >
        <span style="opacity: 0.6">{{ component.story.path }}</span>
        <span style="opacity: 0.4">{{ component.story.variants }} variants</span>
      </div>
    </section>

    <!-- Hex CSS -->
    <section v-if="component.hexCoverage.hasStyles">
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Hex CSS Selectors
      </h2>
      <div
        style="
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          font-size: 0.75rem;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        "
      >
        <code
          v-for="sel in component.hexCoverage.selectors"
          :key="sel"
          style="
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            background: rgba(201, 149, 109, 0.1);
            color: var(--rig-accent, #c9956d);
          "
        >
          {{ sel }}
        </code>
      </div>
    </section>
  </div>
</template>
