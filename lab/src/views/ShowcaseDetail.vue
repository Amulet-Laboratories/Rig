<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { HealthManifest, ShowcaseHealth, ComponentHealth } from '../types'
import { GRADE_COLORS } from '../types'
import CoverageBar from '../components/CoverageBar.vue'
import HealthBadge from '../components/HealthBadge.vue'
import manifest from '@health/manifest.json'

const data = manifest as unknown as HealthManifest
const route = useRoute()
const router = useRouter()

const showcase = computed<ShowcaseHealth | null>(() => {
  const id = route.params.id as string
  return (
    data.showcases.find((s) => s.id === id) ??
    data.diagnostics.find((s) => s.id === id) ??
    null
  )
})

const isDiagnostic = computed(() => {
  if (!showcase.value) return false
  return data.diagnostics.some((d) => d.id === showcase.value!.id)
})

// Build lookup for component detail data
const componentMap = computed(() => {
  const map = new Map<string, ComponentHealth>()
  for (const c of data.components) {
    map.set(c.name, c)
  }
  return map
})

// Enriched component list: components used by this showcase with their health data
const usedComponents = computed(() => {
  if (!showcase.value) return []
  return showcase.value.componentsUsed
    .map((name) => {
      const comp = componentMap.value.get(name)
      return comp ? { name, comp } : { name, comp: null }
    })
    .sort((a, b) => {
      // Sort by score descending, missing last
      if (!a.comp && !b.comp) return a.name.localeCompare(b.name)
      if (!a.comp) return 1
      if (!b.comp) return -1
      return b.comp.score - a.comp.score
    })
})

// Aggregate coverage from used components
const aggregateCoverage = computed(() => {
  const comps = usedComponents.value
    .map((u) => u.comp)
    .filter((c): c is ComponentHealth => c !== null && c.coverage !== null)

  if (comps.length === 0) return null

  const avg = (key: 'statements' | 'branches' | 'functions' | 'lines') =>
    Math.round(comps.reduce((s, c) => s + (c.coverage?.[key] ?? 0), 0) / comps.length * 10) / 10

  return {
    statements: avg('statements'),
    branches: avg('branches'),
    functions: avg('functions'),
    lines: avg('lines'),
  }
})

// Components grouped by package
const componentsByPackage = computed(() => {
  const groups: Record<string, typeof usedComponents.value> = {}
  for (const entry of usedComponents.value) {
    const pkg = entry.comp?.package ?? 'unknown'
    if (!groups[pkg]) groups[pkg] = []
    groups[pkg].push(entry)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

// Measurement items for the bar chart
const measurements = computed(() => {
  if (!showcase.value) return []
  const s = showcase.value
  return [
    { label: 'Avg Component Health', value: s.avgComponentScore, max: 100, suffix: '' },
    { label: 'Coverage Reach', value: s.coverageReach, max: 50, suffix: '%', note: `${s.componentCount}/${data.components.length} components` },
    { label: 'Tested Ratio', value: s.testedRatio, max: 100, suffix: '%', note: 'of used components have tests' },
    { label: 'Avg Coverage', value: s.avgCoverage, max: 100, suffix: '%', note: 'avg statement coverage' },
    { label: 'Package Breadth', value: s.packageBreadth, max: 100, suffix: '%', note: `${s.packageCount}/8 packages` },
  ]
})

function scoreColor(score: number): string {
  if (score >= 85) return '#4ade80'
  if (score >= 70) return '#a3e635'
  if (score >= 55) return '#facc15'
  if (score >= 40) return '#fb923c'
  return '#f87171'
}

function barWidth(value: number, max: number): string {
  return `${Math.min(100, (value / max) * 100)}%`
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
  <div v-if="!showcase" style="text-align: center; padding: 3rem; opacity: 0.5">
    Showcase not found.
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
      @click="router.push('/showcases')"
    >
      Back to showcases
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
        @click="router.push('/showcases')"
      >
        &larr;
      </button>
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <h1 style="margin: 0; font-size: 1.5rem; font-weight: 700">{{ showcase.name }}</h1>
          <span
            v-if="isDiagnostic"
            style="
              font-size: 0.5625rem;
              padding: 0.125rem 0.5rem;
              border-radius: 9999px;
              background: rgba(251, 146, 60, 0.1);
              color: #fb923c;
              border: 1px solid rgba(251, 146, 60, 0.2);
              text-transform: uppercase;
              letter-spacing: 0.06em;
              font-weight: 700;
            "
          >
            diagnostic
          </span>
        </div>
        <div style="font-size: 0.75rem; opacity: 0.4; margin-top: 0.25rem; font-family: monospace">
          {{ showcase.source }}
        </div>
      </div>

      <div style="margin-left: auto; text-align: right; font-variant-numeric: tabular-nums">
        <div :style="{ fontSize: '2rem', fontWeight: 700, color: scoreColor(showcase.avgComponentScore) }">
          {{ showcase.avgComponentScore }}
        </div>
        <div style="font-size: 0.6875rem; opacity: 0.4">avg health</div>
      </div>
    </div>

    <!-- Summary cards -->
    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 0.75rem;
      "
    >
      <div
        v-for="stat in [
          { label: 'Components', value: showcase.componentCount, color: '#60a5fa' },
          { label: 'Packages', value: `${showcase.packageCount}/8`, color: '#a78bfa' },
          { label: 'LOC', value: showcase.loc, color: '' },
          { label: 'Reach', value: `${showcase.coverageReach}%`, color: '#facc15' },
          { label: 'Tested', value: `${showcase.testedRatio}%`, color: '#4ade80' },
          { label: 'E2E', value: showcase.hasE2e ? 'Yes' : 'No', color: showcase.hasE2e ? '#4ade80' : '#f87171' },
        ]"
        :key="stat.label"
        style="
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: var(--rig-surface, #1a1815);
          border: 1px solid var(--rig-border, #2a2520);
        "
      >
        <div style="font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.4">
          {{ stat.label }}
        </div>
        <div
          :style="{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginTop: '0.125rem',
            fontVariantNumeric: 'tabular-nums',
            color: stat.color || 'inherit',
          }"
        >
          {{ stat.value }}
        </div>
      </div>
    </div>

    <!-- Measurements -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Measurements
      </h2>
      <div style="display: flex; flex-direction: column; gap: 0.625rem">
        <div
          v-for="m in measurements"
          :key="m.label"
          style="
            display: grid;
            grid-template-columns: 160px 1fr 60px;
            gap: 0.75rem;
            align-items: center;
            font-size: 0.8125rem;
          "
        >
          <span style="font-weight: 600">{{ m.label }}</span>
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
                width: barWidth(m.value, m.max),
                borderRadius: '9999px',
                background: scoreColor(m.value),
                transition: 'width 0.3s ease',
              }"
            />
          </div>
          <span style="text-align: right; font-variant-numeric: tabular-nums; font-weight: 600">
            {{ m.value }}{{ m.suffix }}
          </span>
        </div>
      </div>
    </section>

    <!-- Aggregate coverage of used components -->
    <section v-if="aggregateCoverage">
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Aggregate Coverage
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
        <CoverageBar label="Statements" :value="aggregateCoverage.statements" />
        <CoverageBar label="Branches" :value="aggregateCoverage.branches" />
        <CoverageBar label="Functions" :value="aggregateCoverage.functions" />
        <CoverageBar label="Lines" :value="aggregateCoverage.lines" />
      </div>
      <div style="font-size: 0.6875rem; opacity: 0.35; margin-top: 0.375rem">
        Averaged across {{ usedComponents.filter(u => u.comp?.coverage).length }} components with coverage data
      </div>
    </section>

    <!-- Packages used -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Packages Used
      </h2>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
        <span
          v-for="pkg in showcase.packagesUsed"
          :key="pkg"
          :style="{
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            background: `${pkgColor(pkg)}18`,
            color: pkgColor(pkg),
            border: `1px solid ${pkgColor(pkg)}30`,
            fontWeight: 600,
          }"
        >
          {{ pkg }}
        </span>
      </div>
    </section>

    <!-- Components by package -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Components ({{ showcase.componentCount }})
      </h2>
      <div
        style="
          border: 1px solid var(--rig-border, #2a2520);
          border-radius: 0.5rem;
          overflow: hidden;
        "
      >
        <div v-for="([pkg, comps], gi) in componentsByPackage" :key="pkg">
          <!-- Package group header -->
          <div
            :style="{
              padding: '0.375rem 0.75rem',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: pkgColor(pkg),
              background: `${pkgColor(pkg)}08`,
              borderTop: gi > 0 ? '1px solid var(--rig-border, #2a2520)' : 'none',
              borderBottom: '1px solid var(--rig-border, #2a2520)',
            }"
          >
            {{ pkg }} ({{ comps.length }})
          </div>

          <!-- Component rows -->
          <div
            v-for="(entry, ci) in comps"
            :key="entry.name"
            :style="{
              display: 'grid',
              gridTemplateColumns: '1fr 70px 70px 70px 70px 50px',
              gap: '0',
              alignItems: 'center',
              borderBottom: ci < comps.length - 1 ? '1px solid var(--rig-border, #2a2520)' : 'none',
              cursor: entry.comp ? 'pointer' : 'default',
              background: ci % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
            }"
            @click="entry.comp && router.push({ name: 'detail', params: { name: entry.name } })"
          >
            <!-- Name -->
            <div style="padding: 0.5rem 0.75rem; display: flex; align-items: center; gap: 0.5rem">
              <span
                v-if="entry.comp"
                :style="{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '0.125rem',
                  background: GRADE_COLORS[entry.comp.grade],
                  flexShrink: 0,
                }"
              />
              <span style="font-size: 0.8125rem; font-weight: 500">{{ entry.name }}</span>
              <span
                v-if="entry.comp?.type === 'composable'"
                style="font-size: 0.5625rem; opacity: 0.3; font-style: italic"
              >fn</span>
            </div>

            <!-- Score -->
            <div style="padding: 0.5rem 0.5rem; text-align: right">
              <span
                v-if="entry.comp"
                :style="{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: GRADE_COLORS[entry.comp.grade],
                }"
              >
                {{ entry.comp.score }}
              </span>
              <span v-else style="opacity: 0.2">&mdash;</span>
            </div>

            <!-- Grade -->
            <div style="padding: 0.5rem 0.5rem; text-align: right">
              <HealthBadge v-if="entry.comp" :grade="entry.comp.grade" :score="entry.comp.score" size="sm" />
            </div>

            <!-- Tests -->
            <div style="padding: 0.5rem 0.5rem; text-align: right; font-size: 0.75rem; font-variant-numeric: tabular-nums">
              <span v-if="entry.comp?.tests" :style="{ color: entry.comp.tests.failed > 0 ? '#f87171' : '#4ade80' }">
                {{ entry.comp.tests.passed }}/{{ entry.comp.tests.total }}
              </span>
              <span v-else style="opacity: 0.2">&mdash;</span>
            </div>

            <!-- Coverage -->
            <div style="padding: 0.5rem 0.5rem; text-align: right; font-size: 0.75rem; font-variant-numeric: tabular-nums">
              <span v-if="entry.comp?.coverage" :style="{ color: scoreColor(entry.comp.coverage.statements) }">
                {{ entry.comp.coverage.statements }}%
              </span>
              <span v-else style="opacity: 0.2">&mdash;</span>
            </div>

            <!-- Arrow -->
            <div style="padding: 0.5rem; text-align: right; opacity: 0.2; font-size: 0.75rem">
              <span v-if="entry.comp">&rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
