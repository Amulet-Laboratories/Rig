/**
 * Lighthouse — Analytics dashboard fixture data
 * Metrics, time-series, breakdowns for a web analytics dashboard.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface MetricCard {
  id: string
  label: string
  value: number
  unit: string
  delta: number // percentage change
  trend: 'up' | 'down' | 'flat'
  icon: string
}

export interface TimeSeriesPoint {
  date: string // ISO date
  pageViews: number
  visitors: number
  sessions: number
  bounceRate: number
}

export interface TrafficSource {
  id: string
  label: string
  value: number
  color: string
}

export interface TopPage {
  path: string
  title: string
  views: number
  avgDuration: number // seconds
  bounceRate: number
}

export interface PerformanceMetric {
  id: string
  label: string
  value: number
  target: number
  unit: string
  status: 'good' | 'needs-work' | 'poor'
}

export interface Report {
  id: string
  title: string
  description: string
  generatedAt: string
  status: 'ready' | 'generating' | 'scheduled'
  icon: string
}

// ---------------------------------------------------------------------------
// Metric cards
// ---------------------------------------------------------------------------
export const metricCards: MetricCard[] = [
  {
    id: 'page-views',
    label: 'Page Views',
    value: 142_830,
    unit: '',
    delta: 12.4,
    trend: 'up',
    icon: 'codicon:eye',
  },
  {
    id: 'visitors',
    label: 'Unique Visitors',
    value: 38_291,
    unit: '',
    delta: 8.7,
    trend: 'up',
    icon: 'codicon:person',
  },
  {
    id: 'avg-duration',
    label: 'Avg. Duration',
    value: 4.2,
    unit: 'min',
    delta: -2.1,
    trend: 'down',
    icon: 'codicon:clock',
  },
  {
    id: 'bounce-rate',
    label: 'Bounce Rate',
    value: 34.6,
    unit: '%',
    delta: -5.3,
    trend: 'down',
    icon: 'codicon:arrow-swap',
  },
]

// ---------------------------------------------------------------------------
// Time-series data (30 days, March 2026)
// ---------------------------------------------------------------------------
function generateTimeSeries(): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = []
  for (let d = 1; d <= 30; d++) {
    const day = String(d).padStart(2, '0')
    const base = 3500 + Math.sin(d * 0.4) * 800 + (d > 15 ? 600 : 0)
    const visitors = Math.round(base * 0.35 + Math.random() * 200)
    points.push({
      date: `2026-03-${day}`,
      pageViews: Math.round(base + Math.random() * 300),
      visitors,
      sessions: Math.round(visitors * 1.4 + Math.random() * 100),
      bounceRate: Math.round((30 + Math.random() * 15) * 10) / 10,
    })
  }
  return points
}

export const timeSeries: TimeSeriesPoint[] = generateTimeSeries()

// ---------------------------------------------------------------------------
// Traffic sources (for donut chart)
// ---------------------------------------------------------------------------
export const trafficSources: TrafficSource[] = [
  { id: 'organic', label: 'Organic Search', value: 42, color: '#4caf50' },
  { id: 'direct', label: 'Direct', value: 28, color: '#2196f3' },
  { id: 'referral', label: 'Referral', value: 16, color: '#ff9800' },
  { id: 'social', label: 'Social Media', value: 9, color: '#e91e63' },
  { id: 'email', label: 'Email', value: 5, color: '#9c27b0' },
]

// ---------------------------------------------------------------------------
// Top pages
// ---------------------------------------------------------------------------
export const topPages: TopPage[] = [
  { path: '/', title: 'Home', views: 28_430, avgDuration: 45, bounceRate: 22.1 },
  { path: '/docs/getting-started', title: 'Getting Started', views: 14_820, avgDuration: 312, bounceRate: 18.4 },
  { path: '/pricing', title: 'Pricing', views: 11_260, avgDuration: 128, bounceRate: 35.7 },
  { path: '/blog/release-notes', title: 'Release Notes', views: 9_740, avgDuration: 204, bounceRate: 28.3 },
  { path: '/docs/api-reference', title: 'API Reference', views: 8_190, avgDuration: 540, bounceRate: 12.6 },
  { path: '/changelog', title: 'Changelog', views: 6_350, avgDuration: 95, bounceRate: 42.1 },
  { path: '/about', title: 'About', views: 4_120, avgDuration: 72, bounceRate: 48.9 },
]

// ---------------------------------------------------------------------------
// Performance metrics (web vitals style)
// ---------------------------------------------------------------------------
export const performanceMetrics: PerformanceMetric[] = [
  { id: 'lcp', label: 'Largest Contentful Paint', value: 1.8, target: 2.5, unit: 's', status: 'good' },
  { id: 'fid', label: 'First Input Delay', value: 45, target: 100, unit: 'ms', status: 'good' },
  { id: 'cls', label: 'Cumulative Layout Shift', value: 0.08, target: 0.1, unit: '', status: 'good' },
  { id: 'ttfb', label: 'Time to First Byte', value: 320, target: 200, unit: 'ms', status: 'needs-work' },
  { id: 'fcp', label: 'First Contentful Paint', value: 1.2, target: 1.8, unit: 's', status: 'good' },
  { id: 'tti', label: 'Time to Interactive', value: 3.8, target: 3.0, unit: 's', status: 'poor' },
]

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
export const reports: Report[] = [
  {
    id: 'weekly',
    title: 'Weekly Summary',
    description: 'Traffic overview and key metrics for the past 7 days.',
    generatedAt: '2026-03-28T09:00:00Z',
    status: 'ready',
    icon: 'codicon:calendar',
  },
  {
    id: 'monthly',
    title: 'Monthly Report',
    description: 'Full analytics breakdown for March 2026.',
    generatedAt: '2026-03-31T00:00:00Z',
    status: 'generating',
    icon: 'codicon:graph',
  },
  {
    id: 'performance',
    title: 'Performance Audit',
    description: 'Core Web Vitals and loading performance analysis.',
    generatedAt: '2026-03-25T14:30:00Z',
    status: 'ready',
    icon: 'codicon:dashboard',
  },
  {
    id: 'seo',
    title: 'SEO Analysis',
    description: 'Search ranking, keyword performance, and indexing status.',
    generatedAt: '2026-04-01T08:00:00Z',
    status: 'scheduled',
    icon: 'codicon:search',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatDuration(seconds: number): string {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s > 0 ? `${m}m ${s}s` : `${m}m`
  }
  return `${seconds}s`
}

export function getStatusColor(status: PerformanceMetric['status']): string {
  switch (status) {
    case 'good':
      return '#4caf50'
    case 'needs-work':
      return '#ff9800'
    case 'poor':
      return '#e53935'
  }
}

export function getStatusBadge(
  status: PerformanceMetric['status'],
): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'good':
      return 'success'
    case 'needs-work':
      return 'warning'
    case 'poor':
      return 'danger'
  }
}

export const pageColumns = [
  { id: 'path', label: 'Path', sortable: true },
  { id: 'title', label: 'Page Title', sortable: true },
  { id: 'views', label: 'Views', sortable: true, align: 'right' as const },
  { id: 'avgDuration', label: 'Avg. Duration', sortable: true, align: 'right' as const },
  { id: 'bounceRate', label: 'Bounce Rate', sortable: true, align: 'right' as const },
]
