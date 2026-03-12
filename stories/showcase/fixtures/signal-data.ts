/**
 * Signal Feed — fixture data
 * Real-time data feed with filtering and notifications
 */
import { users as briarUsers } from './briar-cove-users'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type SignalSeverity = 'critical' | 'warning' | 'info' | 'debug'
export type SignalSource = 'api' | 'deploy' | 'monitor' | 'security' | 'ci'

export interface Signal {
  id: string
  title: string
  message: string
  severity: SignalSeverity
  source: SignalSource
  timestamp: string
  read: boolean
  pinned: boolean
  author: (typeof briarUsers)[number] | null
  tags: string[]
  metadata?: Record<string, string>
}

export interface FilterState {
  severity: SignalSeverity[]
  source: SignalSource[]
  readStatus: 'all' | 'unread' | 'read'
}

// ---------------------------------------------------------------------------
// Severity config
// ---------------------------------------------------------------------------
export const severityConfig: Record<
  SignalSeverity,
  { label: string; icon: string; color: string; variant: string }
> = {
  critical: {
    label: 'Critical',
    icon: 'codicon:error',
    color: 'var(--color-danger, #e53935)',
    variant: 'danger',
  },
  warning: {
    label: 'Warning',
    icon: 'codicon:warning',
    color: 'var(--color-warning, #ff9800)',
    variant: 'warning',
  },
  info: {
    label: 'Info',
    icon: 'codicon:info',
    color: 'var(--color-info, #2196f3)',
    variant: 'primary',
  },
  debug: {
    label: 'Debug',
    icon: 'codicon:debug',
    color: 'var(--color-muted-foreground, #888)',
    variant: 'muted',
  },
}

export const sourceConfig: Record<
  SignalSource,
  { label: string; icon: string }
> = {
  api: { label: 'API', icon: 'codicon:cloud' },
  deploy: { label: 'Deploy', icon: 'codicon:rocket' },
  monitor: { label: 'Monitor', icon: 'codicon:pulse' },
  security: { label: 'Security', icon: 'codicon:shield' },
  ci: { label: 'CI/CD', icon: 'codicon:server-process' },
}

// ---------------------------------------------------------------------------
// Signals
// ---------------------------------------------------------------------------
export const signals: Signal[] = [
  {
    id: 'sig-1',
    title: 'API Rate Limit Exceeded',
    message: 'The /api/v2/users endpoint has exceeded the 1000 req/min rate limit. Throttling engaged.',
    severity: 'critical',
    source: 'api',
    timestamp: '2026-03-11T10:23:00',
    read: false,
    pinned: true,
    author: briarUsers[0]!,
    tags: ['rate-limit', 'api-v2', 'production'],
    metadata: { endpoint: '/api/v2/users', threshold: '1000/min', current: '1247/min' },
  },
  {
    id: 'sig-2',
    title: 'Deploy Succeeded',
    message: 'Production deploy v2.14.3 completed successfully. All health checks passing.',
    severity: 'info',
    source: 'deploy',
    timestamp: '2026-03-11T10:15:00',
    read: true,
    pinned: false,
    author: briarUsers[1]!,
    tags: ['deploy', 'v2.14.3', 'production'],
  },
  {
    id: 'sig-3',
    title: 'Memory Usage Spike',
    message: 'Worker node briar-w03 memory usage at 92%. Consider scaling or investigating leak.',
    severity: 'warning',
    source: 'monitor',
    timestamp: '2026-03-11T10:08:00',
    read: false,
    pinned: false,
    author: null,
    tags: ['memory', 'worker', 'briar-w03'],
    metadata: { node: 'briar-w03', usage: '92%', threshold: '85%' },
  },
  {
    id: 'sig-4',
    title: 'Failed Login Attempts',
    message: '47 failed login attempts from IP 192.168.42.100 in the last 5 minutes. IP has been temporarily blocked.',
    severity: 'warning',
    source: 'security',
    timestamp: '2026-03-11T09:55:00',
    read: false,
    pinned: true,
    author: null,
    tags: ['auth', 'brute-force', 'blocked'],
    metadata: { ip: '192.168.42.100', attempts: '47', window: '5min' },
  },
  {
    id: 'sig-5',
    title: 'CI Pipeline Passed',
    message: 'Branch feature/settings-redesign — all 342 tests passed. Coverage 94.2%.',
    severity: 'info',
    source: 'ci',
    timestamp: '2026-03-11T09:42:00',
    read: true,
    pinned: false,
    author: briarUsers[2]!,
    tags: ['ci', 'tests', 'feature-branch'],
  },
  {
    id: 'sig-6',
    title: 'Database Connection Pool Exhausted',
    message: 'Primary database pool reached max connections (200). Queries are being queued.',
    severity: 'critical',
    source: 'monitor',
    timestamp: '2026-03-11T09:30:00',
    read: false,
    pinned: false,
    author: null,
    tags: ['database', 'connections', 'production'],
    metadata: { pool: 'primary', max: '200', queued: '34' },
  },
  {
    id: 'sig-7',
    title: 'SSL Certificate Expiring',
    message: 'SSL certificate for api.briarcove.dev expires in 14 days. Renewal recommended.',
    severity: 'warning',
    source: 'security',
    timestamp: '2026-03-11T09:15:00',
    read: true,
    pinned: false,
    author: null,
    tags: ['ssl', 'certificate', 'expiry'],
    metadata: { domain: 'api.briarcove.dev', expiry: '2026-03-25' },
  },
  {
    id: 'sig-8',
    title: 'Debug: Cache Miss Ratio',
    message: 'Redis cache miss ratio at 12.4% for the last hour. Within normal parameters.',
    severity: 'debug',
    source: 'monitor',
    timestamp: '2026-03-11T09:00:00',
    read: true,
    pinned: false,
    author: null,
    tags: ['cache', 'redis', 'metrics'],
  },
  {
    id: 'sig-9',
    title: 'New API Key Generated',
    message: 'API key created for service account svc-analytics. Scope: read-only.',
    severity: 'info',
    source: 'security',
    timestamp: '2026-03-11T08:45:00',
    read: true,
    pinned: false,
    author: briarUsers[4]!,
    tags: ['api-key', 'service-account'],
  },
  {
    id: 'sig-10',
    title: 'Deploy Rollback Initiated',
    message: 'Automatic rollback triggered for staging deploy v2.14.4-rc1. Health check failure on /health.',
    severity: 'critical',
    source: 'deploy',
    timestamp: '2026-03-11T08:30:00',
    read: false,
    pinned: false,
    author: null,
    tags: ['deploy', 'rollback', 'staging'],
    metadata: { version: 'v2.14.4-rc1', environment: 'staging', reason: 'health-check-failure' },
  },
  {
    id: 'sig-11',
    title: 'CI Pipeline Failed',
    message: 'Branch hotfix/auth-token — 2 test failures in auth.spec.ts. Build aborted.',
    severity: 'warning',
    source: 'ci',
    timestamp: '2026-03-11T08:12:00',
    read: false,
    pinned: false,
    author: briarUsers[3]!,
    tags: ['ci', 'test-failure', 'hotfix'],
  },
  {
    id: 'sig-12',
    title: 'Debug: Request Latency p99',
    message: 'p99 latency for /api/v2/search at 340ms. SLA threshold is 500ms.',
    severity: 'debug',
    source: 'api',
    timestamp: '2026-03-11T08:00:00',
    read: true,
    pinned: false,
    author: null,
    tags: ['latency', 'p99', 'api-v2'],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function formatSignalTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function getRelativeTime(iso: string): string {
  const now = new Date('2026-03-11T10:30:00')
  const then = new Date(iso)
  const diffMin = Math.round((now.getTime() - then.getTime()) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const hrs = Math.floor(diffMin / 60)
  return `${hrs}h ago`
}

export function filterSignals(
  items: Signal[],
  filter: FilterState,
): Signal[] {
  return items.filter((s) => {
    if (filter.severity.length && !filter.severity.includes(s.severity)) return false
    if (filter.source.length && !filter.source.includes(s.source)) return false
    if (filter.readStatus === 'unread' && s.read) return false
    if (filter.readStatus === 'read' && !s.read) return false
    return true
  })
}

export function getUnreadCount(): number {
  return signals.filter((s) => !s.read).length
}

export function getCriticalCount(): number {
  return signals.filter((s) => s.severity === 'critical').length
}

export function getPinnedSignals(): Signal[] {
  return signals.filter((s) => s.pinned)
}
