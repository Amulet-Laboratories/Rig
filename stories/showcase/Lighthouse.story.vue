<script setup lang="ts">
/**
 * Lighthouse — Analytics dashboard with charts
 * Theme: VSCode | Exercises: core, nav, layout, lists, extras + Unovis charts
 *
 * Showcase #14 — Metric cards, traffic time-series, source breakdown,
 * top pages table, performance vitals, reports.
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import Input from '@core/primitives/Input.vue'
import Tabs from '@nav/Tabs.vue'
import StatusBar from '@nav/StatusBar.vue'
import Table from '@lists/Table.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'

import { toast } from '@extras/useToast'

// ---- Unovis ----
import {
  VisXYContainer,
  VisLine,
  VisArea,
  VisAxis,
  VisSingleContainer,
  VisDonut,
  VisStackedBar,
} from '@unovis/vue'

// ---- Mock Data ----
import {
  metricCards,
  timeSeries,
  trafficSources,
  topPages,
  performanceMetrics,
  reports,
  formatNumber,
  formatDuration,
  getStatusColor,
  getStatusBadge,
  pageColumns,
  type TimeSeriesPoint,
} from './fixtures/lighthouse-data'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const activeTab = ref('overview')
const dashTabs = [
  { id: 'overview', label: 'Overview', icon: 'codicon:dashboard' },
  { id: 'pages', label: 'Pages', icon: 'codicon:file' },
  { id: 'performance', label: 'Performance', icon: 'codicon:pulse' },
  { id: 'reports', label: 'Reports', icon: 'codicon:notebook' },
]

const chartMetric = ref<'pageViews' | 'visitors' | 'sessions'>('pageViews')
const chartMetricTabs = [
  { id: 'pageViews', label: 'Page Views' },
  { id: 'visitors', label: 'Visitors' },
  { id: 'sessions', label: 'Sessions' },
]

const pageSort = ref<{ column: string; direction: 'asc' | 'desc' }>({
  column: 'views',
  direction: 'desc',
})

const pageSearch = ref('')

// ---------------------------------------------------------------------------
// Chart accessors
// ---------------------------------------------------------------------------
const lineX = (_d: TimeSeriesPoint, i: number) => i
const lineY = (d: TimeSeriesPoint) => d[chartMetric.value]
const xTickFormat = (i: number) => {
  const pt = timeSeries[Math.round(i)]
  if (!pt) return ''
  return pt.date.slice(8)
}
const yTickFormat = (v: number) => formatNumber(v)

const donutValue = (d: { value: number }) => d.value
const donutColor = trafficSources.map((s) => s.color)

// Stacked bar for bounce rate
const barX = (_d: TimeSeriesPoint, i: number) => i
const barY = (d: TimeSeriesPoint) => d.bounceRate

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const sortedPages = computed(() => {
  let rows = [...topPages]
  if (pageSearch.value) {
    const q = pageSearch.value.toLowerCase()
    rows = rows.filter(
      (p) =>
        p.path.toLowerCase().includes(q) || p.title.toLowerCase().includes(q),
    )
  }
  const { column, direction } = pageSort.value
  const col = column as keyof (typeof rows)[0]
  rows.sort((a, b) => {
    const av = a[col] ?? 0
    const bv = b[col] ?? 0
    if (typeof av === 'number' && typeof bv === 'number')
      return direction === 'asc' ? av - bv : bv - av
    return direction === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })
  return rows
})

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = computed(() => [
  { id: 'app', content: 'Lighthouse Analytics', priority: 1, align: 'left' as const },
  { id: 'pv', content: `${formatNumber(metricCards[0]?.value ?? 0)} page views`, priority: 2, align: 'left' as const },
  { id: 'visitors', content: `${formatNumber(metricCards[1]?.value ?? 0)} visitors`, priority: 3, align: 'right' as const },
  { id: 'period', content: 'March 2026', priority: 4, align: 'right' as const },
])

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function downloadReport(title: string) {
  toast.add({ message: `Downloading ${title}...`, variant: 'info' })
}
</script>

<template>
  <Story title="Lighthouse" icon="codicon:graph" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="lh-shell" data-theme="vscode">
        <div class="lh-main">
          <!-- Tabs -->
          <div class="lh-tab-bar">
            <Tabs v-model="activeTab" :tabs="dashTabs" size="sm" />
          </div>

          <!-- ---- OVERVIEW ---- -->
          <div v-if="activeTab === 'overview'" class="lh-content">
            <!-- Metric cards -->
            <div class="lh-metrics">
              <Card v-for="card in metricCards" :key="card.id">
                <div class="lh-metric-card">
                  <div class="lh-metric-header">
                    <Icon :icon="card.icon" size="sm" class="lh-metric-icon" />
                    <span class="lh-metric-label">{{ card.label }}</span>
                  </div>
                  <div class="lh-metric-value">
                    {{ formatNumber(card.value) }}<span v-if="card.unit" class="lh-metric-unit">{{ card.unit }}</span>
                  </div>
                  <div class="lh-metric-delta" :data-trend="card.trend">
                    <Icon
                      :icon="card.trend === 'up' ? 'codicon:arrow-small-up' : card.trend === 'down' ? 'codicon:arrow-small-down' : 'codicon:dash'"
                      size="xs"
                    />
                    {{ Math.abs(card.delta) }}%
                    <span class="lh-delta-label">vs last month</span>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Chart area -->
            <Card>
              <template #header>
                <div class="lh-chart-header">
                  <h3 class="lh-section-title">Traffic</h3>
                  <Tabs v-model="chartMetric" :tabs="chartMetricTabs" size="xs" />
                </div>
              </template>
              <div class="lh-chart">
                <VisXYContainer :data="timeSeries" :height="280">
                  <VisArea :x="lineX" :y="lineY" color="var(--color-primary, #0078d4)" :opacity="0.15" :curveType="'monotoneX'" />
                  <VisLine :x="lineX" :y="lineY" color="var(--color-primary, #0078d4)" :curveType="'monotoneX'" />
                  <VisAxis type="x" :tickFormat="xTickFormat" :numTicks="10" />
                  <VisAxis type="y" :tickFormat="yTickFormat" :numTicks="5" />
                </VisXYContainer>
              </div>
            </Card>

            <!-- Source breakdown -->
            <div class="lh-row">
              <Card class="lh-donut-card">
                <template #header>
                  <h3 class="lh-section-title">Traffic Sources</h3>
                </template>
                <div class="lh-donut-wrap">
                  <VisSingleContainer :data="trafficSources" :height="220">
                    <VisDonut :value="donutValue" :color="donutColor" :arcWidth="40" :padAngle="0.02" />
                  </VisSingleContainer>
                  <div class="lh-legend">
                    <div
                      v-for="source in trafficSources"
                      :key="source.id"
                      class="lh-legend-item"
                    >
                      <span class="lh-legend-dot" :style="{ background: source.color }" />
                      <span class="lh-legend-label">{{ source.label }}</span>
                      <span class="lh-legend-val">{{ source.value }}%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card class="lh-vitals-card">
                <template #header>
                  <h3 class="lh-section-title">Core Web Vitals</h3>
                </template>
                <div class="lh-vitals">
                  <div
                    v-for="metric in performanceMetrics.slice(0, 3)"
                    :key="metric.id"
                    class="lh-vital"
                  >
                    <div class="lh-vital-top">
                      <span class="lh-vital-label">{{ metric.label }}</span>
                      <Badge :variant="getStatusBadge(metric.status)" size="xs">
                        {{ metric.status }}
                      </Badge>
                    </div>
                    <div class="lh-vital-bar">
                      <div
                        class="lh-vital-fill"
                        :style="{
                          width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                          background: getStatusColor(metric.status),
                        }"
                      />
                    </div>
                    <div class="lh-vital-values">
                      <span>{{ metric.value }}{{ metric.unit }}</span>
                      <span class="lh-vital-target">Target: {{ metric.target }}{{ metric.unit }}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- ---- PAGES ---- -->
          <div v-else-if="activeTab === 'pages'" class="lh-content">
            <Card>
              <template #header>
                <div class="lh-table-header">
                  <h3 class="lh-section-title">Top Pages</h3>
                  <Input
                    v-model="pageSearch"
                    placeholder="Filter pages..."
                    clearable
                    :debounce="150"
                  >
                    <template #leading>
                      <Icon icon="codicon:search" size="sm" />
                    </template>
                  </Input>
                </div>
              </template>
              <Table
                :columns="pageColumns"
                :rows="(sortedPages as unknown as Record<string, unknown>[])"
                :sort="pageSort"
                rowKey="path"
                @sort="pageSort = { column: ($event as unknown as { column: string }).column, direction: ($event as unknown as { direction: 'asc' | 'desc' }).direction }"
              >
                <template #cell-views="{ value }">
                  <span class="lh-num">{{ formatNumber(value as number) }}</span>
                </template>
                <template #cell-avgDuration="{ value }">
                  <span class="lh-num">{{ formatDuration(value as number) }}</span>
                </template>
                <template #cell-bounceRate="{ value }">
                  <Badge
                    :variant="(value as number) > 40 ? 'warning' : (value as number) < 20 ? 'success' : 'muted'"
                    size="xs"
                  >
                    {{ value }}%
                  </Badge>
                </template>
              </Table>
            </Card>
          </div>

          <!-- ---- PERFORMANCE ---- -->
          <div v-else-if="activeTab === 'performance'" class="lh-content">
            <div class="lh-perf-grid">
              <Card v-for="metric in performanceMetrics" :key="metric.id">
                <div class="lh-perf-card">
                  <div class="lh-perf-top">
                    <span class="lh-perf-label">{{ metric.label }}</span>
                    <Badge :variant="getStatusBadge(metric.status)" size="sm">
                      {{ metric.status }}
                    </Badge>
                  </div>
                  <div class="lh-perf-value" :style="{ color: getStatusColor(metric.status) }">
                    {{ metric.value }}<span class="lh-perf-unit">{{ metric.unit }}</span>
                  </div>
                  <div class="lh-perf-bar">
                    <div
                      class="lh-perf-fill"
                      :style="{
                        width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                        background: getStatusColor(metric.status),
                      }"
                    />
                    <div
                      class="lh-perf-target-line"
                      :style="{ left: '100%' }"
                    />
                  </div>
                  <span class="lh-perf-target">Target: {{ metric.target }}{{ metric.unit }}</span>
                </div>
              </Card>
            </div>

            <!-- Bounce rate chart -->
            <Card>
              <template #header>
                <h3 class="lh-section-title">Bounce Rate Trend</h3>
              </template>
              <div class="lh-chart">
                <VisXYContainer :data="timeSeries" :height="220">
                  <VisStackedBar :x="barX" :y="barY" color="var(--color-warning, #ff9800)" :barWidth="0.6" :roundedCorners="2" />
                  <VisAxis type="x" :tickFormat="xTickFormat" :numTicks="10" />
                  <VisAxis type="y" :tickFormat="(v: number) => `${v}%`" :numTicks="5" />
                </VisXYContainer>
              </div>
            </Card>
          </div>

          <!-- ---- REPORTS ---- -->
          <div v-else-if="activeTab === 'reports'" class="lh-content">
            <div class="lh-reports">
              <Card v-for="report in reports" :key="report.id">
                <div class="lh-report">
                  <div class="lh-report-icon">
                    <Icon :icon="report.icon" size="lg" />
                  </div>
                  <div class="lh-report-content">
                    <h4 class="lh-report-title">{{ report.title }}</h4>
                    <p class="lh-report-desc">{{ report.description }}</p>
                    <div class="lh-report-meta">
                      <Badge
                        :variant="report.status === 'ready' ? 'success' : report.status === 'generating' ? 'warning' : 'muted'"
                        size="xs"
                      >
                        {{ report.status }}
                      </Badge>
                      <span class="lh-report-date">
                        {{ new Date(report.generatedAt).toLocaleDateString() }}
                      </span>
                    </div>
                  </div>
                  <Button
                    v-if="report.status === 'ready'"
                    variant="ghost"
                    size="sm"
                    @click="downloadReport(report.title)"
                  >
                    <Icon icon="codicon:cloud-download" size="sm" />
                    Download
                  </Button>
                  <Badge v-else-if="report.status === 'generating'" variant="warning" size="xs">
                    <Icon icon="codicon:loading" size="xs" class="lh-spin" />
                    Processing
                  </Badge>
                  <Badge v-else variant="muted" size="xs">
                    <Icon icon="codicon:clock" size="xs" />
                    Scheduled
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: DARK CHARTS ================== -->
    <Variant title="Traffic Charts">
      <div class="lh-shell" data-theme="vscode">
        <div class="lh-content lh-padded">
          <h2 class="lh-page-title">
            <Icon icon="codicon:graph-line" size="sm" />
            Traffic Analysis
          </h2>

          <div class="lh-chart-tabs">
            <Tabs v-model="chartMetric" :tabs="chartMetricTabs" size="sm" />
          </div>

          <Card>
            <div class="lh-chart lh-chart-lg">
              <VisXYContainer :data="timeSeries" :height="360">
                <VisArea :x="lineX" :y="lineY" color="var(--color-primary, #0078d4)" :opacity="0.12" :curveType="'monotoneX'" />
                <VisLine :x="lineX" :y="lineY" color="var(--color-primary, #0078d4)" :curveType="'monotoneX'" />
                <VisAxis type="x" :tickFormat="xTickFormat" :numTicks="15" />
                <VisAxis type="y" :tickFormat="yTickFormat" :numTicks="6" />
              </VisXYContainer>
            </div>
          </Card>

          <div class="lh-row">
            <Card class="lh-donut-card">
              <template #header>
                <h3 class="lh-section-title">Sources</h3>
              </template>
              <div class="lh-donut-wrap">
                <VisSingleContainer :data="trafficSources" :height="200">
                  <VisDonut :value="donutValue" :color="donutColor" :arcWidth="35" :padAngle="0.02" />
                </VisSingleContainer>
                <div class="lh-legend">
                  <div
                    v-for="source in trafficSources"
                    :key="source.id"
                    class="lh-legend-item"
                  >
                    <span class="lh-legend-dot" :style="{ background: source.color }" />
                    <span class="lh-legend-label">{{ source.label }}</span>
                    <span class="lh-legend-val">{{ source.value }}%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <template #header>
                <h3 class="lh-section-title">Quick Stats</h3>
              </template>
              <div class="lh-quick-stats">
                <div v-for="card in metricCards" :key="card.id" class="lh-quick-stat">
                  <span class="lh-qs-label">{{ card.label }}</span>
                  <span class="lh-qs-value">{{ formatNumber(card.value) }}{{ card.unit }}</span>
                  <span class="lh-qs-delta" :data-trend="card.trend">
                    {{ card.trend === 'down' ? '' : '+' }}{{ card.delta }}%
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: WEB VITALS ================== -->
    <Variant title="Performance Vitals">
      <div class="lh-shell" data-theme="vscode">
        <div class="lh-content lh-padded">
          <h2 class="lh-page-title">
            <Icon icon="codicon:pulse" size="sm" />
            Core Web Vitals
          </h2>
          <div class="lh-perf-grid lh-perf-wide">
            <Card v-for="metric in performanceMetrics" :key="metric.id">
              <div class="lh-perf-card">
                <div class="lh-perf-top">
                  <span class="lh-perf-label">{{ metric.label }}</span>
                  <Badge :variant="getStatusBadge(metric.status)" size="sm">
                    {{ metric.status }}
                  </Badge>
                </div>
                <div class="lh-perf-value" :style="{ color: getStatusColor(metric.status) }">
                  {{ metric.value }}<span class="lh-perf-unit">{{ metric.unit }}</span>
                </div>
                <div class="lh-perf-bar">
                  <div
                    class="lh-perf-fill"
                    :style="{
                      width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                      background: getStatusColor(metric.status),
                    }"
                  />
                </div>
                <span class="lh-perf-target">Target: {{ metric.target }}{{ metric.unit }}</span>
              </div>
            </Card>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY ================== -->
    <Variant title="No Data">
      <div class="lh-shell" data-theme="vscode">
        <div class="lh-empty-center">
          <EmptyState
            title="No analytics data"
            description="Install the tracking snippet to start collecting data."
            icon="codicon:graph"
          >
            <template #action>
              <Button variant="primary" size="sm">
                <Icon icon="codicon:code" size="sm" />
                Get Snippet
              </Button>
            </template>
          </EmptyState>
        </div>
        <StatusBar :items="[{ id: 'status', content: 'No data available', priority: 1, align: 'left' }]" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.lh-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 700px;
  background: var(--color-background, #1e1e1e);
  color: var(--color-foreground, #d4d4d4);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
}

.lh-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ---- Tabs ---- */
.lh-tab-bar {
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border, #333);
}

/* ---- Content ---- */
.lh-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lh-padded {
  padding: 24px;
}

.lh-page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px;
}

/* ---- Metrics row ---- */
.lh-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.lh-metric-card {
  padding: 4px;
}

.lh-metric-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.lh-metric-icon {
  color: var(--color-muted-foreground, #888);
}

.lh-metric-label {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}

.lh-metric-value {
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  margin-bottom: 6px;
}

.lh-metric-unit {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-muted-foreground, #888);
  margin-left: 2px;
}

.lh-metric-delta {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.lh-metric-delta[data-trend='up'] {
  color: #4caf50;
}

.lh-metric-delta[data-trend='down'] {
  color: #e53935;
}

.lh-delta-label {
  color: var(--color-muted-foreground, #666);
  margin-left: 4px;
}

/* ---- Charts ---- */
.lh-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.lh-chart-tabs {
  margin-bottom: 8px;
}

.lh-section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.lh-chart {
  padding: 8px 0;
  min-height: 220px;
}

.lh-chart-lg {
  min-height: 320px;
}

/* ---- Donut / Legend ---- */
.lh-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.lh-donut-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
}

.lh-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 140px;
}

.lh-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.lh-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.lh-legend-label {
  flex: 1;
}

.lh-legend-val {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* ---- Quick stats ---- */
.lh-quick-stats {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lh-quick-stat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lh-qs-label {
  flex: 1;
  font-size: 13px;
  color: var(--color-muted-foreground, #888);
}

.lh-qs-value {
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.lh-qs-delta {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  min-width: 48px;
  text-align: right;
}

.lh-qs-delta[data-trend='up'] {
  color: #4caf50;
}

.lh-qs-delta[data-trend='down'] {
  color: #e53935;
}

/* ---- Table ---- */
.lh-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.lh-num {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

/* ---- Performance vitals ---- */
.lh-perf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.lh-perf-wide {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.lh-perf-card {
  padding: 4px;
}

.lh-perf-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.lh-perf-label {
  font-size: 13px;
  font-weight: 500;
}

.lh-perf-value {
  font-size: 32px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  margin-bottom: 10px;
}

.lh-perf-unit {
  font-size: 14px;
  font-weight: 400;
  margin-left: 2px;
}

.lh-perf-bar {
  height: 6px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 8%, transparent);
  position: relative;
  margin-bottom: 6px;
  overflow: hidden;
}

.lh-perf-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.lh-perf-target {
  font-size: 11px;
  color: var(--color-muted-foreground, #666);
}

/* ---- Vitals compact ---- */
.lh-vitals {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lh-vital-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.lh-vital-label {
  font-size: 12px;
  font-weight: 500;
}

.lh-vital-bar {
  height: 4px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 8%, transparent);
  overflow: hidden;
  margin-bottom: 4px;
}

.lh-vital-fill {
  height: 100%;
  border-radius: 2px;
}

.lh-vital-values {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.lh-vital-target {
  color: var(--color-muted-foreground, #666);
}

/* ---- Reports ---- */
.lh-reports {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lh-report {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px;
}

.lh-report-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-primary, #0078d4) 12%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary, #0078d4);
}

.lh-report-content {
  flex: 1;
  min-width: 0;
}

.lh-report-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 2px;
}

.lh-report-desc {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  margin: 0 0 4px;
}

.lh-report-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lh-report-date {
  font-size: 11px;
  color: var(--color-muted-foreground, #666);
}

/* ---- Spinner ---- */
@keyframes lh-rotate {
  to { transform: rotate(360deg); }
}

.lh-spin {
  animation: lh-rotate 1s linear infinite;
}

/* ---- Empty ---- */
.lh-empty-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
