<script setup lang="ts">
/**
 * Ecosystem Health Dashboard — A visual overview of Hex + Rig health metrics.
 *
 * Displays test counts, coverage percentages, benchmark inventory,
 * E2E results, and Hex build stats from the health-data fixture.
 *
 * Regenerate data: node demo/scripts/generate-health-data.mjs
 */
import { computed } from 'vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Progress from '@core/primitives/Progress.vue'
import { healthData } from './fixtures/health-data'

// ── Derived stats ────────────────────────────────────────────────────

const data = healthData

const totalE2E = computed(() => data.rig.e2e.reduce((s, c) => s + c.tests, 0))

const hexTotalSizeKB = computed(() =>
  Math.round(data.hex.themes.reduce((s, t) => s + t.sizeKB, 0) * 10) / 10,
)

const coverageKeys = ['statements', 'branches', 'functions', 'lines'] as const

type CoverageKey = (typeof coverageKeys)[number]

function coverageColor(actual: number, threshold: number): string {
  if (actual >= threshold) return 'var(--color-success, #4caf50)'
  if (actual >= threshold * 0.85) return 'var(--color-warning, #f5a623)'
  return 'var(--color-destructive, #e74c3c)'
}

function coverageStatus(actual: number, threshold: number): string {
  if (actual >= threshold) return 'passing'
  if (actual >= threshold * 0.85) return 'close'
  return 'below'
}

const generatedDate = computed(() => {
  const d = new Date(data.generated)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})
</script>

<template>
  <Story title="Ecosystem Health" icon="codicon:pulse" group="showcase">
    <div class="health-dashboard">
      <!-- Header -->
      <header class="health-header">
        <h2 class="health-title">Ecosystem Health</h2>
        <p class="health-subtitle">
          At-a-glance health overview &middot; Last updated {{ generatedDate }}
          &middot; See <em>Performance</em> for detailed tables.
        </p>
      </header>

      <!-- ── Summary Cards ────────────────────────────────────── -->
      <section class="health-section">
        <div class="health-summary-grid">
          <Card class="health-summary-card">
            <span class="health-summary-value">{{ data.rig.totalTests }}</span>
            <span class="health-summary-label">Unit Tests</span>
            <span class="health-summary-detail">{{ data.rig.totalFiles }} files</span>
          </Card>
          <Card class="health-summary-card">
            <span class="health-summary-value">{{ totalE2E }}</span>
            <span class="health-summary-label">E2E Tests</span>
            <span class="health-summary-detail">{{ data.rig.e2e.length }} spec files</span>
          </Card>
          <Card class="health-summary-card">
            <span class="health-summary-value">{{ data.rig.totalComponents }}</span>
            <span class="health-summary-label">Components</span>
            <span class="health-summary-detail">{{ data.rig.packages.length }} packages</span>
          </Card>
          <Card class="health-summary-card">
            <span class="health-summary-value">{{ data.rig.benchmarks.length }}</span>
            <span class="health-summary-label">Benchmarks</span>
            <span class="health-summary-detail">Vitest bench</span>
          </Card>
          <Card class="health-summary-card">
            <span class="health-summary-value">{{ data.hex.themes.length }}</span>
            <span class="health-summary-label">Hex Themes</span>
            <span class="health-summary-detail">{{ hexTotalSizeKB }} KB total</span>
          </Card>
          <Card class="health-summary-card">
            <span class="health-summary-value">{{ data.hex.buildTests }}</span>
            <span class="health-summary-label">Build Tests</span>
            <span class="health-summary-detail">PostCSS pipeline</span>
          </Card>
        </div>
      </section>

      <!-- ── Overall Coverage ─────────────────────────────────── -->
      <section class="health-section">
        <h3 class="health-section-title">Overall Coverage</h3>
        <div class="health-coverage-grid">
          <div
            v-for="key in coverageKeys"
            :key="key"
            class="health-coverage-item"
          >
            <div class="health-coverage-header">
              <span class="health-coverage-key">{{ key }}</span>
              <span class="health-coverage-pct">
                {{ data.rig.overallCoverage[key as CoverageKey] }}%
              </span>
              <Badge
                :style="{
                  '--badge-bg': coverageColor(
                    data.rig.overallCoverage[key as CoverageKey],
                    data.rig.coverageThresholds[key as CoverageKey],
                  ),
                  color: 'var(--color-primary-foreground, #fff)',
                }"
              >
                {{ coverageStatus(
                  data.rig.overallCoverage[key as CoverageKey],
                  data.rig.coverageThresholds[key as CoverageKey],
                ) }}
              </Badge>
            </div>
            <Progress
              :value="data.rig.overallCoverage[key as CoverageKey]"
              :max="100"
              :aria-label="`${key} coverage`"
            />
            <span class="health-coverage-threshold">
              Threshold: {{ data.rig.coverageThresholds[key as CoverageKey] }}%
            </span>
          </div>
        </div>
      </section>

      <!-- ── Benchmark Inventory ──────────────────────────────── -->
      <section class="health-section">
        <h3 class="health-section-title">Benchmark Inventory</h3>
        <div class="health-bench-grid">
          <Card
            v-for="bench in data.rig.benchmarks"
            :key="bench.name"
            class="health-bench-card"
          >
            <span class="health-bench-name">{{ bench.name }}</span>
            <Badge>{{ bench.package }}</Badge>
          </Card>
        </div>
      </section>
    </div>
  </Story>
</template>

<style scoped>
.health-dashboard {
  padding: 16px;
  max-width: 860px;
}

/* ── Header ───────────────────────────────────────────────────────── */

.health-header {
  margin-bottom: 24px;
}

.health-title {
  font-family: var(--font-mono, monospace);
  font-size: 20px;
  color: var(--color-foreground, #d4d4d4);
  margin: 0 0 4px;
}

.health-subtitle {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  margin: 0;
}

/* ── Sections ─────────────────────────────────────────────────────── */

.health-section {
  margin-bottom: 28px;
}

.health-section-title {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary, #c9956d);
  margin: 0 0 12px;
}

/* ── Summary Cards ────────────────────────────────────────────────── */

.health-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
}

.health-summary-card {
  text-align: center;
  padding: 12px 8px;
}

.health-summary-value {
  display: block;
  font-family: var(--font-mono, monospace);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary, #c9956d);
}

.health-summary-label {
  display: block;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-foreground, #d4d4d4);
  margin-top: 2px;
}

.health-summary-detail {
  display: block;
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
  margin-top: 2px;
}

/* ── Coverage ─────────────────────────────────────────────────────── */

.health-coverage-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.health-coverage-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.health-coverage-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.health-coverage-key {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--color-foreground, #d4d4d4);
  text-transform: capitalize;
}

.health-coverage-pct {
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-foreground, #d4d4d4);
  margin-left: auto;
}

.health-coverage-threshold {
  font-size: 10px;
  color: var(--color-muted-foreground, #888);
}

/* ── Benchmarks ───────────────────────────────────────────────────── */

.health-bench-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.health-bench-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
}

.health-bench-name {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--color-foreground, #d4d4d4);
}
</style>
